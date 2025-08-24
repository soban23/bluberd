// test-db.js
import pkg from 'pg';
const { Pool } = pkg;
//postgresql://postgres:nEWcWoEodXCOrg1K@db.ecpwdbjgvnlmvcbwburq.supabase.co:5432/postgres
const pool = new Pool({
  connectionString: 'postgresql://postgres:nEWcWoEodXCOrg1K@ecpwdbjgvnlmvcbwburq.supabase.co:5432/postgres?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ DB Connected:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });
