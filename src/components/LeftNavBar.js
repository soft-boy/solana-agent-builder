import React, { useState } from 'react';
import { FaHome, FaFolder, FaCog, FaPlus, FaTrash } from 'react-icons/fa';

const LeftNavBar = ({
  agents = [],
  onAddAgent,
  onSelectAgent,
  onDeleteAgent,
}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  // Delete confirmation modal
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  // -- Add agent
  const handleAddAgent = () => {
    if (newAgentName.trim() === '') return;
    onAddAgent(newAgentName);
    setNewAgentName('');
    setAddModalOpen(false);
  };

  // -- Select agent
  const handleSelectAgent = (agentId) => {
    setSelectedAgentId(agentId);
    onSelectAgent(agentId);
  };

  // -- Delete agent (open modal)
  const handleDeleteClick = (agent) => {
    setAgentToDelete(agent);
    setConfirmName('');
  };

  // -- Confirm actual delete
  const handleConfirmDelete = () => {
    if (!agentToDelete) return;
    onDeleteAgent(agentToDelete.id);
    setAgentToDelete(null);
    setConfirmName('');
  };

  // -- Cancel delete
  const handleCancelDelete = () => {
    setAgentToDelete(null);
    setConfirmName('');
  };

  return (
    <div
      className="w-64 h-full bg-neutral text-white shadow-lg"
      style={{ overflowY: 'auto' }}
    >
      <ul className="space-y-4 p-4">
        {/* Home */}
        <li>
          <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition">
            <FaHome className="text-lg" />
            <span className="font-medium">Home</span>
          </a>
        </li>

        {/* Agents Collapse */}
        <li tabIndex={0} className="collapse collapse-arrow rounded-lg">
          <input type="checkbox" />
          <div className="collapse-title flex items-center space-x-3 p-3 font-medium hover:bg-gray-600 transition">
            <FaFolder className="text-lg" />
            <span>Agents</span>
          </div>

          {/* Make sure we remove side padding so rows span full width */}
          <div className="collapse-content p-0 pb-3 w-full">
            <div className="flex flex-col grow space-y-2 mt-2 w-full">
              {agents.map((agent) => {
                const isSelected = agent.id === selectedAgentId;
                return (
                  // Full-width row
                  <div
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent.id)}
                    className={`
                      w-full min-w-full
                      flex items-center
                      px-3 py-2
                      rounded-md
                      cursor-pointer
                      transition
                      ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-gray-800 text-white hover:bg-gray-600'
                      }
                    `}
                  >
                    {/* Truncated agent name */}
                    <span className="flex-1 mr-2 text-sm font-semibold truncate">
                      {agent.name}
                    </span>

                    {/* Delete icon (stopPropagation so row-click doesn’t fire) */}
                    <button
                      className="p-1 rounded-md text-red-400 hover:text-red-500 hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(agent);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}

              {/* Add Agent Button */}
              <button
                className="btn btn-primary text-white btn-sm flex items-center justify-center w-full mt-2"
                onClick={() => setAddModalOpen(true)}
              >
                <FaPlus className="mr-2" />
                Add Agent
              </button>
            </div>
          </div>
        </li>

        {/* Settings */}
        <li>
          <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition">
            <FaCog className="text-lg" />
            <span className="font-medium">Settings</span>
          </a>
        </li>
      </ul>

      {/* Add Agent Modal */}
      {isAddModalOpen && (
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
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleAddAgent}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {agentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-black">Delete Agent</h3>
            <p className="text-black mb-2">
              Are you sure you want to delete <strong>{agentToDelete.name}</strong>?
            </p>
            <p className="text-black mb-4">
              Type the agent’s name to confirm:
            </p>
            <input
              type="text"
              className="input input-bordered w-full text-black mb-4"
              placeholder={`Type "${agentToDelete.name}" to confirm`}
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button className="btn btn-outline" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                disabled={confirmName !== agentToDelete.name}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftNavBar;
