import React, { useState, useEffect } from 'react';
import { FaHome, FaFolder, FaCog, FaPlus, FaTrash, FaRegCommentAlt } from 'react-icons/fa';
import { useSupabase } from '../lib/SupabaseContext';
import {
  createFlowchart,
  getFlowcharts,
  deleteFlowchart
} from '../lib/flowcharts';
import { Link, useNavigate, useParams } from 'react-router';

const LeftNavBar = () => {
  const navigate = useNavigate();
  const { agentId: selectedAgentId } = useParams();
  const supabase = useSupabase();
  const [agents, setAgents] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');

  // Delete confirmation modal
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      const agents = await getFlowcharts(supabase);
      setAgents(agents);
    };

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchAgents();
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Add Agent
  const onAddAgent = async (name) => {
    const { data } = await createFlowchart(supabase, name);
    setAgents((prevAgents) => [...prevAgents, ...data]);
  };

  const onDeleteAgent = async (agentId) => {
    await deleteFlowchart(supabase, agentId);
    setAgents((prevAgents) => prevAgents.filter((a) => a.id !== agentId));
  };

  // -- Add agent
  const handleAddAgent = () => {
    if (newAgentName.trim() === '') return;
    onAddAgent(newAgentName);
    setNewAgentName('');
    setAddModalOpen(false);
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
    <div className="w-64 h-full bg-neutral text-white shadow-lg flex flex-col justify-between">
      {/* Sidebar Menu */}
      <ul className="space-y-4 p-4">
        {/* Home */}
        <li>
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition">
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
                      isSelected ? 'bg-primary text-white' : 'bg-gray-800 text-white hover:bg-gray-600'
                    }`}
                  >
                    <span className="flex-1 mr-2 text-sm font-semibold truncate">
                      {agent.name}
                    </span>
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

        {/* Messages */}
        <li>
          <Link to="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition">
            <FaRegCommentAlt className="text-lg" />
            <span className="font-medium">Messages</span>
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-600 transition">
            <FaCog className="text-lg" />
            <span className="font-medium">Settings</span>
          </Link>
        </li>
      </ul>

      {/* User Badge */}
      <div className="p-4 border-t border-gray-700">
        {user ? (
          <div className="flex items-center space-x-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
            <p className="text-sm font-medium">{user.email.split('@')[0]}</p>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-xs text-white mt-2"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default LeftNavBar;
