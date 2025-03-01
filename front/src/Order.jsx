import React, { useState, useEffect } from 'react';

const AdvancedOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    documentId: '',
    date: '',
    statas: 'pending',
    check_import: false,
    order_detail: [],
  });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingDetailId, setEditingDetailId] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:1337/api/orders?populate=order_detail')
      .then((response) => response.json())
      .then((data) => setOrders(data.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (e, orderId, detailId) => {
    const { name, value } = e.target;

    if (orderId && detailId) {
      // Update order detail
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_detail: order.order_detail.map((detail) =>
                  detail.id === detailId
                    ? { ...detail, [name]: value }
                    : detail
                ),
              }
            : order
        )
      );
    } else if (orderId) {
      // Update order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, [name]: value } : order
        )
      );
    } else {
      // Update new order form
      setNewOrder((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrder = () => {
    const newOrderWithId = {
      ...newOrder,
      id: orders.length + 1, // Temporary ID (replace with API-generated ID)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrderWithId]);
    setNewOrder({
      documentId: '',
      date: '',
      statas: 'pending',
      check_import: false,
      order_detail: [],
    });
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  const handleAddDetail = (orderId) => {
    const newDetail = {
      id: Date.now(), // Temporary ID (replace with API-generated ID)
      documentId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      qty: 0,
    };
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, order_detail: [...order.order_detail, newDetail] }
          : order
      )
    );
  };

  const handleDeleteDetail = (orderId, detailId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              order_detail: order.order_detail.filter(
                (detail) => detail.id !== detailId
              ),
            }
          : order
      )
    );
  };

  const handleSave = async () => {
    try {
      // Save all changes to the API
      const response = await fetch('http://localhost:1337/api/orders', {
        method: 'POST', // or 'PUT' for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: orders }),
      });
      const result = await response.json();
      console.log('Data saved:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <h1>Advanced Orders Table</h1>
      <button onClick={handleSave}>Save All Changes</button>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Document ID</th>
            <th>Date</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Published At</th>
            <th>Status</th>
            <th>Check Import</th>
            <th>Order Detail ID</th>
            <th>Order Detail Document ID</th>
            <th>Order Detail Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              {order.order_detail.map((detail, index) => (
                <tr key={`${order.id}-${detail.id}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={order.order_detail.length}>{order.id}</td>
                      <td rowSpan={order.order_detail.length}>
                        <input
                          type="text"
                          name="documentId"
                          value={order.documentId}
                          onChange={(e) => handleInputChange(e, order.id)}
                        />
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        <input
                          type="date"
                          name="date"
                          value={order.date}
                          onChange={(e) => handleInputChange(e, order.id)}
                        />
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        {order.createdAt}
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        {order.updatedAt}
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        {order.publishedAt}
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        <select
                          name="statas"
                          value={order.statas}
                          onChange={(e) => handleInputChange(e, order.id)}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td rowSpan={order.order_detail.length}>
                        <input
                          type="checkbox"
                          name="check_import"
                          checked={order.check_import}
                          onChange={(e) =>
                            handleInputChange(e, order.id)
                          }
                        />
                      </td>
                    </>
                  )}
                  <td>{detail.id}</td>
                  <td>
                    <input
                      type="text"
                      name="documentId"
                      value={detail.documentId}
                      onChange={(e) =>
                        handleInputChange(e, order.id, detail.id)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={detail.qty}
                      onChange={(e) =>
                        handleInputChange(e, order.id, detail.id)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteDetail(order.id, detail.id)}>
                      Delete Detail
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="12">
                  <button onClick={() => handleAddDetail(order.id)}>
                    Add Detail
                  </button>
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Delete Order
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Add New Order</h2>
        <input
          type="text"
          name="documentId"
          placeholder="Document ID"
          value={newOrder.documentId}
          onChange={(e) => handleInputChange(e)}
        />
        <input
          type="date"
          name="date"
          value={newOrder.date}
          onChange={(e) => handleInputChange(e)}
        />
        <select
          name="statas"
          value={newOrder.statas}
          onChange={(e) => handleInputChange(e)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <label>
          Check Import:
          <input
            type="checkbox"
            name="check_import"
            checked={newOrder.check_import}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <button onClick={handleAddOrder}>Add Order</button>
      </div>
    </div>
  );
};

export default AdvancedOrdersTable;