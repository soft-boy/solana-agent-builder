import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SupabaseProvider } from './lib/SupabaseContext';
import { ReactFlowProvider } from '@xyflow/react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <DndProvider backend={HTML5Backend}>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </DndProvider>
    </SupabaseProvider>
  </React.StrictMode>
);
