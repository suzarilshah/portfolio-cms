# Deployment Guide

## Vercel Environment Variables

For the admin panel to work correctly in production, the following environment variables must be configured in Vercel:

### Required Variables

1. **Database Configuration**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```
   - Get this from your Neon database dashboard

2. **Appwrite Configuration**
   ```
   APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   ```

3. **Stack Auth Configuration** (Critical for admin panel)
   ```
   NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
   STACK_SECRET_SERVER_KEY=your_secret_key
   ```
   - Get these from your Stack Auth dashboard
   - `STACK_SECRET_SERVER_KEY` is especially important for server-side authentication

4. **Site Configuration**
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

### Setup Steps

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the variables above with their correct values
4. Make sure to select the appropriate environments (Production, Preview, Development)
5. Redeploy your application after adding the variables

### Troubleshooting

If you get a 500 error on the `/admin` page:
1. Check that all Stack Auth variables are set correctly in Vercel
2. Verify the `STACK_SECRET_SERVER_KEY` is not missing
3. Check Vercel's Function Logs for detailed error messages
4. Ensure the DATABASE_URL is pointing to your Neon database

### Note

The admin panel requires server-side authentication, which only works when all Stack Auth environment variables are properly configured in your deployment environment.
