# GitHub Actions Deployment Setup

## AWS Credentials Setup

Um den automatischen Deployment-Workflow zu aktivieren, müssen Sie AWS Credentials als GitHub Secrets konfigurieren.

### Schritte:

1. **Gehen Sie zu Ihrem GitHub Repository**
   - Navigieren Sie zu `Settings` → `Secrets and variables` → `Actions`

2. **Fügen Sie folgende Secrets hinzu:**

   **AWS_ACCESS_KEY_ID**
   - Klicken Sie auf `New repository secret`
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: Ihr AWS Access Key ID
   - Klicken Sie auf `Add secret`

   **AWS_SECRET_ACCESS_KEY**
   - Klicken Sie auf `New repository secret`
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: Ihr AWS Secret Access Key
   - Klicken Sie auf `Add secret`

### AWS IAM Berechtigungen

Der IAM User benötigt folgende Berechtigungen:

- **S3**: Vollzugriff auf den Deployment-Bucket
  - `s3:PutObject`
  - `s3:GetObject`
  - `s3:DeleteObject`
  - `s3:ListBucket`
  - `s3:PutBucketPolicy`
  - `s3:GetBucketPolicy`

- **CloudFormation**: Stack-Management
  - `cloudformation:CreateStack`
  - `cloudformation:UpdateStack`
  - `cloudformation:DescribeStacks`
  - `cloudformation:DescribeStackEvents`
  - `cloudformation:GetTemplate`

- **CloudFront** (optional, falls verwendet):
  - `cloudfront:CreateInvalidation`
  - `cloudfront:GetInvalidation`

### Beispiel IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::gen-ai-search-*",
        "arn:aws:s3:::gen-ai-search-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:GetTemplate",
        "cloudformation:ValidateTemplate"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

## Workflow Trigger

Der Deployment-Workflow wird ausgelöst bei:

- **Push** auf `main` oder `master` Branch
- **Pull Request** auf `main` oder `master` Branch (nur Build & Test, kein Deployment)
- **Manuell** über GitHub Actions UI (`workflow_dispatch`)

### Manueller Trigger

1. Gehen Sie zu `Actions` Tab in Ihrem Repository
2. Wählen Sie `Build and Deploy` Workflow
3. Klicken Sie auf `Run workflow`
4. Wählen Sie den Branch und klicken Sie auf `Run workflow`

## Troubleshooting

### Deployment schlägt fehl

- Überprüfen Sie die GitHub Secrets
- Stellen Sie sicher, dass die AWS Credentials korrekt sind
- Prüfen Sie die IAM Berechtigungen
- Schauen Sie sich die Workflow-Logs in GitHub Actions an

### Build schlägt fehl

- Stellen Sie sicher, dass alle Tests lokal durchlaufen
- Überprüfen Sie die Linter-Fehler
- Prüfen Sie die Node.js Version (sollte 20.x sein)

## Lokales Testen

Vor dem Push können Sie den Workflow lokal testen:

```bash
# Dependencies installieren
npm ci

# Linter ausführen
npm run lint

# Tests ausführen
npm run test

# Development Build
npm run build

# Production Build
npm run build-production

# Deployment (benötigt AWS Credentials)
serverless deploy --stage production --region eu-central-1
```

