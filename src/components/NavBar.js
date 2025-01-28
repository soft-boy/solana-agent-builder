import React, { useContext } from 'react';
import { AppContext } from '../lib/AppContext';
import { useLocation, useParams, useNavigate } from 'react-router';
import { useSupabase } from '../lib/SupabaseContext';

const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:8888';

const NavBar = ({ toggleDemo }) => {
  const { userId } = useSupabase();
  const location = useLocation();
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { setCurrentConvoId } = useContext(AppContext);

  const handleRun = async () => {
    const response = await fetch(`${BASE_URL}/.netlify/functions/create-convo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        participantId: userId,
      }),
    });
    const { convo } = await response.json();
    setCurrentConvoId(convo.id);
  };

  return (
    <div className="navbar bg-neutral shadow-lg">
      <div className="navbar-start">
        <a onClick={() => navigate('/')} className="btn btn-ghost normal-case text-xl text-primary">
          <img
            src="/logo.png"
            alt="SolFlow Logo"
            className="h-6 w-auto" // Adjust height and ensure it scales proportionally
          />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex"></div>

      {location.pathname.includes('agent') && (
        <div className="navbar-end">
          <button
            onClick={() => {
              handleRun();
              toggleDemo();
            }}
            className="btn  btn-3xl bg-blue-500 text-white pr-6 pl-6 hover:bg-blue-700"
          >
            Run
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
