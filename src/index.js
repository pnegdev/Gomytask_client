import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './JS/Redux/store';
import { setToken } from './JS/Redux/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from './reportWebVitals';

// Récupérer le token depuis le localStorage
const storedToken = localStorage.getItem('token');

// Dispatch de l'action pour mettre à jour le token dans le state Redux
if (storedToken) {
  store.dispatch(setToken(storedToken));
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
