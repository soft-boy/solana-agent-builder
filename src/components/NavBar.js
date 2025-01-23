import React, { useContext } from 'react';
import { AppContext } from '../lib/AppContext';
import { useLocation, useParams } from 'react-router';
import { useSupabase } from '../lib/SupabaseContext';

const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:8888'

const NavBar = ({ toggleDemo }) => {
  const { userId } = useSupabase()
  const location = useLocation();
  const { agentId } = useParams()
  const { setCurrentConvoId } = useContext(AppContext)

  const handleRun = async () => {
    const response = await fetch(`${BASE_URL}/.netlify/functions/create-convo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        agentId,
        participantId: userId
      }),
    });
    const { convo } = await response.json()
    setCurrentConvoId(convo.id)
  }

  return (
    <div className="navbar bg-neutral shadow-lg">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl text-primary">
          SolFlow
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        
      </div>

      {location.pathname.includes('agent') && (
        <div className="navbar-end">
          <button
            onClick={() => { handleRun(); toggleDemo() }}
            className="btn bg-primary text-white hover:bg-blue-700"
          >
            Run
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
