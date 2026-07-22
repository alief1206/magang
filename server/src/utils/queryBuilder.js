function buildUpdateQuery(tableName, fields, id) {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined)

  if (!entries.length) {
    return null
  }

  const setClause = entries.map(([field]) => `${field} = ?`).join(', ')
  const values = entries.map(([, value]) => value)

  return {
    sql: `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
    values: [...values, id],
  }
}

module.exports = {
  buildUpdateQuery,
}
