# Troubleshooting Guide - Google Sheets Integration

If form submissions aren't appearing in your Google Sheet, follow these steps:

## Step 1: Check Browser Console

1. Open your deployed site
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Submit the form
5. Look for any error messages (red text)

**Common errors:**
- `Failed to fetch` - API endpoint not found or CORS issue
- `Failed to submit: ...` - API returned an error
- Network errors - Check if API is deployed

## Step 2: Check Vercel Function Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** tab
4. Click on your latest deployment
5. Click **Functions** tab
6. Click on `api/submit-waitlist`
7. Check the **Logs** tab for errors

**Look for:**
- Environment variable errors
- Google Sheets API errors
- Authentication errors

## Step 3: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, verify:

### ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- Should be: `waitlist-service@k-waitlist.iam.gserviceaccount.com`
- No extra spaces or quotes

### ✅ GOOGLE_PRIVATE_KEY
- Must include `-----BEGIN PRIVATE KEY-----` at the start
- Must include `-----END PRIVATE KEY-----` at the end
- Should be on multiple lines (the `\n` will be converted automatically)
- No extra quotes around it

### ✅ GOOGLE_SHEET_ID
- Get this from your Google Sheet URL
- URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- Copy only the `SHEET_ID_HERE` part (long alphanumeric string)
- No extra spaces or quotes

## Step 4: Verify Google Sheet Setup

1. **Check Sheet Name:**
   - Your sheet tab should be named `Sheet1` (default)
   - Or update the range in `api/submit-waitlist.js` line 32

2. **Check Sheet Sharing:**
   - Open your Google Sheet
   - Click **Share** button
   - Verify `waitlist-service@k-waitlist.iam.gserviceaccount.com` is added
   - Must have **Editor** permissions (not Viewer)
   - If not added, add it now

3. **Check Headers:**
   - Row 1 should have headers (optional, but recommended)
   - Column A: Timestamp
   - Column B: Email  
   - Column C: Username

## Step 5: Test API Endpoint Directly

You can test the API endpoint directly using curl or Postman:

```bash
curl -X POST https://your-site.vercel.app/api/submit-waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "timestamp": "2026-01-21T00:00:00.000Z"
  }'
```

Or use this in your browser console:
```javascript
fetch('/api/submit-waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    username: 'testuser',
    timestamp: new Date().toISOString()
  })
}).then(r => r.json()).then(console.log).catch(console.error);
```

## Step 6: Common Issues & Solutions

### Issue: "Failed to fetch"
**Solution:** 
- API might not be deployed. Redeploy: `vercel --prod`
- Check if `/api/submit-waitlist` exists in your deployment

### Issue: "Failed to save data"
**Solution:**
- Check Vercel logs (Step 2)
- Verify all 3 environment variables are set
- Make sure sheet is shared with service account

### Issue: "Permission denied" or "Sheet not found"
**Solution:**
- Verify `GOOGLE_SHEET_ID` is correct
- Verify sheet is shared with service account email
- Check service account has Editor permissions

### Issue: "Invalid credentials"
**Solution:**
- Verify `GOOGLE_PRIVATE_KEY` includes BEGIN/END lines
- Check for extra spaces or quotes
- Make sure private key is complete

### Issue: Data appears but in wrong format
**Solution:**
- Check the range in `api/submit-waitlist.js` line 32
- Verify sheet tab name matches (default is `Sheet1`)

## Step 7: Redeploy After Changes

After fixing environment variables:
1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click **Redeploy** on latest deployment
   OR
4. Run: `vercel --prod` from your project folder

**Important:** Environment variable changes require a redeploy!

## Step 8: Enable Detailed Logging

If still not working, temporarily add this to see more details:

In `api/submit-waitlist.js`, add before the try block:
```javascript
console.log('Request received:', { email, username, timestamp });
console.log('Env check:', {
  hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
  hasSheetId: !!process.env.GOOGLE_SHEET_ID,
  sheetId: process.env.GOOGLE_SHEET_ID
});
```

Then check Vercel logs again.

## Still Not Working?

1. Double-check all environment variables in Vercel
2. Verify service account JSON file matches what you entered
3. Make sure Google Sheets API is enabled in Google Cloud Console
4. Check Vercel function logs for specific error messages
5. Try creating a new service account and starting fresh
