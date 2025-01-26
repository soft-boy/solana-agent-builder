export const fetchAgents = async (supabase, userId) => {
    try {
      const { data: agents, error } = await supabase
        .from('agents')
        .select('*')
        .eq('owner', userId);
  
      if (error) {
        console.error('Error fetching agents:', error.message);
        return [];
      }
  
      return agents || [];
    } catch (error) {
      console.error('Unexpected error fetching agents:', error.message);
      return [];
    }
  };
  