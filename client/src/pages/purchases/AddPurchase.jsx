import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import { createPurchase, updatePurchase, getPurchaseDetails } from "../../services/purchaseService";
import { getSuppliers } from "../../services/supplierService";
import { getProducts } from "../../services/productService";

const AddPurchase = ({ purchaseId, onClose, onSave }) => {

  const isEdit = Boolean(purchaseId);

  const [suppliers,setSuppliers] = useState([]);
  const [products,setProducts] = useState([]);

  const [supplier,setSupplier] = useState("");
  const [date,setDate] = useState("");

  const [items,setItems] = useState([
    {
      product_id:"",
      batch_number:"",
      expiry_date:"",
      quantity:"",
      price:""
    }
  ]);

  useEffect(()=>{

    const loadDropdowns = async () => {

      const s = await getSuppliers();
      const p = await getProducts();

      setSuppliers(Array.isArray(s)?s:[]);
      setProducts(Array.isArray(p)?p:[]);

    };

    loadDropdowns();

  },[]);

  useEffect(()=>{

    if(!purchaseId) return;

    const loadPurchase = async () => {

      const data = await getPurchaseDetails(purchaseId);

      if(!data.length) return;

      const first = data[0];

      setSupplier(first.supplier_id);
      setDate(first.purchase_date);

      const rows = data.map(i=>({

        product_id:i.product_id,
        batch_number:i.batch_number,
        expiry_date:i.expiry_date,
        quantity:i.quantity,
        price:i.purchase_price

      }));

      setItems(rows);

    };

    loadPurchase();

  },[purchaseId]);

  // Auto batch generator
  const generateBatch = (productName)=>{

    const year = new Date().getFullYear();

    const short = productName
      .replace(/\s+/g,"")
      .substring(0,4)
      .toUpperCase();

    const random = Math.floor(Math.random()*900)+100;

    return `${short}-${year}-${random}`;

  };

  const handleProductChange = (index,value)=>{

    const updated=[...items];

    updated[index].product_id=value;

    const product = products.find(p=>p.id==value);

    if(product){

      updated[index].batch_number =
        generateBatch(product.name);

    }

    setItems(updated);

  };

  const handleItemChange = (index,field,value)=>{

    const updated=[...items];

    updated[index][field]=value;

    setItems(updated);

  };

  const addRow = ()=>{

    setItems([
      ...items,
      {
        product_id:"",
        batch_number:"",
        expiry_date:"",
        quantity:"",
        price:""
      }
    ]);

  };

  const removeRow = (index)=>{

    const updated = items.filter((_,i)=>i!==index);
    setItems(updated);

  };

  const total = items.reduce((sum,i)=>{

    const q = Number(i.quantity)||0;
    const p = Number(i.price)||0;

    return sum + q*p;

  },0);

  const handleSubmit = async ()=>{

    const payload = {

      supplier_id:Number(supplier),
      purchase_date:date,

      items:items.map(i=>({

        product_id:Number(i.product_id),
        batch_number:i.batch_number,
        expiry_date:i.expiry_date,
        quantity:Number(i.quantity),
        purchase_price:Number(i.price)

      }))

    };

    if(isEdit){

      await updatePurchase(purchaseId,payload);

    }else{

      await createPurchase(payload);

    }

    onSave();

  };

  return(

    <Modal
      title={isEdit ? "Edit Purchase" : "Add Purchase"}
      onClose={onClose}
    >

      <div className="grid-2">

        <div>

          <label>Supplier</label>

          <select
            value={supplier}
            onChange={e=>setSupplier(e.target.value)}
          >

            <option value="">Select Supplier</option>

            {suppliers.map(s=>(
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}

          </select>

        </div>

        <div>

          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={e=>setDate(e.target.value)}
          />

        </div>

      </div>

      <h4 style={{marginTop:"20px"}}>Products</h4>

      <table className="purchase-table">
  <thead>
    <tr>
      <th style={{width:"180px"}}>Product</th>
      <th style={{width:"160px"}}>Batch</th>
      <th style={{width:"150px"}}>Expiry</th>
      <th style={{width:"100px"}}>Qty</th>
      <th style={{width:"120px"}}>Price</th>
      <th style={{width:"120px"}}>Total</th>
      <th style={{width:"60px"}}></th>
    </tr>
  </thead>

  <tbody>

  {items.map((item,index)=>{

    const rowTotal =
      (Number(item.quantity)||0) *
      (Number(item.price)||0);

    return(

      <tr key={index}>

        <td>

          <select
            value={item.product_id}
            onChange={e=>handleProductChange(index,e.target.value)}
          >

            <option value="">Select</option>

            {products.map(p=>(
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}

          </select>

        </td>

        <td>
          <input
            value={item.batch_number}
            onChange={e=>handleItemChange(index,"batch_number",e.target.value)}
          />
        </td>

        <td>
          <input
            type="date"
            value={item.expiry_date}
            onChange={e=>handleItemChange(index,"expiry_date",e.target.value)}
          />
        </td>

        <td>
          <input
            type="number"
            value={item.quantity}
            onChange={e=>handleItemChange(index,"quantity",e.target.value)}
          />
        </td>

        <td>
          <input
            type="number"
            value={item.price}
            onChange={e=>handleItemChange(index,"price",e.target.value)}
          />
        </td>

        <td>
          ₹{rowTotal}
        </td>

        <td>

          <button
            className="remove-row"
            onClick={()=>removeRow(index)}
          >
            ✕
          </button>

        </td>

      </tr>

    )

  })}

  </tbody>
</table>

      <button
        className="btn-secondary"
        style={{marginTop:"10px"}}
        onClick={addRow}
      >
        + Add Item
      </button>

      <h3 style={{marginTop:"20px"}}>
        Total: ₹{total}
      </h3>

      <div className="modal-actions">

        <button
          className="btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Purchase" : "Save Purchase"}
        </button>

      </div>

    </Modal>

  );

};

export default AddPurchase;