import React from 'react';
import { useSupabase } from '../../lib/SupabaseContext';

const HeroSection = () => {
  const { email, session } = useSupabase();

  // Extract display name
  const displayName = session?.user?.user_metadata?.full_name.split(' ')[0] || email?.split('@')[0].replace(/[0-9]/g, '');

  return (
    <div className="flex justify-between items-center p-4 bg-primary text-white rounded-lg shadow-md">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {displayName}!</h1>
        <p className="text-sm opacity-75">Here’s an overview of your dashboard.</p>
      </div>
    </div>
  );
};

export default HeroSection;
