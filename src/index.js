import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SupabaseProvider } from './lib/SupabaseContext';
import { ReactFlowProvider } from '@xyflow/react';
import { AppContextProvider } from './lib/AppContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { BrowserRouter } from "react-router";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <DndProvider backend={HTML5Backend}>
        <ReactFlowProvider>
          <BrowserRouter>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </BrowserRouter>
        </ReactFlowProvider>
      </DndProvider>
    </SupabaseProvider>
  </React.StrictMode>
);
