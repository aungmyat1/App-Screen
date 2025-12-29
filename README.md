<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TJLJRQ5tfbECvUMNHEemMPqYMBxsW2YC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Development and Troubleshooting

For development setup and troubleshooting help, see the following documentation files in the repository:

- [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) - Comprehensive guide to setting up your development environment
- [WSL_TROUBLESHOOTING.md](WSL_TROUBLESHOOTING.md) - Guide for troubleshooting WSL-related development issues
- [wsl_troubleshoot.sh](wsl_troubleshoot.sh) - A script that performs automated checks for common WSL/Dev Container issues

If you're using Windows with WSL (Windows Subsystem for Linux), run the troubleshooting script to diagnose common issues with your development environment:
```bash
./wsl_troubleshoot.sh
```