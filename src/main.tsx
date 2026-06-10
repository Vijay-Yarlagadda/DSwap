import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'

const rootElement = document.getElementById('app');

if (!rootElement) {
  console.error('Root element not found');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;color:#fff;padding:24px;line-height:1.6;">
          <div style="max-width:680px;">
            <h1 style="font-size:1.8rem;margin-bottom:0.75rem;">Application failed to start</h1>
            <p style="margin-bottom:1rem;">Check the browser console for the exact startup error and verify Firebase environment variables.</p>
            <pre style="white-space:pre-wrap;background:#111827;padding:16px;border-radius:12px;color:#f8fafc;">${String(error)}</pre>
          </div>
        </div>
      `;
    }
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
