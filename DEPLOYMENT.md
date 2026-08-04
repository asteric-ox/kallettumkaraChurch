# Deployment Guide (Cloudflare Pages + Render)

This project has been split into two separate deployments:
- **Frontend (React/Vite)**: Hosted on Cloudflare Pages (Fast, Global CDN)
- **Backend (Express/Node.js)**: Hosted on Render (API server)

Follow these steps carefully to deploy your application.

---

## Step 1: Push Changes to GitHub
First, commit and push all the recent changes to your GitHub repository.
```bash
git add .
git commit -m "Configure split deployment for Cloudflare and Render"
git push origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Because we updated `render.yaml`, Render should automatically detect the changes and redeploy your backend.
3. Wait for the deployment to finish and show as **Live**.
4. **Copy your Render URL** (it looks something like `https://church-website-mern.onrender.com`).

*Note: Your backend is now API-only. If you visit the Render URL directly in your browser, you will see a `Cannot GET /` error, which is perfectly normal. You can test it by visiting `https://your-render-url.onrender.com/api/health`.*

---

## Step 3: Deploy Frontend to Cloudflare Pages

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create application** -> select the **Pages** tab -> click **Connect to Git**.
3. Select your GitHub repository for this project.
4. On the setup page, configure the following **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client` *(Important!)*
5. Scroll down and expand **Environment variables (advanced)**.
6. Add the following variable:
   - **Variable name**: `VITE_API_BASE_URL`
   - **Value**: `https://<YOUR_RENDER_URL>/api` *(Replace with the URL you copied in Step 2. Don't forget the `/api` at the end!)*
7. Click **Save and Deploy**.
8. Wait for the build to finish. Once done, Cloudflare will provide you with a `.pages.dev` URL (e.g., `https://kallettumkara.pages.dev`).

---

## Step 4: Configure CORS on Render

Now that we know your Cloudflare Pages URL, we need to tell the backend to accept requests from it.

1. Go back to your [Render Dashboard](https://dashboard.render.com/).
2. Select your backend service.
3. Go to the **Environment** tab on the left sidebar.
4. Add a new Environment Variable:
   - **Key**: `CLIENT_URL`
   - **Value**: `https://<YOUR_CLOUDFLARE_PAGES_URL>` *(No trailing slash! e.g., `https://kallettumkara.pages.dev`)*
5. Save the changes. Render will restart your server with the new configuration.

---

## Done! 🎉
Your website should now be fully functional. 
- Visit your Cloudflare Pages URL to view the site.
- The frontend will make API calls directly to your Render backend.

> **Important Note about Image Uploads**: Render's free tier uses an ephemeral disk. Any images uploaded to the server (e.g., in the Admin panel) will be lost the next time Render restarts or deploys the service. For permanent image storage, consider integrating Cloudinary or AWS S3 in the future.
