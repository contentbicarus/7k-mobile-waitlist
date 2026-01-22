# Free Tier Monitoring Guide - Never Get Charged

This guide helps you monitor your usage and ensure you **never exceed free tier limits** and **never get charged**.

## 🎯 Key Principle: Hobby Plan = No Charges Ever

**Important:** On Vercel's Hobby plan, you **CANNOT be charged**. If you exceed limits, your site simply stops working - no billing occurs. However, monitoring helps prevent downtime.

---

## 📊 Free Tier Limits Summary

### Vercel Hobby Plan (FREE)
- ✅ **1 million Edge Requests/month** (page views + API calls)
- ✅ **100 GB Fast Data Transfer/month** (bandwidth)
- ✅ **4 hours Active CPU time/month** (serverless function execution)
- ✅ **1 million Function Invocations/month** (API calls)

### Google Sheets API (FREE)
- ✅ **300 read requests/minute** per project
- ✅ **300 write requests/minute** per project
- ✅ **Unlimited daily requests** (as long as you stay under per-minute limits)
- ✅ **No billing** - exceeding limits just returns rate limit errors

---

## 🔍 How to Monitor Usage

### 1. Monitor Vercel Usage

#### Step 1: Check Current Usage
1. Go to: https://vercel.com/dashboard
2. Select your project: **7k-waitlist**
3. Click **Settings** → **Usage**
4. View your current month's usage:
   - Edge Requests
   - Fast Data Transfer
   - Active CPU Time
   - Function Invocations

#### Step 2: Set Up Usage Alerts (Recommended)
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Usage**
4. Scroll to **Usage Alerts**
5. Set alerts at:
   - **Edge Requests:** Alert at 800,000 (80% of 1M limit)
   - **Fast Data Transfer:** Alert at 80 GB (80% of 100 GB limit)
   - **Active CPU Time:** Alert at 3 hours (75% of 4 hours)
   - **Function Invocations:** Alert at 800,000 (80% of 1M limit)

**Note:** Vercel will email you when you hit these thresholds.

#### Step 3: Check Usage Regularly
- **Weekly check:** Visit the Usage page every Monday
- **After traffic spikes:** Check immediately if you notice increased traffic
- **Before month-end:** Check around the 25th of each month

---

### 2. Monitor Google Sheets API Usage

#### Option A: Google Cloud Console (Recommended)
1. Go to: https://console.cloud.google.com
2. Select your project: **k-waitlist**
3. Navigate to **APIs & Services** → **Dashboard**
4. Find **Google Sheets API** in the list
5. Click on it to see:
   - Requests per day
   - Requests per minute
   - Error rates

#### Option B: Check Vercel Logs
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Deployments** → Select latest deployment → **Functions** tab
4. Click on `api/submit-waitlist`
5. View logs for any rate limit errors (429 status codes)

#### Option C: Add Rate Limit Monitoring to Your Code
Add this to your `api/submit-waitlist.js` to track usage:

```javascript
// Add at the top of your handler function
const logUsage = () => {
  console.log('API Call:', {
    timestamp: new Date().toISOString(),
    endpoint: '/api/submit-waitlist',
    // This helps you track usage in Vercel logs
  });
};

// Call it at the start of your handler
module.exports = async function handler(req, res) {
  logUsage();
  // ... rest of your code
};
```

---

## 🚨 What Happens When Limits Are Exceeded?

### Vercel Hobby Plan
- ❌ **No charges** - billing is disabled
- ⚠️ **Site stops working** - requests fail
- ✅ **Resets monthly** - limits reset on the 1st of each month
- ✅ **No data loss** - your code and data remain intact

### Google Sheets API
- ❌ **No charges** - API is free
- ⚠️ **Rate limit errors** - returns HTTP 429 (Too Many Requests)
- ✅ **Auto-retry** - wait 1 minute and try again
- ✅ **No data loss** - failed requests don't save data

---

## 💡 Best Practices to Stay Within Limits

### For Vercel Usage

#### 1. Optimize Your API Function
Your current function is already efficient, but here are tips:

```javascript
// ✅ GOOD: Fast response times
// Your function already does this - it's simple and fast

// ❌ BAD: Long-running operations
// Don't add heavy processing in your API function
```

#### 2. Reduce Function Execution Time
- Keep your function simple (like it is now)
- Avoid heavy computations
- Use caching if possible

#### 3. Monitor Edge Requests
- Each page view = 1 Edge Request
- Each form submission = 1 Edge Request (for the API call)
- **Estimate:** If you get 10,000 visitors/month, that's ~10,000 Edge Requests (well under 1M limit)

#### 4. Monitor Bandwidth
- Your site is mostly static HTML/CSS/JS
- Images are hosted externally (Supabase CDN)
- **Estimate:** Each page load ~500KB × 10,000 visitors = ~5 GB/month (well under 100 GB limit)

### For Google Sheets API

#### 1. Rate Limiting Protection
Add rate limiting to prevent hitting API limits:

```javascript
// Add this helper function to your api/submit-waitlist.js
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset every minute

function checkRateLimit() {
  const now = Date.now();
  if (now > resetTime) {
    requestCount = 0;
    resetTime = now + 60000;
  }
  
  if (requestCount >= 50) { // Conservative limit (well under 300/min)
    throw new Error('Rate limit exceeded. Please try again in a moment.');
  }
  
  requestCount++;
}
```

#### 2. Handle Rate Limit Errors Gracefully
Your code already handles errors, but you can improve it:

```javascript
// In your catch block, add specific handling for rate limits
catch (error) {
  if (error.code === 429 || error.message.includes('429')) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again in a moment.',
      retryAfter: 60 // seconds
    });
  }
  // ... rest of error handling
}
```

#### 3. Batch Operations (Future Enhancement)
If you need to process multiple submissions:
- Instead of multiple API calls, batch them
- But for a waitlist form, one-at-a-time is fine

---

## 📈 Realistic Usage Estimates

### For a Small Waitlist Project

**Scenario:** 1,000 waitlist signups/month

#### Vercel Usage:
- **Edge Requests:** ~2,000/month (page views + API calls)
  - ✅ **Well under 1M limit** (0.2% usage)
- **Bandwidth:** ~1 GB/month
  - ✅ **Well under 100 GB limit** (1% usage)
- **CPU Time:** ~0.1 hours/month
  - ✅ **Well under 4 hours limit** (2.5% usage)
- **Function Invocations:** ~1,000/month
  - ✅ **Well under 1M limit** (0.1% usage)

#### Google Sheets API:
- **Write Requests:** ~1,000/month = ~0.7 requests/minute average
  - ✅ **Well under 300 requests/minute limit** (0.2% usage)

**Conclusion:** You'd need **500x more traffic** to hit limits!

---

## 🛡️ Safety Measures

### 1. Set Up Vercel Usage Alerts (Do This Now!)
1. Go to: https://vercel.com/dashboard
2. Select **7k-waitlist** project
3. **Settings** → **Usage** → **Usage Alerts**
4. Set alerts at 80% of each limit

### 2. Monitor Monthly
- Set a calendar reminder for the 25th of each month
- Check Vercel Usage dashboard
- Check Google Cloud Console for API usage

### 3. Add Rate Limiting (Optional but Recommended)
Add client-side rate limiting to prevent abuse:

```javascript
// Add to your index.html submitForm function
let lastSubmissionTime = 0;
const MIN_SUBMISSION_INTERVAL = 5000; // 5 seconds between submissions

async function submitForm() {
  const now = Date.now();
  if (now - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
    alert('Please wait a moment before submitting again.');
    return;
  }
  lastSubmissionTime = now;
  
  // ... rest of your submitForm code
}
```

### 4. Disable Billing (Already Done)
- ✅ You're on Hobby plan - billing is disabled
- ✅ Cannot be charged even if limits are exceeded
- ✅ Site just stops working if limits are hit

---

## 🔔 Alert Setup Checklist

- [ ] Set Vercel usage alerts at 80% thresholds
- [ ] Check Vercel usage dashboard weekly
- [ ] Monitor Google Cloud Console monthly
- [ ] Set calendar reminder for monthly check
- [ ] Add rate limiting to prevent abuse (optional)

---

## 📞 What to Do If You Hit Limits

### If Vercel Limits Are Hit:
1. **Don't panic** - no charges occurred
2. Wait until the 1st of next month (limits reset)
3. Or upgrade to Pro plan ($20/month) if needed
4. Check what caused the spike (traffic spike? bug?)

### If Google Sheets API Limits Are Hit:
1. **Don't panic** - no charges occurred
2. Wait 1 minute and retry
3. Implement exponential backoff (already in your error handling)
4. Check for abuse (multiple rapid submissions?)

---

## ✅ Monthly Checklist

On the 25th of each month, check:

- [ ] Vercel Edge Requests: Current / 1,000,000
- [ ] Vercel Bandwidth: Current GB / 100 GB
- [ ] Vercel CPU Time: Current hours / 4 hours
- [ ] Vercel Function Invocations: Current / 1,000,000
- [ ] Google Sheets API: Any rate limit errors in logs?

---

## 🎯 Bottom Line

**You're safe!** For a playground waitlist project:

1. ✅ **Vercel Hobby plan cannot charge you** - billing is disabled
2. ✅ **Google Sheets API is free** - no billing possible
3. ✅ **Your usage is tiny** - you'd need 500x more traffic to hit limits
4. ✅ **Set up alerts** - get notified before hitting limits
5. ✅ **Monitor monthly** - takes 2 minutes to check

**You will NOT be charged** as long as you stay on the Hobby plan. Even if you exceed limits, Vercel just stops serving your site - no charges occur.
