import { createClient } from '@supabase/supabase-js';
import createSBConvo from '../lib/supabase/createConvo';

const supabaseUrl = "https://hcdsvvofqpfutulgdtlj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @swagger
 * /.netlify/functions/create-convo:
 *   post:
 *     summary: Create a conversation for the specified agent.
 *     description: This endpoint creates a new conversation in the Supabase database for a given agent ID and user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agentId:
 *                 type: string
 *                 description: The unique identifier for the agent.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully created a conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 convo:
 *                   type: object
 *                   description: Details of the created conversation.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier of the conversation.
 *                       example: "abc123"
 *                     agent_id:
 *                       type: string
 *                       description: The associated agent ID.
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     user_id:
 *                       type: string
 *                       description: The associated user ID.
 *                       example: "085a1129-24c1-4f15-927a-22ff11e65295"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of when the conversation was created.
 *                       example: "2025-01-20T10:00:00Z"
 *       500:
 *         description: Internal server error. Failed to create the conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to run"
 */
const userId = '085a1129-24c1-4f15-927a-22ff11e65295' // TODO generalize
const createConvo = async (req, context) => {
  const bodyText = await req.text()
  const body = JSON.parse(bodyText);
  const { agentId } = body;

  try {
    const { data: convoData } = await createSBConvo(supabase, userId, agentId)
    const convo = convoData[0]

    return new Response(
      JSON.stringify({ convo }),
      { status: 200, headers: { "Content-Type": "application/json" },
    });
  }
  catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to run' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export default createConvo;