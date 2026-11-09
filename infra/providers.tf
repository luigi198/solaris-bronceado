provider "aws" {
  profile = var.aws_profile
  region  = var.region

  # Hard stop if the profile resolves to any other account, whatever its name says.
  allowed_account_ids = [var.expected_account_id]

  default_tags {
    tags = {
      Project   = "solaris-bronceado"
      ManagedBy = "terraform"
    }
  }
}
