# Quick Start Guide

## Prerequisites
- Node.js installed (v16 or higher)
- Vercel account
- Google Cloud Platform account (for Google Sheets integration)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID=your-google-sheet-id
```

**Important**: 
- The private key must include `\n` for newlines
- See `README/README-GOOGLE-SHEETS-SETUP.md` for detailed setup instructions

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to production
vercel --prod
```

### 4. Test the Deployment

1. Visit your deployed URL
2. Test the waitlist form submission
3. Verify data appears in your Google Sheet

## Project Structure

```
├── index.html              # Main landing page
├── styles.css              # Stylesheet
├── package.json           # Dependencies
├── api/
│   └── submit-waitlist.js # Form submission API endpoint
├── images/                # Image assets
└── README/                # Documentation
```

## Key Features

- **Interactive Phone Easter Egg**: Tap phone 7 times to see crack effects, then tap 8th time for explosion
- **Waitlist Form**: Collects email and username, saves to Google Sheets
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Color overflow, water rising effects, quotes

## Troubleshooting

See `README/TROUBLESHOOTING.md` for common issues and solutions.

## Support

For Google Sheets setup: See `README/README-GOOGLE-SHEETS-SETUP.md`
For monitoring: See `README/FREE-TIER-MONITORING.md`
For packaging guide: See `README/PACKAGING-GUIDE.md`
For GitHub setup: See `README/GITHUB-SETUP.md`
