locals {
  # Must match buildImageKey() in src/lib/images/imageUrl.ts and the
  # remotePatterns pathname in next.config.ts.
  public_prefix = "blog/"
  public_arn    = "${aws_s3_bucket.images.arn}/${local.public_prefix}*"
}

resource "aws_s3_bucket" "images" {
  bucket = var.bucket_name
}

# No ACLs at all: access is governed only by the bucket policy and IAM.
resource "aws_s3_bucket_ownership_controls" "images" {
  bucket = aws_s3_bucket.images.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# ACL-based public access stays blocked; only the explicit policy below may grant public read.
resource "aws_s3_bucket_public_access_block" "images" {
  bucket                  = aws_s3_bucket.images.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

# Deleting a post deletes its images. With versioning that only adds a delete
# marker: the image stops being public immediately but stays recoverable, and
# the app's IAM user cannot remove versions, so a leaked key cannot destroy
# anything permanently.
resource "aws_s3_bucket_versioning" "images" {
  bucket = aws_s3_bucket.images.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  rule {
    id     = "purge-deleted-images"
    status = "Enabled"
    filter {}

    # Recovery window for deleted (or, in theory, overwritten) images.
    noncurrent_version_expiration {
      noncurrent_days = var.deleted_image_retention_days
    }

    # Clean up delete markers once no versions remain behind them.
    expiration {
      expired_object_delete_marker = true
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }

  depends_on = [aws_s3_bucket_versioning.images]
}

resource "aws_s3_bucket_server_side_encryption_configuration" "images" {
  bucket = aws_s3_bucket.images.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

data "aws_iam_policy_document" "images_bucket" {
  # Anyone may read blog images; nobody anonymous may list the bucket or read other keys.
  statement {
    sid       = "PublicReadBlogImages"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = [local.public_arn]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }

  statement {
    sid       = "DenyInsecureTransport"
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.images.arn, "${aws_s3_bucket.images.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "images" {
  bucket = aws_s3_bucket.images.id
  policy = data.aws_iam_policy_document.images_bucket.json

  # A public policy is rejected until the public access block allows it.
  depends_on = [aws_s3_bucket_public_access_block.images]
}
