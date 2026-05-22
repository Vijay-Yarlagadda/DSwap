import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'

const rootElement = document.getElementById('app');

if (!rootElement) {
  console.error('Root element not found');
  window.location.reload();
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Clear the root and reload
    if (rootElement) {
      rootElement.innerHTML = '';
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Handle runtime errors
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
  // Don't reload on every error, just log it
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
