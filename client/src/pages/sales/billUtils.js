export const calculateBill = (items) => {
  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.unit_price,
    0
  );

  const discount = items.reduce(
    (sum, i) => sum + (i.discount || 0),
    0
  );

  const taxable = subtotal - discount;
  const gst = Math.round(taxable * 0.18);
  const grandTotal = taxable + gst;

  return { subtotal, discount, gst, grandTotal };
};
