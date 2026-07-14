import React, { useState } from "react";
import axios from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("imageFile", image);

      formData.append(
        "product",
        new Blob([JSON.stringify(product)], {
          type: "application/json",
        })
      );

      const response = await axios.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      alert("Product Added Successfully!");

      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
      });

      setImage(null);
    } catch (error) {
      console.log(error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      alert("Failed to add product");
    }
  };

  return (
    <div className="container">
      <div className="center-container">
        <form className="row g-3 pt-5" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Brand"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>

            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>

            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>

            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>

            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Image</h6>
            </label>

            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    productAvailable: e.target.checked,
                  }))
                }
              />

              <label className="form-check-label">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;