# Professional Website

A modern professional website built with Next.js, TypeScript, TailwindCSS, and shadcn/ui components.

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- TailwindCSS for styling
- shadcn/ui components
- Dark/Light mode with next-themes
- Responsive design
- Environment variables configuration for AWS, SendGrid, and MongoDB

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/professional-website.git
cd professional-website
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.local.template .env.local
```

Then edit `.env.local` and fill in your actual values for each environment variable. See [Environment Variables](#environment-variables) section for more details.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

This project uses environment variables for configuration. The following variables are required:

| Variable | Description | Required | Public |
|----------|-------------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | The URL of the website | Yes | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key ID for S3 access | Yes | No |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key for S3 access | Yes | No |
| `AWS_REGION` | AWS region (defaults to us-east-1) | No | No |
| `AWS_S3_BUCKET` | AWS S3 bucket name for file storage | Yes | No |
| `SENDGRID_API_KEY` | SendGrid API key for sending emails | Yes | No |
| `MONGODB_URI` | MongoDB connection string | Yes | No |

For detailed instructions on setting up environment variables for both local development and Vercel deployment, see the [Environment Variables Guide](docs/environment-variables.md).

## Deployment on Vercel

This project is configured for easy deployment on Vercel. Follow these steps to deploy:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.

2. Visit [Vercel](https://vercel.com) and sign up or log in with your GitHub, GitLab, or Bitbucket account.

3. Click on "New Project" and import your repository.

4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build (default)
   - Output Directory: .next (default)

5. Environment Variables:
   - Add all required environment variables to the Vercel project settings.
   - See the [Environment Variables](#environment-variables) section for the list of required variables.

6. Click "Deploy" and wait for the build to complete.

7. Once deployed, Vercel will provide you with a URL to access your website.

### Custom Domain

To use a custom domain with your Vercel deployment:

1. Go to your project dashboard on Vercel.
2. Navigate to "Settings" > "Domains".
3. Add your domain and follow the instructions to configure DNS settings.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components
  - `ui/` - shadcn/ui components
- `lib/` - Utility functions
- `docs/` - Documentation files
- `public/` - Static assets

## Customization

You can customize the website by:

1. Modifying the content in `app/page.tsx`
2. Updating the theme in `app/globals.css`
3. Adding new pages in the `app/` directory
4. Creating new components in the `components/` directory

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 