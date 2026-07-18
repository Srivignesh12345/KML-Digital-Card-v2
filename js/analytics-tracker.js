// Analytics Tracker
// Tracks user interactions and sends data to Firebase

// Generate unique visitor ID
function getVisitorId() {
  let visitorId = localStorage.getItem('kml_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('kml_visitor_id', visitorId);
  }
  return visitorId;
}

// Track page view
async function trackPageView(pageName) {
  try {
    const visitorId = getVisitorId();
    
    await analyticsRef.add({
      type: 'Page Views',
      page: pageName,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    await pageViewsRef.add({
      page: pageName,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      url: window.location.href
    });
    
    console.log('Page view tracked:', pageName);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Track service click
async function trackServiceClick(serviceName) {
  try {
    const visitorId = getVisitorId();
    
    await analyticsRef.add({
      type: 'Service Clicks',
      serviceName: serviceName,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent
    });
    
    await serviceClicksRef.add({
      serviceName: serviceName,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      page: window.location.pathname
    });
    
    console.log('Service click tracked:', serviceName);
  } catch (error) {
    console.error('Error tracking service click:', error);
  }
}

// Track gallery view
async function trackGalleryView(imageName) {
  try {
    const visitorId = getVisitorId();
    
    await analyticsRef.add({
      type: 'Gallery Views',
      imageName: imageName,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent
    });
    
    console.log('Gallery view tracked:', imageName);
  } catch (error) {
    console.error('Error tracking gallery view:', error);
  }
}

// Track contact submission
async function trackContactSubmission(contactType) {
  try {
    const visitorId = getVisitorId();
    
    await analyticsRef.add({
      type: 'Contact Submissions',
      contactType: contactType,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent
    });
    
    await contactSubmissionsRef.add({
      contactType: contactType,
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      page: window.location.pathname
    });
    
    console.log('Contact submission tracked:', contactType);
  } catch (error) {
    console.error('Error tracking contact submission:', error);
  }
}

// Track visitor session
async function trackVisitorSession() {
  try {
    const visitorId = getVisitorId();
    
    await analyticsRef.add({
      type: 'visitor',
      visitorId: visitorId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    });
    
    console.log('Visitor session tracked');
  } catch (error) {
    console.error('Error tracking visitor session:', error);
  }
}

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', () => {
  // Track initial page view
  const pageName = getPageName();
  trackPageView(pageName);
  
  // Track visitor session
  trackVisitorSession();
  
  // Track service clicks
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const serviceName = item.getAttribute('data-service') || item.textContent;
      trackServiceClick(serviceName);
    });
  });
  
  // Track gallery views
  const galleryItems = document.querySelectorAll('.gallery-item img');
  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      const imageName = img.src.split('/').pop();
      trackGalleryView(imageName);
    });
  });
  
  // Track contact button clicks
  const contactButtons = document.querySelectorAll('.call-btn, .whatsapp-btn');
  contactButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const contactType = btn.classList.contains('call-btn') ? 'Phone Call' : 'WhatsApp';
      trackContactSubmission(contactType);
    });
  });
});

// Helper function to get page name
function getPageName() {
  const path = window.location.pathname;
  if (path.includes('index.html') || path === '/') {
    return 'Home';
  } else if (path.includes('terms.html')) {
    return 'Terms & Conditions';
  } else if (path.includes('admin.html')) {
    return 'Admin Panel';
  } else {
    return path.split('/').pop() || 'Unknown';
  }
}
