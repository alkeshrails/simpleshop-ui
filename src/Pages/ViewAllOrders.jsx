/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import styles from "./CommonStyle.module.css";

const ViewAllOrders = () => {
  const history = useHistory();

  const [allOrders, setAllOrders] = useState([]);

  const headersProvider = () => {
    const token = Cookies.get("token");
    return {
      Authorization: token,
    };
  };

  useEffect(() => {                          // to fetch all the orders by customer
    if (allOrders.length === 0) {
    (async () => {
      const resp = await axios.get(
        "https://simpleshop-app.herokuapp.com/api/v1/orders",
        {
          headers: headersProvider(),
        }
      );
      if (resp && resp.data.length !== 0) {
        setAllOrders(resp.data);
      }
    })();
  }
  });

  return (
    <div style={{ width: "30%", marginBottom: '50px' }}>
      <h1>Order Summary</h1>
      <br />
      <button className={styles.buttonStyle} onClick={() => history.push("/home")}>Product List</button>
      {allOrders && allOrders.map((order) => (
        <div style={{ marginTop: '50px' }}>
          <div className={styles.orderStyle}>
            <div>Order Id</div>
            <div>{order.id}</div>
          </div>
          <div className={styles.orderStyle}>
            <div>Order Status</div>
            <div>{order.status}</div>
          </div>
          {order.products.map((product, i) => (
          <div className={styles.orderStyle}>
            <div>{`Product ${i+1}`}</div>
            <div>{product.title}</div>
          </div>
          ))}
          <hr />
          <div className={styles.orderStyle}>
            <div>Order Total</div>
            <div>{order.order_total}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ViewAllOrders;
