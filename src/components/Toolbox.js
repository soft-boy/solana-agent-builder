import React from 'react';
import { useDrag } from 'react-dnd';
import { FaCommentDots, FaMicrophone, FaRobot, FaCode, FaBitcoin } from 'react-icons/fa';

const tools = [
  { id: 'talk', name: 'Talk', icon: <FaCommentDots />, tooltip: 'Add a Talk block to communicate.' },
  { id: 'listen', name: 'Listen', icon: <FaMicrophone />, tooltip: 'Add a Listen block to capture input.' },
  { id: 'ai', name: 'AI', icon: <FaRobot />, tooltip: 'Add an AI block for intelligent actions.' },
  { id: 'solana', name: 'Solana', icon: <FaBitcoin />, tooltip: 'Add a Solana block for blockchain tasks.' },
  { id: 'api', name: 'API', icon: <FaCode />, tooltip: 'Add an API block to integrate services.' },
];

const Tool = ({ tool }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'tool',
    item: { id: tool.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`tooltip tooltip-right ${tool.tooltip ? 'tooltip-primary' : ''} flex flex-col items-center justify-center w-14 h-14 mb-3 cursor-pointer rounded-md shadow-md bg-white transition-transform transform hover:scale-105 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      data-tip={tool.tooltip}
    >
      <span className="text-primary text-lg">{tool.icon}</span>
      <span className="text-neutral text-xs font-medium mt-1">{tool.name}</span>
    </div>
  );
};

const Toolbox = () => {
  return (
    <div
      className="absolute top-4 left-4 z-20 p-3 w-20 bg-white border border-gray-300 rounded-lg shadow-md"
      style={{
        background: '#ffffff',
        margin: '5px',
        borderRadius: '8px',
      }}
    >
      <div className="flex flex-col items-center">
        {tools.map((tool) => (
          <Tool key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
