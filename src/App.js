import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import NavBar from "./components/NavBar";
import LeftNavBar from "./components/LeftNavBar";
import PreviewBot from "./components/PreviewBot";
import FlowEditor from "./components/FlowEditor";
import HomeView from "./components/views/HomeView";
import MessagesView from "./components/views/MessagesView";
import SettingsView from "./components/views/SettingsView";
import LoginView from "./components/views/LoginView";
import RegisterView from "./components/views/RegisterView";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSupabase } from "./lib/SupabaseContext";
import { ToastContainer, toast } from 'react-toastify';

export const App = () => {
  const { session, loading } = useSupabase()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/login"
        element={session ? <Navigate to="/" /> : <LoginView />} // Redirect to base URL if already logged in
      />
      <Route
        path="/register"
        element={session ? <Navigate to="/" /> : <RegisterView />} // Redirect to base URL if already logged in
      />
      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute session={session}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeView />} />
        <Route path="/agent/:agentId" element={<FlowEditor />} />
        <Route path="/messages" element={<MessagesView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
};

// Layout component for authenticated users
const Layout = () => {
  const [showDemo, setShowDemo] = useState(false);

  const toggleDemo = () => setShowDemo((prev) => !prev);
  const closeDemo = () => setShowDemo(false);

  return (
    <div className="flex h-screen flex-col bg-base-100">
      <ToastContainer />
      <header className="h-16">
        <NavBar toggleDemo={toggleDemo} />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-neutral text-white shadow-lg">
          <LeftNavBar closeDemo={closeDemo} />
        </aside>
        <main className="flex-1 relative">
          <Outlet />
        </main>
        <PreviewBot isOpen={showDemo} closeDemo={closeDemo} />
      </div>
    </div>
  );
};

export default App;
