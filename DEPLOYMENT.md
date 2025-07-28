# Deployment Guide

This document provides instructions for deploying the SWAG application to various platforms.

## Environment Variables

The application requires the following environment variables to function properly:

### Required Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the API server
  - **Production**: `https://admin.swaggold.co`
  - **Development**: `https://admin.swaggold.co` (or your local API server)

### Setting Environment Variables

#### Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` as needed.

#### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://admin.swaggold.co`
   - **Environment**: Select all environments (Production, Preview, Development)

4. Redeploy your application for the changes to take effect.

#### Other Platforms

For other deployment platforms (Netlify, AWS, etc.), add the environment variable through their respective configuration interfaces.

## Build Issues

### Common Build Errors

#### "NEXT_PUBLIC_API_BASE_URL is not defined"

This error occurs when the environment variable is not set during the build process.

**Solution:**
1. Ensure the environment variable is set in your deployment platform
2. For Vercel: Add the variable in Project Settings → Environment Variables
3. Redeploy the application

#### API Connection Issues

If the application builds but API calls fail:

1. Verify the API base URL is correct
2. Check that the API server is accessible from your deployment environment
3. Ensure CORS is properly configured on the API server

## Deployment Steps

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the environment variables as described above
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Troubleshooting

### Build Fails with Environment Variable Error

1. Check that `NEXT_PUBLIC_API_BASE_URL` is set in your deployment environment
2. Verify the variable name is exactly `NEXT_PUBLIC_API_BASE_URL` (case-sensitive)
3. Ensure the value is a valid URL (e.g., `https://admin.swaggold.co`)

### API Calls Fail in Production

1. Check browser console for CORS errors
2. Verify the API server is accessible from the production domain
3. Ensure the API base URL is correct for the production environment

### Static Generation Issues

The market insights page is now client-side rendered to avoid SSR issues during build time. If you encounter static generation errors:

1. Ensure all components that make API calls are marked with `"use client"`
2. Check that environment variables are available during build time
3. Consider using dynamic imports for components that require client-side only features

## Performance Considerations

- The application uses React Query for API caching
- Images are optimized using Next.js Image component
- Static assets are served from the `public` directory
- Consider enabling CDN for better performance in production

## Security

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the client
- Never put sensitive information in `NEXT_PUBLIC_` variables
- Use server-side environment variables for sensitive data
