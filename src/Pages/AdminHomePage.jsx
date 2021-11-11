import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ImageUploading from 'react-images-uploading';
import styles from "./CommonStyle.module.css";
import placeholder from '../assets/index.jpeg';

const AdminHomePage = () => {
  const history = useHistory();
  const [addProduct, setAddProduct] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    image_url: "",
    price: "",
    sku: "",
    stock: "",
    region: "",
  });
  const [productToEdit, setProductToEdit] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [error, setError] = useState(false);

  const HandleChangeInput = (e) => {
    // to take user input
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //   const HandleImageInput = (e) => {
  //     setData(setImage(e.target.files[0]));
  //   };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token === undefined) history.push("/login");
  });

  const headersProvider = () => {
    const token = Cookies.get("token");
    return {
      Authorization: token,
    };
  };

  useEffect(() => {
    // to fetch all the products
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

  useEffect(() => {
    // to fetch all the regions
    if (regions.length === 0) {
      (async () => {
        const resp = await axios.get(
          "https://simpleshop-app.herokuapp.com/api/v1/regions",
          {
            headers: headersProvider(),
          }
        );
        if (resp && resp.data && resp.data.length !== 0) {
          setRegions(resp.data);
        }
      })();
    }
  });

  const handleDelete = (id) => {
    // to delete the products
    (async () => {
      var resp = await axios.delete(
        `https://simpleshop-app.herokuapp.com/api/v1/products/${id}`,
        {
          headers: headersProvider(),
        }
      );
      resp = await axios.get(
        "https://simpleshop-app.herokuapp.com//api/v1/products",
        {
          headers: headersProvider(),
        }
      );
      if (resp && resp.data && resp.data.length !== 0) {
        setProducts(resp.data);
      }
    })();
  };

  const handleLogout = () => {
    // to logout from an application
    Cookies.remove("token");
    history.push("/login");
  };

  const handleAddProduct = () => {
    // to add products
    const productDetails = {
      product: {
        title: data.title,
        description: data.description,
        price: data.price,
        sku: data.sku,
        stock: parseInt(data.stock),
        region_id: parseInt(
          regions.length === 1 || data.region === null
            ? regions[0].id
            : data.region.title !== undefined
            ? data.region.id
            : data.region
        ),
        image: images[0].data_url,
      },
    };
    if (
      data.title === "" ||
      data.description === "" ||
      data.price === "" ||
      data.sku === "" ||
      data.stock === ""
    ) {
      setError(true);
      return;
    }
    (async () => {
      var resp = await axios.post(
        "https://simpleshop-app.herokuapp.com//api/v1/products",
        productDetails,
        {
          headers: headersProvider(),
        }
      );
      setAddProduct(false);
      setProductToEdit([]);
      setImages([]);
      resp = await axios.get(
        "https://simpleshop-app.herokuapp.com//api/v1/products",
        {
          headers: headersProvider(),
        }
      );
      if (resp && resp.data && resp.data.length !== 0) {
        setProducts(resp.data);
      }
    })();
  };

  const handleEditProduct = (id) => {
    const toEdit = products.filter((product) => product.id === id);
    const a = toEdit[0];
    setProductToEdit(toEdit);
    setAddProduct(true);
    setData({ ...a });
  };

  const handleProductUpdate = () => {
    // to edit/update the existing products
    const productDetails = {
        product: {
          title: data.title,
          description: data.description,
          price: data.price,
          sku: data.sku,
          stock: parseInt(data.stock),
          region_id: parseInt(
            regions.length === 1 || data.region === null
              ? regions[0].id
              : data.region.title !== undefined
              ? data.region.id
              : data.region
          ),
          image: images[0].data_url,
        },
      };
    (async () => {
      var resp = await axios.put(
        `https://simpleshop-app.herokuapp.com/api/v1/products/${data.id}`,
        productDetails,
        {
          headers: headersProvider(),
        }
      );
      setAddProduct(false);
      setProductToEdit([]);
      setImages([]);
      resp = await axios.get(
        "https://simpleshop-app.herokuapp.com//api/v1/products",
        {
          headers: headersProvider(),
        }
      );
      if (resp && resp.data && resp.data.length !== 0) {
        setProducts(resp.data);
      }
    })();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };

  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div>
      {!addProduct ? (
        <div>
          <h1>Manage Product List By Admin</h1>
          <table style={{ margin: "auto" }}>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
            {products.map((product) => (
              <tr>
                <td>
                  <img src={product.image_url !== null ? product.image_url : placeholder} alt="product" width="50px" />
                </td>
                <td>
                  <div style={{ marginLeft: "5px" }}>{product.title}</div>
                </td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.sku}</td>
                <td>{product.stock}</td>
                <td>{product.region.title}</td>
                <td>
                  <button
                    style={{ marginRight: "10px", marginBottom: "4px" }}
                    className={styles.buttonStyle}
                    onClick={() => handleEditProduct(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.buttonStyle}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </table>
          <div style={{ marginTop: "30px", marginBottom: "50px" }}>
            <button onClick={handleLogout} className={styles.logoutButtonStyle}>
              Logout
            </button>
            <button
              className={styles.buttonStyle}
              onClick={() => {
                setAddProduct(true);
                setProductToEdit([]);
              }}
            >
              Add Product
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: "60px",
            marginBottom: "50px",
            marginLeft: "20px",
            marginRight: "40px",
          }}
        >
          <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
            <Alert severity="error" onClose={handleClose}>
              All fields are required
            </Alert>
          </Snackbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div>Title</div>
              <input
                type="text"
                name="title"
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].title : ""
                }
                className={styles.textFields}
                placeholder="Product Name"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
            <div>
              <div>Description</div>
              <input
                type="text"
                name="description"
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].description : ""
                }
                className={styles.textFields}
                placeholder="Product Description"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
            <div>
              <div>Price</div>
              <input
                type="text"
                name="price"
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].price : ""
                }
                className={styles.textFields}
                placeholder="Product Price"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div>
              <div>Stock</div>
              <input
                type="number"
                name="stock"
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].stock : ""
                }
                className={styles.textFields}
                placeholder="Product Available"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
            <div>
              <div>SKU</div>
              <input
                type="text"
                name="sku"
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].sku : ""
                }
                className={styles.textFields}
                placeholder="SKU"
                onChange={(e) => HandleChangeInput(e)}
              />
            </div>
            <div>
              <div>Image</div>
              {/* <input
                type="file"
                name="image_url"
                className={styles.textFields}
                onChange={(e) => setImage(e.target.files[0])}
              /> */}
              <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div>
              <div>Region</div>
              <select
                className={styles.dropdownStyle}
                name="region"
                onChange={(e) => HandleChangeInput(e)}
                defaultValue={
                  productToEdit.length !== 0 ? productToEdit[0].region.id : ""
                }
              >
                {regions.map((region) => (
                  <option value={region.id}>{region.title}</option>
                ))}
              </select>
              {/* <input
                type="text"
                name="region"
                defaultValue={
                  productToEdit.length !== 0
                    ? productToEdit[0].region.country
                    : ""
                }
                className={styles.textFields}
                placeholder="Region"
                onChange={(e) => HandleChangeInput(e)}
              /> */}
            </div>
          </div>
          <button
            onClick={() => {
              setAddProduct(false);
              setProductToEdit([]);
            }}
            className={styles.logoutButtonStyle}
          >
            Back
          </button>
          <button
            onClick={
              productToEdit.length !== 0
                ? handleProductUpdate
                : handleAddProduct
            }
            className={styles.buttonStyle}
          >
            {productToEdit.length !== 0 ? "Update" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};
export default AdminHomePage;
