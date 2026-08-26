const db = require('../config/database');

async function getStatistics(kelurahanId = null) {
  const params = [];
  const kelurahanFilter = kelurahanId ? 'WHERE kelurahan_id = ?' : '';
  if (kelurahanId) params.push(kelurahanId);

  // Chat Conversations Stats
  const [[chatStats]] = await db.query(`
    SELECT 
      COUNT(*) AS total_conversations,
      SUM(CASE WHEN target_role = 'admin' THEN 1 ELSE 0 END) AS forwarded_to_admin,
      SUM(CASE WHEN target_role = 'lurah' THEN 1 ELSE 0 END) AS forwarded_to_lurah,
      SUM(CASE WHEN target_role = 'admin' AND status = 'waiting_response' THEN 1 ELSE 0 END) AS pending_admin,
      SUM(CASE WHEN target_role = 'lurah' AND status = 'waiting_response' THEN 1 ELSE 0 END) AS pending_lurah,
      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS completed_chats,
      SUM(CASE WHEN status = 'waiting_response' THEN 1 ELSE 0 END) AS waiting_chats
    FROM chat_conversations
    ${kelurahanFilter}
  `, params);

  // Aspirations Stats
  const [[aspirationStats]] = await db.query(`
    SELECT 
      COUNT(*) AS total_aspirations,
      SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) AS completed_aspirations,
      SUM(CASE WHEN status = 'baru' THEN 1 ELSE 0 END) AS waiting_aspirations,
      SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) AS rejected_aspirations
    FROM citizen_aspirations
    ${kelurahanFilter}
  `, params);

  // Weekly Stats
  const [weeklyChats] = await db.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as masuk,
      SUM(CASE WHEN target_role = 'lurah' THEN 1 ELSE 0 END) as lurah,
      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as selesai
    FROM chat_conversations
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    ${kelurahanId ? 'AND kelurahan_id = ?' : ''}
    GROUP BY DATE(created_at)
  `, kelurahanId ? [kelurahanId] : []);

  const [weeklyAspirations] = await db.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as masuk,
      SUM(CASE WHEN assigned_to_role = 'lurah' THEN 1 ELSE 0 END) as lurah,
      SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
    FROM citizen_aspirations
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    ${kelurahanId ? 'AND kelurahan_id = ?' : ''}
    GROUP BY DATE(created_at)
  `, kelurahanId ? [kelurahanId] : []);

  // Combine weekly stats in JS
  const weeklyStatsMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const name = `${d.getDate()} ${monthNames[d.getMonth()]}`;
    weeklyStatsMap[dateStr] = { name, masuk: 0, lurah: 0, selesai: 0 };
  }

  const addStats = (rows) => {
    rows.forEach(row => {
      // row.date is a Date object in mysql2
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (weeklyStatsMap[dateStr]) {
        weeklyStatsMap[dateStr].masuk += Number(row.masuk || 0);
        weeklyStatsMap[dateStr].lurah += Number(row.lurah || 0);
        weeklyStatsMap[dateStr].selesai += Number(row.selesai || 0);
      }
    });
  };
  addStats(weeklyChats);
  addStats(weeklyAspirations);

  const weekly_stats = Object.values(weeklyStatsMap);

  // Aspiration Categories
  const [categories] = await db.query(`
    SELECT category as name, COUNT(*) as value
    FROM citizen_aspirations
    ${kelurahanFilter}
    GROUP BY category
  `, params);

  const totalAspirations = categories.reduce((sum, c) => sum + Number(c.value), 0);
  const aspiration_categories = categories.map((c, i) => {
    const colors = ['#112A46', '#3B82F6', '#F59E0B', '#10B981', '#6366F1'];
    return {
      name: c.name,
      value: totalAspirations > 0 ? Math.round((Number(c.value) / totalAspirations) * 100) : 0,
      count: Number(c.value),
      color: colors[i % colors.length]
    };
  });

  return {
    total_conversations: Number(chatStats.total_conversations || 0),
    resolved_by_ai: 0,
    forwarded_to_admin: Number(chatStats.forwarded_to_admin || 0),
    forwarded_to_lurah: Number(chatStats.forwarded_to_lurah || 0),
    pending_admin: Number(chatStats.pending_admin || 0),
    pending_lurah: Number(chatStats.pending_lurah || 0),
    
    total_tickets: Number(chatStats.total_conversations || 0) + Number(aspirationStats.total_aspirations || 0),
    completed_tickets: Number(chatStats.completed_chats || 0) + Number(aspirationStats.completed_aspirations || 0),
    waiting_tickets: Number(chatStats.waiting_chats || 0) + Number(aspirationStats.waiting_aspirations || 0),
    rejected_tickets: Number(aspirationStats.rejected_aspirations || 0),

    weekly_stats,
    aspiration_categories
  };
}

module.exports = {
  getStatistics
};
