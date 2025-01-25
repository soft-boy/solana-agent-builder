import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaFolder,
  FaCog,
  FaPlus,
  FaTrash,
  FaRegCommentAlt
} from 'react-icons/fa';
import { IoLogOutOutline } from "react-icons/io5";
import { useSupabase } from '../lib/SupabaseContext';
import createAgent from '../lib/createAgent';
import deleteAgent from '../lib/deleteAgent';
import { Link, useNavigate, useParams } from 'react-router';

const LeftNavBar = () => {
  const navigate = useNavigate();
  const { agentId: selectedAgentId } = useParams();
  const { supabase, session, email, logout } = useSupabase();

  const [agents, setAgents] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  const handleAddAgent = async () => {
    if (!newAgentName.trim()) return;
    const { agent, error } = await createAgent(supabase, newAgentName.trim(), session?.user?.id);
    if (!error) {
      setAgents((prev) => [...prev, agent]); // Update state immediately
      setAddModalOpen(false);
      setNewAgentName('');
      fetchAgents(); // Sync with database
    } else {
      console.error('Error adding agent:', error);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (agentToDelete?.name === confirmName) {
      const { success, error } = await deleteAgent(supabase, agentToDelete.id);
      if (success) {
        setAgents((prev) => prev.filter((agent) => agent.id !== agentToDelete.id)); // Update state immediately
        setAgentToDelete(null);
        setConfirmName('');
        fetchAgents(); // Sync with database to ensure consistency
      } else {
        console.error('Error deleting agent:', error);
      }
    }
  };
  
  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });
      
    if (!error) {
      setAgents(data); // Set agents with the latest data from the database
    } else {
      console.error('Error fetching agents:', error);
    }
  };
  
  useEffect(() => {
    fetchAgents();
  }, [supabase]);
  
  return (
    <div className="w-64 h-full bg-neutral text-white shadow-lg flex flex-col justify-between">
      {/* Sidebar Menu */}
      <ul className="space-y-4 p-4">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition"
          >
            <FaHome className="text-lg" />
            <span className="font-medium">Home</span>
          </Link>
        </li>

        {/* Agents Collapse */}
        <li tabIndex={0} className="collapse collapse-arrow rounded-lg">
          <input type="checkbox" />
          <div className="collapse-title flex items-center space-x-3 p-3 font-medium hover:bg-gray-600 transition">
            <FaFolder className="text-lg" />
            <span>Agents</span>
          </div>

          <div className="collapse-content p-0 pb-3 w-full">
            <div className="flex flex-col grow space-y-2 mt-2 w-full">
              {agents.map((agent) => {
                const isSelected = `${agent.id}` === selectedAgentId;
                return (
                  <div
                    key={agent.id}
                    onClick={() => navigate(`/agent/${agent.id}`)}
                    className={`w-full min-w-full flex items-center px-3 py-2 rounded-md cursor-pointer transition ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex-1 mr-2 text-sm font-semibold truncate">
                      {agent.name}
                    </span>
                    <button
                      className="p-1 rounded-md btn-sm text-red-400 hover:text-red-500 hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAgentToDelete(agent);
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

        {/* Messages */}
        <li>
          <Link
            to="/messages"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition"
          >
            <FaRegCommentAlt className="text-lg" />
            <span className="font-medium">Messages</span>
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link
            to="/settings"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition"
          >
            <FaCog className="text-lg" />
            <span className="font-medium">Settings</span>
          </Link>
        </li>
      </ul>

      {/* User Badge */}
      <div className="p-4 border-t border-gray-700">
        {session ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={`https://ui-avatars.com/api/?name=${email}&background=random`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <p className="truncate">{email.split('@')[0]}</p>
            </div>
            <button
              onClick={logout}
              className="btn-s text-error"
            >
              <IoLogOutOutline size={20} />
            </button>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Not logged in</p>
        )}
      </div>

      {/* Add Agent Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box text-black">
            <h3 className="font-bold text-lg">Add New Agent</h3>
            <input
              type="text"
              placeholder="Enter agent name"
              className="input input-bordered w-full mt-4"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
            />
            <div className="modal-action">
              <button
                className="btn btn-neutral text-white"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleAddAgent}
                disabled={!newAgentName.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {agentToDelete && (
        <div className="modal modal-open">
          <div className="modal-box text-black">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p>
              Are you sure you want to delete <b>{agentToDelete.name}</b>?
            </p>
            <input
              type="text"
              placeholder="Type agent name to confirm"
              className="input input-bordered w-full mt-4"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            />
            <div className="modal-action">
              <button
                className="btn btn-neutral text-white"
                onClick={() => setAgentToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleConfirmDelete}
                disabled={confirmName !== agentToDelete?.name}
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
