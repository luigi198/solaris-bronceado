# Infra (AWS)

Blog image storage: one S3 bucket (public read on `blog/*` only) and one IAM
user that can only create new objects under `blog/`. State is local and
gitignored; it holds no secrets.

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
