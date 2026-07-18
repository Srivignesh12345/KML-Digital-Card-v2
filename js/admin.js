// Admin Panel JavaScript
// Handles authentication, analytics data retrieval, and chart visualization

// Global variables
let monthlyPieChart = null;
let servicePopularityChart = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const monthSelector = document.getElementById('monthSelector');
const refreshBtn = document.getElementById('refreshBtn');

// =========================
// AUTHENTICATION
// =========================

// Check authentication state on load
auth.onAuthStateChanged((user) => {
  if (user) {
    showDashboard();
    loadAnalyticsData();
  } else {
    showLogin();
  }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('loginError');
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    errorElement.textContent = '';
  } catch (error) {
    errorElement.textContent = 'Login failed: ' + error.message;
  }
});

// Logout functionality
logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Show/Hide pages
function showLogin() {
  loginPage.style.display = 'flex';
  dashboardPage.style.display = 'none';
}

function showDashboard() {
  loginPage.style.display = 'none';
  dashboardPage.style.display = 'block';
}

// =========================
// ANALYTICS DATA LOADING
// =========================

async function loadAnalyticsData() {
  try {
    await Promise.all([
      loadPageViews(),
      loadServiceClicks(),
      loadContactSubmissions(),
      loadUniqueVisitors(),
      loadMonthlyAnalytics(),
      loadServicePopularity(),
      loadRecentActivity()
    ]);
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

async function loadPageViews() {
  try {
    const snapshot = await pageViewsRef.get();
    const total = snapshot.size;
    document.getElementById('totalPageViews').textContent = total.toLocaleString();
  } catch (error) {
    console.error('Error loading page views:', error);
  }
}

async function loadServiceClicks() {
  try {
    const snapshot = await serviceClicksRef.get();
    const total = snapshot.size;
    document.getElementById('totalServiceClicks').textContent = total.toLocaleString();
  } catch (error) {
    console.error('Error loading service clicks:', error);
  }
}

async function loadContactSubmissions() {
  try {
    const snapshot = await contactSubmissionsRef.get();
    const total = snapshot.size;
    document.getElementById('totalContactSubmissions').textContent = total.toLocaleString();
  } catch (error) {
    console.error('Error loading contact submissions:', error);
  }
}

async function loadUniqueVisitors() {
  try {
    // Get unique visitors based on IP or user ID
    const snapshot = await analyticsRef
      .where('type', '==', 'visitor')
      .get();
    
    const uniqueVisitors = new Set();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.visitorId) {
        uniqueVisitors.add(data.visitorId);
      }
    });
    
    document.getElementById('uniqueVisitors').textContent = uniqueVisitors.size.toLocaleString();
  } catch (error) {
    console.error('Error loading unique visitors:', error);
  }
}

// =========================
// CHART VISUALIZATION
// =========================

async function loadMonthlyAnalytics() {
  try {
    const timeRange = monthSelector.value;
    const startDate = getStartDate(timeRange);
    
    const snapshot = await analyticsRef
      .where('timestamp', '>=', startDate)
      .get();
    
    // Group data by type
    const dataByType = {
      'Page Views': 0,
      'Service Clicks': 0,
      'Contact Submissions': 0,
      'Gallery Views': 0
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (dataByType.hasOwnProperty(data.type)) {
        dataByType[data.type]++;
      }
    });
    
    updateMonthlyPieChart(dataByType);
  } catch (error) {
    console.error('Error loading monthly analytics:', error);
  }
}

async function loadServicePopularity() {
  try {
    const snapshot = await serviceClicksRef.get();
    
    const serviceCounts = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const serviceName = data.serviceName || 'Unknown';
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
    });
    
    // Sort and get top 10 services
    const sortedServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    updateServicePopularityChart(sortedServices);
  } catch (error) {
    console.error('Error loading service popularity:', error);
  }
}

function updateMonthlyPieChart(data) {
  const ctx = document.getElementById('monthlyPieChart').getContext('2d');
  
  if (monthlyPieChart) {
    monthlyPieChart.destroy();
  }
  
  monthlyPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          '#228C22',
          '#17432c',
          '#3CB371',
          '#90EE90',
          '#32CD32'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateServicePopularityChart(data) {
  const ctx = document.getElementById('servicePopularityChart').getContext('2d');
  
  if (servicePopularityChart) {
    servicePopularityChart.destroy();
  }
  
  const labels = data.map(item => item[0]);
  const values = data.map(item => item[1]);
  
  servicePopularityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Clicks',
        data: values,
        backgroundColor: '#228C22',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

// =========================
// RECENT ACTIVITY TABLE
// =========================

async function loadRecentActivity() {
  try {
    const snapshot = await analyticsRef
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    
    const tableBody = document.getElementById('analyticsTableBody');
    tableBody.innerHTML = '';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement('tr');
      
      const date = new Date(data.timestamp?.toDate()).toLocaleString();
      const type = data.type || 'Unknown';
      const page = data.page || data.serviceName || 'N/A';
      const userAgent = data.userAgent ? data.userAgent.substring(0, 50) + '...' : 'N/A';
      
      row.innerHTML = `
        <td>${date}</td>
        <td>${type}</td>
        <td>${page}</td>
        <td>${userAgent}</td>
      `;
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
}

// =========================
// UTILITY FUNCTIONS
// =========================

function getStartDate(range) {
  const now = new Date();
  switch(range) {
    case 'current':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'last':
      return new Date(now.getFullYear(), now.getMonth() - 1, 1);
    case '3months':
      return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case '6months':
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

// Event listeners for interactivity
monthSelector.addEventListener('change', loadMonthlyAnalytics);
refreshBtn.addEventListener('click', loadAnalyticsData);
