# Deployment Guide

This project is a static React application built with Vite and powered by a Supabase backend. It is configured to be deployed to GitHub Pages, while data and authentication are handled securely via Supabase.

## 1. Supabase Setup (Backend)

The app's data is stored in a Supabase project. There is no custom Node.js server. Instead, we use Supabase to store content like Rosters, Content Creators, and handle Admin Panel login securely. 

### Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create an account.
2. Create a new project. 

### Step 2: Configure Authentication for the Admin Panel
1. In your Supabase dashboard, go to **Authentication** -> **Providers**.
2. Make sure **Email** is enabled, and **disable** "Confirm email" (it's simpler for private admin usage).
3. Go to **Authentication** -> **Users** and add a new user. This will be your admin login. Use an email and a strong password.

### Step 3: Get Your Environment Variables
You need two values from Supabase:
1. In your project settings, go to **Project Settings** -> **API**.
2. Copy your **Project URL** (`VITE_SUPABASE_URL`).
3. Copy your **anon / public key** (`VITE_SUPABASE_ANON_KEY`).

**IMPORTANT**: Never share your Service Role key publicly. Your frontend only needs the `anon` key.

## 2. Setting Up GitHub Secrets

To deploy automatically with GitHub Actions, the deployment script needs access to your Supabase keys to compile the frontend successfully.

1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret** and add the following two secrets exactly:

| Secret Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon / public key |

*(Note: Ensure your GitHub Actions workflow file maps these secrets during the `npm run build` step. See `.github/workflows/deploy.yml`)*

## 3. Deployment

### Option A: Automatic Git Deployment (Recommended)
If your GitHub Actions are set up, pushing code to the `main` branch will automatically trigger a build.
1. Push to `main`.
2. Go to the **Actions** tab in GitHub to watch the build.
3. Your site will automatically go live via GitHub Pages.

### Option B: Manual Local Deployment
If you prefer not to use GitHub Actions, you can deploy manually from your terminal:

1. Create a `.env` file locally (derived from `.env.example`) and insert your keys:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
   *(This will run Vite build and push the built assets into the `gh-pages` branch).*

## 4. Verification & Testing

Once deployed, you can verify your setup by:
1. Navigating to your deployed URL.
2. Clicking the hidden/admin panel route or button.
3. Logging in with the email and password you created in your Supabase Authentication dashboard.
4. If successful, you will be able to perform CRUD actions (Create, Read, Update, Delete) securely on your database.

## Troubleshooting

### "Invalid Login Credentials"
- Double check that you've correctly added the user inside Supabase Auth dashboard.
- Ensure the user's password is correct and email confirmation was disabled (or the email was confirmed).

### Admin Panel Doesn't Load Data
- Check the browser Console via F12.
- If you see `supabase url is required` or similar, it means the app was compiled without access to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Make sure your GitHub secrets are correct or manually compile locally.
- Double-check that your RLS (Row Level Security) policies aren't inadvertently blocking read queries if you've turned them on.
