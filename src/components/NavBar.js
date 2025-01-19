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
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="hover:text-primary">Home</a>
          </li>
          <li>
            <a className="hover:text-primary">About</a>
          </li>
        </ul>
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
