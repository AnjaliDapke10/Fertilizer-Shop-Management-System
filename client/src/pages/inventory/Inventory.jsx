import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getLowStock } from "../../services/inventoryService";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLowStock()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Card title="Low Stock Items">
      <Table
        columns={["Product", "Available Qty", "Reorder Level"]}
        data={items.map(i => ({
          product: i.name,
          qty: i.available_qty,
          reorder: i.reorder_level
        }))}
      />
    </Card>
  );
};

export default Inventory;
