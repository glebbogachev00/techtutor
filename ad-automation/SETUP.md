# TechTutor Free Ad Automation Setup

## Step 1: Meta Marketing API Access

### 1.1 Create Facebook App
1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Choose "Business" type
4. App name: "TechTutor Ad Automation"
5. Contact email: your email
6. Click "Create App"

### 1.2 Add Marketing API Product
1. In your new app dashboard, click "+ Add Product"
2. Find "Marketing API" → Click "Set Up"
3. It will add the product to your app

### 1.3 Get Access Token
1. Go to Tools → Graph API Explorer (left sidebar)
2. Select your app from dropdown (top right)
3. Click "Generate Access Token"
4. Check these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
5. Click "Generate Token"
6. **SAVE THIS TOKEN** → We'll use it in Make.com

### 1.4 Get Your Ad Account ID
1. Go to https://business.facebook.com/
2. Business Settings → Accounts → Ad Accounts
3. Your Ad Account ID looks like: `act_1234567890`
4. **SAVE THIS ID**

---

## Step 2: Install Make.com (Free Tier)

### 2.1 Sign Up
1. Go to https://www.make.com/
2. Sign up (free tier: 1,000 operations/month)
3. Confirm email

### 2.2 Connect Facebook
1. In Make dashboard → Connections
2. Click "+ Add"
3. Search "Facebook"
4. Select "Facebook Ads"
5. Paste your Access Token from Step 1.3
6. Test connection

---

## Step 3: Test Your Setup

Run this in terminal to verify your Meta API access:

```bash
# Replace YOUR_TOKEN and YOUR_AD_ACCOUNT_ID
curl -X GET \
  "https://graph.facebook.com/v21.0/act_YOUR_AD_ACCOUNT_ID/campaigns?access_token=YOUR_TOKEN"
```

If you see JSON with campaigns (or empty array), you're good!

---

## Next: Build the Automation Flow

Once you complete Steps 1-2, we'll build the Make.com scenario that:
1. Takes your campaign brief
2. Calls Claude to generate creatives
3. Uploads to Meta
4. Monitors performance
