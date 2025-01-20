const chatEval = async (req, context) => {
  return new Response(JSON.stringify({ message: "hello world" }), {
    headers: { "Content-Type": "application/json" },
  });
};

export default chatEval;