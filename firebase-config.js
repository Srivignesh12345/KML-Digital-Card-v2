// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxm1UGLPb45ZMopzs4VNuYxsQwx8fNFd8",
  authDomain: "kml-digital-card.firebaseapp.com",
  projectId: "kml-digital-card",
  storageBucket: "kml-digital-card.firebasestorage.app",
  messagingSenderId: "740239925222",
  appId: "1:740239925222:web:497e4f98b52dda64c60027"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services (only if SDKs are loaded)
let auth, db;
try {
  if (firebase.auth) {
    auth = firebase.auth();
  }
  if (firebase.firestore) {
    db = firebase.firestore();
  }
} catch (error) {
  console.log('Firebase services not loaded yet, will initialize when SDKs are available');
}

// Analytics database references (only if db is available)
let analyticsRef, pageViewsRef, serviceClicksRef, contactSubmissionsRef;
if (db) {
  analyticsRef = db.collection('analytics');
  pageViewsRef = db.collection('pageViews');
  serviceClicksRef = db.collection('serviceClicks');
  contactSubmissionsRef = db.collection('contactSubmissions');
}
