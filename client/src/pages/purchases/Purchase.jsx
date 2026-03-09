import { useEffect, useState } from "react";
import {
  getPurchases,
  deletePurchase
} from "../../services/purchaseService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddPurchase from "./AddPurchase";
import PurchaseDetailModal from "./PurchaseDetailModal";

const Purchases = () => {

  const [purchases,setPurchases] = useState([]);
  const [filtered,setFiltered] = useState([]);

  const [loading,setLoading] = useState(true);

  const [showAdd,setShowAdd] = useState(false);
  const [editPurchase,setEditPurchase] = useState(null);
  const [detailPurchase,setDetailPurchase] = useState(null);

  const [search,setSearch] = useState("");

  const fetchPurchases = () => {

    setLoading(true);

    getPurchases()
      .then(data => {

        setPurchases(data);
        setFiltered(data);

      })
      .finally(()=>setLoading(false));

  };

  useEffect(fetchPurchases,[]);

  useEffect(()=>{

    const s = search.toLowerCase();

    const result = purchases.filter(p =>
      p.invoice_number?.toLowerCase().includes(s) ||
      p.supplier_name?.toLowerCase().includes(s)
    );

    setFiltered(result);

  },[search,purchases]);

  if(loading) return <Loader/>;

  return(

    <>
      <PageWrapper
        title="Purchases"
        subtitle="Manage purchase orders and inventory restocking"
        action={
          <button className="btn-primary" onClick={()=>setShowAdd(true)}>
            + Add Purchase
          </button>
        }
      >

        <Card>

          <input
            placeholder="Search invoice or supplier..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{
              padding:"8px",
              width:"250px",
              marginBottom:"12px"
            }}
          />

          <Table
            columns={[
              "Invoice",
              "Supplier",
              "Items",
              "Total",
              "Date",
              "Actions"
            ]}
            data={filtered.map(p=>({

              invoice:p.invoice_number,
              supplier:p.supplier_name,
              items:p.items_count,
              total:`₹${p.total_amount}`,
              date:p.purchase_date,

              actions:(
                <div style={{display:"flex",gap:"6px"}}>

                  <button onClick={()=>setDetailPurchase(p.id)}>👁</button>

                  <button onClick={()=>setEditPurchase(p.id)}>✏</button>

                  <button
                    onClick={async()=>{

                      if(window.confirm("Delete purchase?")){

                        await deletePurchase(p.id);
                        fetchPurchases();

                      }

                    }}
                  >
                    🗑
                  </button>

                </div>
              )

            }))}
          />

        </Card>

      </PageWrapper>

      {showAdd &&
        <AddPurchase
          onClose={()=>setShowAdd(false)}
          onSave={()=>{
            setShowAdd(false);
            fetchPurchases();
          }}
        />
      }

      {editPurchase &&
        <AddPurchase
          purchaseId={editPurchase}
          onClose={()=>setEditPurchase(null)}
          onSave={()=>{
            setEditPurchase(null);
            fetchPurchases();
          }}
        />
      }

      {detailPurchase &&
        <PurchaseDetailModal
          purchaseId={detailPurchase}
          onClose={()=>setDetailPurchase(null)}
        />
      }

    </>
  );

};

export default Purchases;