/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./CommonStyle.module.css";

const OrderDetails = (props) => {
  const history = useHistory();
  const { orderResp, itemss, filteredArray } = props;

  return (
    <div style={{ width: "30%", margin: "auto", paddingTop: "100px" }}>
      <h1>Order Summary</h1>
      <br />
      <div className={styles.orderStyle}>
        <div>Customer Name</div>
        <div>{orderResp.customer_name}</div>
      </div>
      {itemss.map((item, i) => (
        <div className={styles.orderStyle}>
          <div>{filteredArray[i].title}</div>
          <div>{`${item.qty}*${filteredArray[i].price}`}</div>
        </div>
      ))}
      <div className={styles.orderStyle}>
        <div>Order Id</div>
        <div>{orderResp.id}</div>
      </div>
      <div className={styles.orderStyle}>
        <div>Order Status</div>
        <div>{orderResp.status}</div>
      </div>
      <hr />
      <div className={styles.orderStyle}>
        <div>Order Total</div>
        <div>{orderResp.order_total}</div>
      </div>
      <button
        style={{ marginTop: '20px' }}
        className={styles.buttonStylee}
        onClick={() => history.push("/all-orders")}
      >
        View all Orders
      </button>
    </div>
  );
};
export default OrderDetails;
