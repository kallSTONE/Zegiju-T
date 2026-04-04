<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zegiju.T

Professional AI curriculum and syllabus workspace for educators.

## Deploy on Vercel (No Local Install Needed)

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Use build settings:
   `npm run build`
   Output directory: `dist`
4. Add required environment variables in Vercel project settings.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local)
3. Ensure your Firebase web config is present in `firebase-applet-config.json`
4. Run the app:
   `npm run dev`
