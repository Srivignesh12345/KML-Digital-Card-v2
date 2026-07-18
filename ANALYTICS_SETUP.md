# Analytics System Setup Guide

## Overview
This guide will help you set up the Firebase-based analytics system for the Kalpana Microbiology Lab website, including the admin panel with pie chart visualization.

## Prerequisites
- Google Account (for Firebase)
- Basic understanding of web development
- Access to the website files

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `kalpana-microbiology-lab-analytics`
4. Accept Firebase terms and continue
5. Disable Google Analytics for this project (we're building custom analytics)
6. Click "Create project"

## Step 2: Enable Required Firebase Services

### Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" sign-in provider
3. Click "Save"

### Enable Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose a location (select nearest to your users)
3. Select "Start in test mode" (for development)
4. Click "Create database"

### Set Firestore Security Rules
Go to "Firestore Database" → "Rules" and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Analytics collection - readable by authenticated admins only
    match /analytics/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
    }
    
    // Page views collection
    match /pageViews/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
    }
    
    // Service clicks collection
    match /serviceClicks/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
    }
    
    // Contact submissions collection
    match /contactSubmissions/{document=**} {
      allow read: if request.auth != null;
      allow create: if true;
    }
    
  }
}
```

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" (</>) icon
4. Register app: `kalpana-web-analytics`
5. Copy the firebaseConfig object
6. Update `firebase-config.js` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Create Admin User

1. In Firebase Console, go to "Authentication" → "Users"
2. Click "Add user"
3. Enter admin email: `admin@kalpanalab.com` (or your preferred email)
4. Enter a secure password
5. Click "Add user"

**Important:** Save these credentials securely for admin panel login.

## Step 5: Deploy Website

### Option A: Static Hosting (Netlify/Vercel)
1. Upload your files to Netlify/Vercel
2. The analytics will work automatically once deployed

### Option B: Local Testing
1. Use a local server (e.g., `python -m http.server 8000`)
2. Open `http://localhost:8000` in browser
3. Analytics will track local visits

## Step 6: Access Admin Panel

1. Open `admin.html` in your browser
2. Login with the admin credentials created in Step 4
3. You should see the analytics dashboard with:
   - Total page views
   - Service clicks
   - Contact submissions
   - Unique visitors
   - Monthly analytics pie chart
   - Service popularity chart
   - Recent activity table

## Step 7: Test Analytics Tracking

1. Visit the main website (`index.html`)
2. Click on various services
3. Open gallery images
4. Click contact buttons
5. Refresh admin panel to see updated data

## Features Implemented

### Tracking Capabilities
- **Page Views**: Tracks every page visit
- **Service Clicks**: Monitors which diagnostic services users click
- **Gallery Views**: Tracks image gallery interactions
- **Contact Submissions**: Records phone/WhatsApp button clicks
- **Unique Visitors**: Uses localStorage to identify repeat visitors

### Admin Panel Features
- **Secure Login**: Firebase Authentication
- **Real-time Stats**: Live counters for key metrics
- **Monthly Analytics**: Pie chart with time range selector
- **Service Popularity**: Bar chart showing most-clicked services
- **Recent Activity**: Table showing latest user interactions
- **Responsive Design**: Works on desktop and mobile

### Data Privacy
- All data stored in private Firebase database
- Admin-only access to analytics data
- No personal information collected beyond basic user agent
- GDPR-compliant tracking approach

## File Structure

```
KML Digital Card v 2.0/
├── firebase-config.js          # Firebase configuration
├── admin.html                  # Admin panel interface
├── css/
│   └── admin.css              # Admin panel styles
├── js/
│   ├── admin.js               # Admin panel logic
│   └── analytics-tracker.js   # Website tracking code
├── index.html                 # Main website (with tracking)
└── terms.html                 # Terms page (with tracking)
```

## Troubleshooting

### Admin Panel Not Loading
- Check browser console for errors
- Verify Firebase credentials in `firebase-config.js`
- Ensure Firebase services are enabled

### Analytics Not Tracking
- Check if Firebase SDKs are loading correctly
- Verify network connectivity
- Check browser console for Firebase errors

### Charts Not Displaying
- Ensure Chart.js CDN is accessible
- Check if data is being retrieved from Firestore
- Verify browser supports Canvas API

### Authentication Issues
- Confirm user exists in Firebase Authentication
- Check email/password are correct
- Verify Authentication is enabled in Firebase Console

## Security Recommendations

1. **Change Default Password**: Update admin password regularly
2. **Enable 2FA**: Add two-factor authentication for Firebase account
3. **Restrict Database Access**: Update Firestore rules for production
4. **Monitor Usage**: Check Firebase usage dashboard regularly
5. **Backup Data**: Export analytics data periodically

## Production Deployment

Before going live:

1. Update Firestore security rules to production mode
2. Enable Firebase Analytics for additional insights
3. Set up Firebase alerts for unusual activity
4. Configure Firebase billing if usage exceeds free tier
5. Test all tracking functionality thoroughly

## Support

For issues or questions:
- Firebase Documentation: https://firebase.google.com/docs
- Chart.js Documentation: https://www.chartjs.org/docs/
- Project-specific: Contact development team

## Next Steps

After setup:
1. Monitor analytics for 1-2 weeks
2. Identify popular services and user behavior patterns
3. Use insights to improve website content and user experience
4. Consider adding more tracking based on business needs

---

**Note**: This analytics system is custom-built for your specific needs. All data remains private and secure within your Firebase project.
