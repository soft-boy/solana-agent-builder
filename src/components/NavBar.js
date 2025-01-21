import React from 'react';

const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:8888'

const NavBar = ({ toggleDemo }) => {
  const handleRun = () => {
    fetch(`${BASE_URL}/.netlify/functions/trigger-convo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'start', 
        data: { flowchartId: 1 } // TODO generalize
      }),
    });
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

      <div className="navbar-end">
        <button
          onClick={() => { handleRun(); toggleDemo() }}
          className="btn bg-primary text-white hover:bg-blue-700"
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default NavBar;
