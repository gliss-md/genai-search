# GenAiSearch

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Deployment

This project uses GitHub Actions for continuous deployment to AWS via Serverless Framework.

### Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository secrets configured:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically runs on push to `main` or `master` branch:

1. **Lint** - Runs ESLint checks
2. **Test** - Executes all unit tests with Vitest
3. **Build** - Creates development build
4. **Build Production** - Creates optimized production build
5. **Deploy** - Deploys to AWS S3 via Serverless Framework (only on main/master branch)

### Manual Deployment

To deploy manually, ensure you have AWS credentials configured and run:

```bash
npm install
npm run build-production
serverless deploy --stage production --region eu-central-1
```

### Serverless Configuration

The `serverless.yml` file configures:
- S3 bucket for static hosting
- CloudFront distribution (ID: E3PIPQD0GUBLW4)
- Deployment to `eu-central-1` region

Build output is automatically synced from `dist/gen-ai-search/browser` to S3.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
