import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

app.get('/api/notes', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json([]);

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json([]);
  res.json(data || []);
});

app.post('/api/notes', async (req, res) => {
  const { title, content, user_id, group_id } = req.body;
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content, user_id, group_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', req.params.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/notes/:id', async (req, res) => {
  const { error } = await supabase.from('notes').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/groups', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json([]);

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('user_id', userId);

  if (error) return res.status(500).json([]);
  res.json(data || []);
});

app.post('/api/groups', async (req, res) => {
  const { name, user_id } = req.body;
  const { data, error } = await supabase
    .from('groups')
    .insert([{ name, user_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));