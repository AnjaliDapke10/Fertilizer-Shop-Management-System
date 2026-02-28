async function allocateFIFO(client, productId, requiredQty) {
  const batchQuery = `
    SELECT id, available_qty
    FROM batches
    WHERE product_id = $1
      AND available_qty > 0
    ORDER BY arrival_date ASC
    FOR UPDATE
  `;

  const { rows: batches } = await client.query(batchQuery, [productId]);

  let remaining = requiredQty;
  const allocations = [];

  for (const batch of batches) {
    if (remaining <= 0) break;

    const deductQty = Math.min(batch.available_qty, remaining);

    allocations.push({
      batch_id: batch.id,
      quantity: deductQty
    });

    remaining -= deductQty;
  }

  if (remaining > 0) {
    throw new Error("Insufficient stock for product " + productId);
  }

  return allocations;
}

module.exports = allocateFIFO;

// FOR UPDATE → locks rows (no race condition)

// Oldest batch first

// Partial batch handling

// Throws if stock insufficient