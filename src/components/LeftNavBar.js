import React from 'react';

const LeftNavBar = () => {
  return (
    <ul className="menu bg-neutral text-white p-4 space-y-2">
      <li>
        <a className="flex items-center space-x-2">
          <span>🏠</span>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a className="flex items-center space-x-2">
          <span>📁</span>
          <span>Library</span>
        </a>
      </li>
      <li>
        <a className="flex items-center space-x-2">
          <span>⚙️</span>
          <span>Settings</span>
        </a>
      </li>
    </ul>
  );
};

export default LeftNavBar;
