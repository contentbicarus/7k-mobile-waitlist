# Project Packaging Guide

This guide explains how to package and share the 7K Waitlist project with another department.

## Files to Include

### ✅ Essential Files (MUST include)
- `index.html` - Main landing page
- `styles.css` - Stylesheet
- `package.json` - Dependencies configuration
- `api/submit-waitlist.js` - API endpoint for form submissions
- `images/` folder - All image assets:
  - `7k-mobile-logo-full.png`
  - `phone_2_1.png`
  - `image.png`
  - `crack-texture-png-free-thumb22.png`
- `README/` folder - Documentation:
  - `README-GOOGLE-SHEETS-SETUP.md` - Google Sheets integration setup
  - `FREE-TIER-MONITORING.md` - Monitoring guide
  - `TROUBLESHOOTING.md` - Troubleshooting guide

### ❌ Files to EXCLUDE
- `node_modules/` - Will be installed via `npm install`
- `.git/` folder - Git repository (if exists)
- `generated-page.html` - Backup/generated file (not needed)
- `format-private-key.js` - Local helper script (not needed)
- `api/test-env.js` - Testing endpoint (not needed for production)
- Unused images:
  - `images/555a77f3-f086-4f6b-9bee-5b5e25d582af_800w.png` (old Supabase image)
  - `images/phone.png` (replaced by phone_2_1.png)

## Packaging Steps

### Option 1: Manual ZIP (Recommended)
1. Create a new folder named `7k-waitlist-project`
2. Copy all essential files listed above
3. Compress the folder to `7k-waitlist-project.zip`
4. Share the ZIP file

### Option 2: Using Git (If using version control)
```bash
git archive --format=zip --output=7k-waitlist-project.zip HEAD
```

### Option 3: PowerShell Script (Windows)
```powershell
# Create package folder
New-Item -ItemType Directory -Path "7k-waitlist-package" -Force

# Copy essential files
Copy-Item "index.html" -Destination "7k-waitlist-package\"
Copy-Item "styles.css" -Destination "7k-waitlist-package\"
Copy-Item "package.json" -Destination "7k-waitlist-package\"
Copy-Item "api" -Destination "7k-waitlist-package\" -Recurse -Exclude "test-env.js"
Copy-Item "images" -Destination "7k-waitlist-package\" -Recurse -Exclude "555a77f3-f086-4f6b-9bee-5b5e25d582af_800w.png","phone.png"
Copy-Item "README" -Destination "7k-waitlist-package\" -Recurse

# Create ZIP
Compress-Archive -Path "7k-waitlist-package" -DestinationPath "7k-waitlist-project.zip" -Force

# Cleanup
Remove-Item "7k-waitlist-package" -Recurse -Force
```

## What to Include in the Package

### 1. Setup Instructions (Create `SETUP.md`)
Include instructions for:
- Installing dependencies (`npm install`)
- Setting up environment variables in Vercel
- Deploying to Vercel
- Google Sheets API setup

### 2. Environment Variables Required
List all environment variables needed:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

### 3. Deployment Instructions
- How to deploy to Vercel
- How to set environment variables
- How to test the API endpoint

## Package Structure

```
7k-waitlist-project/
├── index.html
├── styles.css
├── package.json
├── api/
│   └── submit-waitlist.js
├── images/
│   ├── 7k-mobile-logo-full.png
│   ├── phone_2_1.png
│   ├── image.png
│   └── crack-texture-png-free-thumb22.png
└── README/
    ├── README-GOOGLE-SHEETS-SETUP.md
    ├── FREE-TIER-MONITORING.md
    └── TROUBLESHOOTING.md
```

## Quick Setup for Recipient

1. Extract the ZIP file
2. Run `npm install` to install dependencies
3. Set up environment variables in Vercel
4. Deploy using `vercel --prod`
5. Follow `README/README-GOOGLE-SHEETS-SETUP.md` for Google Sheets integration

## File Size Considerations

- Current project size: ~1-2 MB (without node_modules)
- With node_modules: ~50-100 MB (exclude this!)
- Recommended: Package without node_modules, let recipient run `npm install`

## Security Notes

⚠️ **IMPORTANT**: Do NOT include:
- `.env` files (if any)
- Private keys in code
- API keys or secrets
- Service account JSON files

All sensitive data should be set as environment variables in Vercel.
