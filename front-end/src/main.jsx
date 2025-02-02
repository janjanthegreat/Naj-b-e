import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZXB-3u3-jUWCpH5PNjvPV5Y-UpDExzGk",
  authDomain: "full-stack-react-70153.firebaseapp.com",
  projectId: "full-stack-react-70153",
  storageBucket: "full-stack-react-70153.firebasestorage.app",
  messagingSenderId: "1013315920095",
  appId: "1:1013315920095:web:e8a812fc23d72ba387896a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
