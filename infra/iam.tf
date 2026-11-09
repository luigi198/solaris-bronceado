# Machine identity used by the Vercel app to upload and delete blog images.
# Access keys are deliberately NOT managed here so the secret never lands in
# Terraform state; see infra/README.md for creating and rotating them.
resource "aws_iam_user" "uploader" {
  name = "solaris-blog-uploader"
  path = "/app/"
}

data "aws_iam_policy_document" "uploader" {
  statement {
    sid       = "PutBlogImagesNoOverwrite"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = [local.public_arn]

    # Only conditional writes (If-None-Match: *) are allowed, so a leaked key
    # cannot replace an existing image. The app always sends this header.
    condition {
      test     = "Null"
      variable = "s3:if-none-match"
      values   = ["false"]
    }
  }
}

data "aws_iam_policy_document" "uploader_delete" {
  # Lets the app remove a deleted post's images. On the versioned bucket this
  # only creates delete markers; s3:DeleteObjectVersion is deliberately NOT
  # granted, so nothing the app (or a leaked key) does is irreversible.
  statement {
    sid       = "DeleteBlogImagesRecoverably"
    effect    = "Allow"
    actions   = ["s3:DeleteObject"]
    resources = [local.public_arn]
  }
}

resource "aws_iam_user_policy" "uploader_delete" {
  name   = "delete-blog-images"
  user   = aws_iam_user.uploader.name
  policy = data.aws_iam_policy_document.uploader_delete.json
}

resource "aws_iam_user_policy" "uploader" {
  name   = "put-blog-images"
  user   = aws_iam_user.uploader.name
  policy = data.aws_iam_policy_document.uploader.json
}
