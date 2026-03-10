import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ProductSelect from "./ProductSelect";
import { calculateBill } from "./billUtils";
import { createSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getAvailableProducts } from "../../services/inventoryService";

const NewSale = ({ onClose, onSave }) => {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    discount: 0
  });

  /* LOAD DATA */

  useEffect(() => {

    const loadData = async () => {

      try {

        const customersData = await getCustomers();
        const productsData = await getAvailableProducts();

        setCustomers(customersData || []);
        setProducts(productsData || []);

      } catch (err) {
        console.error("Failed loading sale data", err);
      }

    };

    loadData();

  }, []);

  /* SELECTED PRODUCT */

  const selectedProduct = products.find(
    (p) => p.product_id === Number(form.product_id)
  );

  /* ADD ITEM */

  const addItem = () => {

    if (!selectedProduct) {
      alert("Select a product");
      return;
    }

    if (!form.quantity) {
      alert("Enter quantity");
      return;
    }

    const qty = Number(form.quantity);

    if (qty > selectedProduct.available_qty) {
      alert("Not enough stock available");
      return;
    }

    const newItem = {
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
      unit_price: selectedProduct.selling_price,
      quantity: qty,
      discount: Number(form.discount || 0)
    };

    setItems((prev) => [...prev, newItem]);

    setForm({
      product_id: "",
      quantity: "",
      discount: 0
    });

  };

  /* REMOVE ITEM */

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const bill = calculateBill(items);

  /* SUBMIT SALE */

  const submit = async () => {

    if (!items.length) {
      alert("Add at least one product");
      return;
    }

    try {

      await createSale({
        customer_id: customerId || null,
        sale_date: new Date().toISOString().slice(0, 10),
        invoice_number: "INV-" + Date.now(),
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          selling_price: i.unit_price
        }))
      });

      onSave();

    } catch (err) {
      console.error("Sale failed", err);
      alert("Failed to create sale");
    }

  };

  return (
    <Modal
      title="New Sale / Invoice"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={submit}
            disabled={!items.length}
          >
            Save Invoice
          </button>
        </>
      }
    >

      <div className="grid gap-16">

        {/* CUSTOMER + PAYMENT */}

        <div className="grid grid-2 gap-12">

          <div>
            <label>Customer</label>

            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >

              <option value="">Walk-in Customer</option>

              {customers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>
          </div>

          <div>
            <label>Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
            </select>

          </div>

        </div>

        {/* ADD PRODUCT */}

        <div className="card">

          <h4>Add Product</h4>

          <div className="grid grid-5 gap-8">

            <ProductSelect
              products={products}
              value={form.product_id}
              onChange={(e) =>
                setForm({ ...form, product_id: e.target.value })
              }
            />

            <Input
              placeholder="Qty"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <Input
              placeholder="Discount"
              type="number"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: e.target.value })
              }
            />

            <Input
              value={`₹${selectedProduct?.selling_price || 0}`}
              disabled
            />

            <button className="btn-primary" onClick={addItem}>
              Add
            </button>

          </div>

        </div>

        {/* ITEMS TABLE */}

        <div className="card">

          <h4>Sale Items</h4>

          {items.length === 0 ? (
            <p>No products added</p>
          ) : (

            <table className="table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {items.map((i, idx) => (

                  <tr key={idx}>

                    <td>{i.product_name}</td>

                    <td>{i.quantity}</td>

                    <td>₹{i.unit_price}</td>

                    <td>₹{i.discount}</td>

                    <td>
                      ₹{i.quantity * i.unit_price - i.discount}
                    </td>

                    <td>

                      <button
                        className="icon-btn"
                        onClick={() => removeItem(idx)}
                      >
                        ❌
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* BILL SUMMARY */}

        <div className="card">

          <h4>Bill Summary</h4>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{bill.subtotal}</span>
          </div>

          <div className="bill-row">
            <span>Discount</span>
            <span>-₹{bill.discount}</span>
          </div>

          <div className="bill-row">
            <span>GST (18%)</span>
            <span>₹{bill.gst}</span>
          </div>

          <hr />

          <div className="bill-row grand-total">
            <b>Grand Total</b>
            <b>₹{bill.grandTotal}</b>
          </div>

        </div>

      </div>

    </Modal>
  );
};

export default NewSale;