import React from 'react';

const NavBar = ({ toggleDemo }) => {
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
          onClick={toggleDemo}
          className="btn bg-primary text-white hover:bg-blue-700"
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default NavBar;
