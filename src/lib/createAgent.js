const createAgent = async (supabase, name, owner) => {
    const { data, error } = await supabase
      .from('agents')
      .insert([{
        name,
        owner,
        flowchart: {
          nodes: [],
          edges: []
        }
      }])
      .select();
  
    return { agent: data[0], error };
  };
  
  export default createAgent;
  