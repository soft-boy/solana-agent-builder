import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import NavBar from "./components/NavBar";
import LeftNavBar from "./components/LeftNavBar";
import PreviewBot from "./components/PreviewBot";
import FlowEditor from "./components/FlowEditor";
import HomeView from "./components/HomeView";
import MessagesView from "./components/MessagesView";
import SettingsView from "./components/SettingsView";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import ProtectedRoute from "./components/ProtectedRoute";

// Initialize Supabase client
const SUPABASE_URL = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHN2dm9mcXBmdXR1bGdkdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNzE5ODUsImV4cCI6MjA1MjY0Nzk4NX0.6xVK2z8Y9wNKlOnW7tk1T7hJcq8xnTAwdAo9q0-pyIo";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Fetch session on initial load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false); // Stop loading after fetching session
    };

    getSession();

    // Listen to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session); // Update session on login/logout
    });

    // Cleanup the subscription
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

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
  );
};

export default App;
