const createAgent = async (supabase, name, owner) => {
  const startNode = {
      id: "node-start",
      data: {
          type: "start",
          label: "Start"
      },
      style: {
          width: 200
      },
      dragging: false,
      measured: {
          width: 200,
          height: 40
      },
      position: {
          x: 300,
          y: 180
      },
      selected: false,
      sourcePosition: "right",
      targetPosition: "left"
  };

  const { data, error } = await supabase
      .from('agents')
      .insert([{
          name,
          owner,
          flowchart: {
              nodes: [startNode],
              edges: []
          }
      }])
      .select();

  return { agent: data[0], error };
};

export default createAgent;