const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username, timestamp } = req.body;

  // Validate input
  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  try {
    // Initialize Google Sheets API
    // Fix private key formatting - handle various formats from Vercel env vars
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    
    // Remove quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    // Ensure proper line breaks - critical for PEM format
    if (!privateKey.includes('\n')) {
      // If no newlines, try to add them around BEGIN/END markers
      privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n');
      privateKey = privateKey.replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----');
    }
    
    // Verify we have all required credentials
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey || !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Missing required environment variables');
    }
    
    // Verify private key format
    if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
      throw new Error('Invalid private key format - must include BEGIN and END markers');
    }
    
    // Debug logging (will show in Vercel logs)
    console.log('Auth setup:', {
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.substring(0, 30) + '...',
      privateKeyLength: privateKey.length,
      privateKeyStart: privateKey.substring(0, 30),
      privateKeyEnd: privateKey.substring(privateKey.length - 30),
      hasNewlines: privateKey.includes('\n'),
      sheetId: process.env.GOOGLE_SHEET_ID
    });
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim(),
        private_key: privateKey.trim(),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Test authentication before proceeding
    const authClient = await auth.getClient();
    console.log('Authentication successful');

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // First, verify we can access the sheet
    try {
      await sheets.spreadsheets.get({
        spreadsheetId,
      });
    } catch (accessError) {
      console.error('Cannot access sheet:', accessError.message);
      throw new Error(`Cannot access sheet: ${accessError.message}. Please verify the sheet is shared with ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    }

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[timestamp, email, username]],
      },
    });

    return res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      hasClientEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      sheetId: process.env.GOOGLE_SHEET_ID,
    });
    
    // Return more helpful error message
    let errorMessage = 'Failed to save data';
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      errorMessage = 'Missing environment variables. Please check Vercel settings.';
    } else if (error.message.includes('PERMISSION_DENIED') || error.message.includes('permission')) {
      errorMessage = 'Permission denied. Please share the sheet with the service account email.';
    } else if (error.message.includes('not found') || error.message.includes('404')) {
      errorMessage = 'Sheet not found. Please check the GOOGLE_SHEET_ID.';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: error.message
    });
  }
};
