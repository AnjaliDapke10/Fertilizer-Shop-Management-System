const pool = require('../config/db');

const InventoryModel = {
    async getLowStock() {
        const query = `
            SELECT
                p.id ,
                p.name,
                ss.total_stock,
                p.reorder_level
                from products p 
                JOIN stock_summary ss ON p.id = ss.product_id
                WHERE ss.total_stock < p.reorder_level
        `;
        const { rows } = await pool.query(query);
        return rows;
    },


    async getNearExpiry(days = 30) {
    const query = `
    SELECT
        b.id as batch_id,
        p.name as product_name,
        b.expiry_date,
        b.available_qty
    from batches b
    JOIN products p ON b.product_id = p.id
    WHERE b.available_qty >0
        and b.expiry_date <= CURRENT_DATE +($1 || 'days')::interval
    ORDER BY b.expiry_date ASC
    `;
    const { rows } = await pool.query(query, [days]);
    return rows;        
},

async getStockAging() {
  const query = `
    SELECT
      p.name,
      b.batch_number,
      b.arrival_date,
      b.available_qty,
      CURRENT_DATE - b.arrival_date AS age_in_days
    FROM batches b
    JOIN products p ON p.id = b.product_id
    WHERE b.available_qty > 0
    ORDER BY age_in_days DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}


};



module.exports = InventoryModel;


                
