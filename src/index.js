import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HostSetup from './HostSetup';
import PartnerSetup from './PartnerSetup';

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = window.location.pathname;

if (path === '/host-setup') {
  root.render(<React.StrictMode><HostSetup /></React.StrictMode>);
} else if (path === '/partner-setup') {
  root.render(<React.StrictMode><PartnerSetup /></React.StrictMode>);
} else {
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
