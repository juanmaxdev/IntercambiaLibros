import { testConnection } from '../../lib/supabase'

export default async function handler(req, res) {
  // Llama a la función de test
  await testConnection()
  res.status(200).json({ ok: true })
}