import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import styles from "./CommonStyle.module.css";
import Cart from "./Cart";
import placeholder from '../assets/index.jpeg';

const HomePage = () => {
  const history = useHistory();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token === undefined) history.push('/login');
  });

  const headersProvider = () => {
    const token = Cookies.get("token");
    return {
      Authorization: token,
    };
  };

  useEffect(() => {                               // to fetch all the products
    if (products.length === 0) {
      (async () => {
        const resp = await axios.get(
          "https://simpleshop-app.herokuapp.com//api/v1/products",
          {
            headers: headersProvider(),
          }
        );
        if (resp && resp.data && resp.data.length !== 0) {
          setProducts(resp.data);
        }
      })();
    }
  });

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleCheckbox = (e) => {
    const value = e.target.value;
    if (selectedProduct.includes(value)) {
      const index = selectedProduct.indexOf(value);
      const newArr = selectedProduct;
      newArr.splice(index);
      setSelectedProduct(newArr);
    } else {
      setSelectedProduct(selectedProduct.concat(value));
    }
  };

  const handleAddToCart = () => {
    // const productss = products.filter((product, i) => product.title === selectedProduct[i]);
    // const stocks = productss.map(p => p.stock);
    // setStock(stocks);
    setShowCart(true);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    history.push('/login');
  }

  return (
    <div>
      {showCart ? (
        <Cart selectedProduct={selectedProduct} products={products} />
      ) : (
        <div className={styles.table}>
          <h1>Product List</h1>
          <table style={{ margin: "auto" }}>
            <tr>
              <th></th>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>SKU</th>
              <th>Region</th>
              <th>Stock</th>
            </tr>
            {products.map((product) => (
              <tr>
                <td>
                  <input
                    type="checkbox"
                    value={product.title}
                    id={product.stock}
                    onClick={(e) => handleCheckbox(e)}
                  />
                </td>
                <td>
                  <img src={product.image_url !== null ? product.image_url : placeholder} alt="product" width="50px" />
                </td>
                <td>
                  <div style={{ marginLeft: "5px" }}>{product.title}</div>
                </td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.sku}</td>
                <td>{product.region.country}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </table>
          <div style={{ marginTop: "30px", marginBottom: '50px' }}>
            <button onClick={handleLogout} className={styles.logoutButtonStyle}>Logout</button>
            <button className={styles.buttonStyle} onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomePage;
