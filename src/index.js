import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HostSetup from './HostSetup';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Simple path-based routing — no react-router needed
const path = window.location.pathname;

if (path === '/host-setup') {
  root.render(<React.StrictMode><HostSetup /></React.StrictMode>);
} else {
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
