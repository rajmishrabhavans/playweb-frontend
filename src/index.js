import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './accessory/fontawesome-free/css/all.min.css'
import './index.css';
// import './App.css'
import App from './App';

import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter >
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);
reportWebVitals();
