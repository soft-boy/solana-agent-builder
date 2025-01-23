const getFlowchart = async (supabase, flowchartId) => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', flowchartId)
      .single(); // Ensures a single row is returned

    if (error) {
      console.error('Error fetching conversation:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { data: null, error: err.message };
  }
};

export default getFlowchart;