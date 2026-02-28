export const formatSaleStatus = (status) => {
  switch (status) {
    case "completed":
      return "Paid";
    case "pending":
      return "Pending";
    case "returned":
      return "Returned";
    default:
      return status;
  }
};

export const formatPaymentMethod = (method) => {
  switch (method) {
    case "cash":
      return "Cash";
    case "upi":
      return "UPI";
    case "bank":
      return "Bank Transfer";
    case "credit":
      return "Credit";
    default:
      return method;
  }
};
