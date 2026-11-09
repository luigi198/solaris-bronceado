# Infra (AWS)

Blog image storage: one versioned S3 bucket (public read on `blog/*` only) and
one IAM user that can create new objects under `blog/` and delete them. Deletes
only add delete markers; old versions are purged after
`deleted_image_retention_days` (30). State is local and gitignored; it holds no
secrets.

## Restore a deleted image

```bash
aws s3api list-object-versions --bucket <bucket> --prefix blog/<key> --profile solaris
aws s3api delete-object --bucket <bucket> --key blog/<key> --version-id <DELETE_MARKER_VERSION_ID> --profile solaris
```

Removing the delete marker makes the previous version current (and public) again.

## Apply

```bash
aws sso login --profile solaris
aws sts get-caller-identity --profile solaris   # must print the solaris account ID
terraform init
terraform plan  -var expected_account_id=<ACCOUNT_ID>
terraform apply -var expected_account_id=<ACCOUNT_ID>
```

`allowed_account_ids` makes the provider abort if the profile resolves to any
other account.

## Access keys (created outside Terraform so the secret stays out of state)

Create: `aws iam create-access-key --user-name solaris-blog-uploader --profile solaris`
and put the values in `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` (`.env.local`
and Vercel Production + Preview).

Rotate: create a second key, update Vercel and redeploy, then
`aws iam delete-access-key --user-name solaris-blog-uploader --access-key-id <OLD> --profile solaris`.
