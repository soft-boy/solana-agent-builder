import { useState } from "react";
import useSupabase from "../hooks/useSupabase";

const initialFlowchart = {
  edges: [],
  nodes: [
    {
      id: "node-start",
      data: {
        type: "start",
        label: "Start",
      },
      style: {
        width: 200,
      },
      dragging: false,
      measured: {
        width: 200,
        height: 40,
      },
      position: {
        x: 576.1847262858087,
        y: 269.31150275844436,
      },
      selected: false,
      sourcePosition: "right",
      targetPosition: "left",
    },
  ],
};

export default function AddAgentModal({ isOpen, close }) {
  const [agentName, setAgentName] = useState("");
  const { supabase } = useSupabase();

  const handleConfirm = async () => {
    if (!agentName.trim()) return;
    
    const { error } = await supabase.from("agents").insert([
      {
        name: agentName,
        flowchart: initialFlowchart,
      },
    ]);

    if (error) {
      console.error("Error adding agent:", error);
    } else {
      close();
      setAgentName("");
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="font-bold text-lg text-black">Add New Agent</h2>
        <input
          type="text"
          placeholder="Agent Name"
          className="input input-bordered w-full mt-4 text-black"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={!agentName.trim()}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
