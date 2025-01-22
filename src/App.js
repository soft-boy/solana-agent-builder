import React, { useState } from 'react';
import { Routes, Route, Outlet } from "react-router";
import NavBar from './components/NavBar';
import LeftNavBar from './components/LeftNavBar';
import PreviewBot from './components/PreviewBot';
import FlowEditor from './components/FlowEditor';
import HomeView from './components/HomeView';
import MessagesView from './components/MessagesView';
import SettingsView from './components/SettingsView';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeView />} />
        <Route path="/agent/:agentId" element={<FlowEditor />} />
        <Route path="/messages" element={<MessagesView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  const [showDemo, setShowDemo] = useState(false);

  const toggleDemo = () => setShowDemo((prev) => !prev);
  const closeDemo = () => setShowDemo(false);

  return (
    <div className="flex h-screen flex-col bg-base-100">
      <header className="h-16">
        <NavBar toggleDemo={toggleDemo} />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-neutral text-white shadow-lg">
          <LeftNavBar />
        </aside>
        <main className="flex-1 relative">
          <Outlet />
        </main>
        <PreviewBot isOpen={showDemo} closeDemo={closeDemo} />
      </div>
    </div>
  )
}

export default App;
