import useSupabase from "../hooks/useSupabase";

export default function ConfirmDeleteModal({ isOpen, close, agent }) {
  const { supabase } = useSupabase();

  const handleDelete = async () => {
    if (!agent) return;
    
    const { error } = await supabase.from("agents").delete().eq("id", agent.id);

    if (error) {
      console.error("Error deleting agent:", error);
    } else {
      close();
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="font-bold text-lg text-black">Confirm Delete</h2>
        <p className="text-black">Are you sure you want to delete this agent?</p>
        <div className="modal-action">
          <button className="btn" onClick={close}>Cancel</button>
          <button className="btn btn-error" onClick={handleDelete}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}
