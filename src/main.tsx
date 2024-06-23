import ReactDOM from 'react-dom/client';

import { App } from './App.tsx';
import './index.css';

import { APIContextProvider } from './contexts/APIContext/provider.tsx';
import { AuthContextProvider } from './contexts/AuthContext/provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <APIContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </APIContextProvider>
);
