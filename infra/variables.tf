variable "expected_account_id" {
  description = "12-digit ID of the solaris-bronceado member account. The provider refuses to run against any other account."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.expected_account_id))
    error_message = "expected_account_id must be a 12-digit AWS account ID."
  }
}

variable "aws_profile" {
  description = "AWS CLI profile (IAM Identity Center) for the solaris-bronceado account."
  type        = string
  default     = "solaris"
}

variable "region" {
  description = "Same region as Vercel's default functions (iad1) so uploads stay low-latency."
  type        = string
  default     = "us-east-1"
}

variable "deleted_image_retention_days" {
  description = "Days a deleted blog image stays recoverable (as a non-public old version) before S3 purges it."
  type        = number
  default     = 30
}

variable "bucket_name" {
  description = "Globally unique bucket name. It appears in public image URLs."
  type        = string
  default     = "solaris-bronceado-blog"
}
