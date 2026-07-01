const { neon } = require('@neondatabase/serverless');

/*
  Vercel Serverless Function — /api/tasks
  
  GET  → Returns the current task state from Neon
  POST → Saves new task state to Neon
  
  Expects DATABASE_URL (or POSTGRES_URL) environment variable set in Vercel.
*/

// Initialize table on first call (idempotent)
async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS birdy_tasks (
      id         TEXT PRIMARY KEY DEFAULT 'birdy-main',
      data       JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

module.exports = async function handler(req, res) {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Neon Vercel integration may use POSTGRES_URL, DATABASE_URL, or NEON_DATABASE_URL
  const dbUrl = process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.NEON_DATABASE_URL;

  if (!dbUrl) {
    return res.status(500).json({
      error: 'Database URL not configured',
      hint: 'Add your Neon connection string as DATABASE_URL in Vercel → Project Settings → Environment Variables',
      available_env: Object.keys(process.env).filter(k =>
        k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('NEON') || k.includes('PG')
      )
    });
  }

  const sql = neon(dbUrl);

  try {
    // Auto-create table if it doesn't exist
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT data, updated_at FROM birdy_tasks WHERE id = 'birdy-main'
      `;

      if (rows.length === 0) {
        // Insert empty row for first time
        await sql`
          INSERT INTO birdy_tasks (id, data) VALUES ('birdy-main', '{}')
        `;
        return res.status(200).json({ data: {}, updated_at: null });
      }

      return res.status(200).json({
        data: rows[0].data,
        updated_at: rows[0].updated_at
      });
    }

    if (req.method === 'POST') {
      const { data } = req.body;

      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Request body must include a "data" object' });
      }

      await sql`
        INSERT INTO birdy_tasks (id, data, updated_at)
        VALUES ('birdy-main', ${JSON.stringify(data)}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET data = ${JSON.stringify(data)}::jsonb,
            updated_at = NOW()
      `;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error', message: err.message });
  }
};
