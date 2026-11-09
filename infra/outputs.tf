output "s3_region" {
  value = var.region
}

output "s3_bucket" {
  value = aws_s3_bucket.images.bucket
}

output "image_base_url" {
  description = "Value for NEXT_PUBLIC_IMAGE_BASE_URL."
  value       = "https://${aws_s3_bucket.images.bucket_regional_domain_name}"
}

output "uploader_user_name" {
  value = aws_iam_user.uploader.name
}
