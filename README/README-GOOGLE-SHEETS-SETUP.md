# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets to save waitlist submissions.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Service account name: `waitlist-service`
   - Click "Create and Continue"
   - Skip role assignment (click "Continue")
   - Click "Done"

## Step 3: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure - don't commit to git!)

## Step 4: Create a Google Sheet

1. Create a new Google Sheet
2. Name it "7K Waitlist" (or any name you prefer)
3. Add headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Email`
   - Column C: `Username`
4. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

## Step 5: Share Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Editor" permissions
5. Click "Send"

## Step 6: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:

   **GOOGLE_SHEET_ID**
   - Value: The Sheet ID you copied in Step 4

   **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Value: The `client_email` from the JSON file (e.g., `waitlist-service@your-project.iam.gserviceaccount.com`)

   **GOOGLE_PRIVATE_KEY**
   - Value: The `private_key` from the JSON file (copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

4. Make sure to add these for "Production", "Preview", and "Development" environments
5. Click "Save"

## Step 7: Redeploy Your Site

After setting up environment variables, redeploy your site:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## Testing

1. Visit your deployed site
2. Click "Join Waitlist"
3. Fill in email and username
4. Submit the form
5. Check your Google Sheet - you should see the new row with timestamp, email, and username!

## Troubleshooting

- **"Failed to save data"**: Check that all environment variables are set correctly in Vercel
- **"Permission denied"**: Make sure you shared the sheet with the service account email
- **"Sheet not found"**: Verify the GOOGLE_SHEET_ID is correct

## Security Note

⚠️ Never commit the service account JSON file to git! It contains sensitive credentials.
The `.gitignore` file already includes `.json` files to prevent accidental commits.
