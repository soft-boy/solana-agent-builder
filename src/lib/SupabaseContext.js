import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHN2dm9mcXBmdXR1bGdkdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNzE5ODUsImV4cCI6MjA1MjY0Nzk4NX0.6xVK2z8Y9wNKlOnW7tk1T7hJcq8xnTAwdAo9q0-pyIo";
const supabase = createClient(supabaseUrl, supabaseKey);

// Create the context
const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session and set user data
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false)
      if (session) {
        setUserId(session.user.id);
        setEmail(session.user.email);
      }
    };

    fetchSession();

    // Listen for session changes (login/logout)
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        setUserId(session.user.id);
        setEmail(session.user.email);
      } else {
        setUserId(null);
        setEmail(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => data.subscription.unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      setSession(null);
      setUserId(null);
      setEmail(null);
    }
  };

  const context = {
    supabase,
    loading,
    session,
    userId,
    email,
    logout
  }

  return (
    <SupabaseContext.Provider value={context}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
