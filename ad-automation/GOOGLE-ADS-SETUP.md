# TechTutor Google Ads Automation Setup

## Step 1: Create Google Ads Account

### 1.1 Sign Up
1. Go to https://ads.google.com/
2. Click "Start Now"
3. Sign in with your Google account (use the one associated with TechTutor)
4. Follow the setup wizard:
   - **Goal**: "Get more website sales or sign-ups"
   - **Website**: https://techtutor.academy
   - **Business name**: TechTutor Academy
   - **Country**: Vietnam (or where you're operating from)
   - **Time zone**: Asia/Ho_Chi_Minh
   - **Currency**: VND (Vietnamese Dong) or USD

### 1.2 Skip the "Create your first campaign" wizard
- Click "Switch to Expert Mode" (bottom of page)
- Then click "Create account without a campaign"
- **Why**: We'll set up campaigns via automation, not the wizard

### 1.3 Add Payment Method
1. Go to Tools & Settings (wrench icon, top right)
2. Billing → Payment Methods
3. Add credit card or bank transfer
4. **Tip**: Start with small daily budget ($10-20/day) for testing

---

## Step 2: Enable Google Ads API

### 2.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Project name: "TechTutor Ads Automation"
4. Click "Create"

### 2.2 Enable Google Ads API
1. In Cloud Console, go to "APIs & Services" → "Library"
2. Search "Google Ads API"
3. Click "Google Ads API" → "Enable"

### 2.3 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen:
   - User Type: External
   - App name: TechTutor Ads Automation
   - Support email: your email
   - Scopes: Leave default
   - Save
4. Create OAuth client:
   - Application type: "Web application"
   - Name: "Make.com Integration"
   - Authorized redirect URIs: `https://www.make.com/oauth/cb/google`
   - Click "Create"
5. **SAVE** your Client ID and Client Secret

### 2.4 Get Your Google Ads Customer ID
1. Go back to https://ads.google.com/
2. Look at top right corner
3. Your Customer ID is a 10-digit number like `123-456-7890`
4. **Remove the dashes** → `1234567890`
5. **SAVE THIS** (you'll need it for Make.com)

---

## Step 3: Test Your Setup

Run this to verify you have everything:

```bash
# You should have these three things saved:
# 1. OAuth Client ID: something like 12345-abcdef.apps.googleusercontent.com
# 2. OAuth Client Secret: something like GOCSPX-abc123def456
# 3. Google Ads Customer ID: 10-digit number (no dashes)
```

---

## Next: Connect Make.com

Once you have these three pieces of info, we'll:
1. Connect Make.com to Google Ads
2. Build the automation scenario
3. Test with a real campaign

Let me know when you're done with Steps 1-2, or if you hit any errors.
