import React, { useState } from 'react';
import { FaHome, FaFolder, FaCog, FaPlus } from 'react-icons/fa';

const LeftNavBar = ({ agents = [], onAddAgent, onSelectAgent }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  const handleAddAgent = () => {
    if (newAgentName.trim() === '') return;
    onAddAgent(newAgentName);
    setNewAgentName('');
    setModalOpen(false);
  };

  // Track the agent the user selected, so we can highlight it.
  const handleSelectAgent = (id) => {
    setSelectedAgentId(id);
    onSelectAgent(id);
  };

  return (
    <div
      className="w-64 h-full p-4 text-white bg-neutral shadow-lg"
      style={{ overflowY: 'auto' }}
    >
      <ul className="menu space-y-4">
        {/* Home */}
        <li>
          <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 hover:text-white transition">
            <FaHome className="text-lg" />
            <span className="font-medium">Home</span>
          </a>
        </li>

        {/* Agents Collapse */}
        <li tabIndex={0} className="collapse collapse-arrow rounded-lg">
          <input type="checkbox" />
          <div className="collapse-title flex items-center space-x-3 p-3 font-medium hover:bg-gray-600 hover:text-white transition">
            <FaFolder className="text-lg" />
            <span>Agents</span>
          </div>
          <div className="collapse-content px-3 pb-3 flex flex-col space-y-2">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  // Use btn-primary + text-white if selected; else btn-outline
                  className={`btn btn-sm w-full ${
                    isSelected
                      ? 'btn-primary text-white'
                      : 'btn-outline text-white hover:bg-primary hover:text-black'
                  }`}
                  onClick={() => handleSelectAgent(agent.id)}
                >
                  {agent.name}
                </button>
              );
            })}

            {/* Add Agent Button (force white text even if blue) */}
            <button
              className="btn btn-primary text-white btn-sm w-full mt-2 flex items-center justify-center"
              onClick={() => setModalOpen(true)}
            >
              <FaPlus className="mr-2" />
              Add Agent
            </button>
          </div>
        </li>

        {/* Settings */}
        <li>
          <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 hover:text-white transition">
            <FaCog className="text-lg" />
            <span className="font-medium">Settings</span>
          </a>
        </li>
      </ul>

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-black">Create New Agent</h3>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-800">Agent Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered text-black"
                placeholder="Enter agent name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary text-white" onClick={handleAddAgent}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftNavBar;
