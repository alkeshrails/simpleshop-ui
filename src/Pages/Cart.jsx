/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styles from "./CommonStyle.module.css";
import OrderDetails from "./OrderDetails";

const Cart = (props) => {
  const history = useHistory();
  const { selectedProduct, products } = props;

  const [data, setData] = useState({
    address: "",
  });
  const [itemss, setItems] = useState([]);

  const [count, setCount] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderResp, setOrderResp] = useState([]);

  useEffect(() => {
    var sp = products.filter(
      (product) => selectedProduct.indexOf(product.title) > -1
    );
    setFilteredArray(sp);
    if (count.length < selectedProduct.length) {
      sp.map((p) => {
        setCount(count.concat(1));
      });
    }
  });

  const handleAdd = (i) => {
    const newArr = count;
    if (newArr[i].toString() === filteredArray[i].stock) return;
    newArr[i] = newArr[i] + 1;
    setCount(newArr);
  };

  const handleSubs = (i) => {
    const newArr = count;
    if (newArr[i] === 1) return;
    newArr[i] = newArr[i] - 1;
    setCount(newArr);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    history.push("/login");
  };

  const headersProvider = () => {
    const token = Cookies.get("token");
    return {
      Authorization: token,
    };
  };

  const handleProceedToPayment = () => {                    // method to place orders
    selectedProduct.map((sp, i) => {
      const arr = itemss;
      arr.push({ id: filteredArray[i].id, qty: count[i] });
      setItems(arr);
    });
    (async () => {
      const resp = await axios.post(
        "https://simpleshop-app.herokuapp.com/api/v1/orders",
        {
          order: {
            shipping_address: data.address,
            items: JSON.stringify(itemss),
          },
        },
        {
          headers: headersProvider(),
        }
      );
      if (resp && resp.data && resp.data.status !== undefined) {
        setOrderResp(resp.data);
        setShowOrderDetails(true);
      }
    })();
  };

  const HandleChangeInput = (e) => {
    setData({ ...data, address: e.target.value });
  };

  return (
    <div>
      {showOrderDetails ? (
        <OrderDetails
          orderResp={orderResp}
          itemss={itemss}
          filteredArray={filteredArray}
        />
      ) : (
        <div>
          <h1>Selected Products</h1>
          <div className={styles.selectedProduct}>
            {selectedProduct && selectedProduct.length !== 0 ? (
              selectedProduct.map((product, i) => (
                <div className={styles.productName}>
                  <div className={styles.productHeading}>{product}</div>
                  <button
                    className={styles.buttonStylee}
                    onClick={() => handleAdd(i)}
                  >
                    +
                  </button>
                  <div>{count[i]}</div>
                  <button
                    className={styles.buttonStylee}
                    onClick={() => handleSubs(i)}
                  >
                    -
                  </button>
                </div>
              ))
            ) : (
              <div>No Products Selected</div>
            )}
          </div>
          {selectedProduct && selectedProduct.length !== 0 && (
            <div className={styles.labelStyle}>
              <label>Enter Address</label>
              <br />
              <input
                type="text"
                className={styles.textFields}
                id="exampleInputEmail1"
                name="address"
                placeholder="address"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
          )}
          <div style={{ marginTop: "30px" }}>
            <button onClick={handleLogout} className={styles.logoutButtonStyle}>
              Logout
            </button>
            <button
              onClick={selectedProduct.length !== 0 ? handleProceedToPayment : ''}
              className={styles.buttonStyle}
            >
              Proceed To Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;
