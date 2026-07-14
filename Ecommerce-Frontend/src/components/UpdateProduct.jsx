import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/product/${id}`);

      setProduct(response.data);
      setUpdateProduct(response.data);

      if (response.data.imageName) {
        const responseImage = await axios.get(
          `/product/${id}/image`,
          {
            responseType: "blob",
          }
        );

        const imageFile = new File(
          [responseImage.data],
          response.data.imageName,
          {
            type: responseImage.data.type,
          }
        );

        setImage(imageFile);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (image) {
        formData.append("imageFile", image);
      }

      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      await axios.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    setUpdateProduct((prev) => ({
      ...prev,
      productAvailable: e.target.checked,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>

        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>

            <input
              type="number"
              className="form-control"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>

            <select
              className="form-select"
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
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
              value={updateProduct.stockQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Product"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  padding: "5px",
                }}
              />
            )}

            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={updateProduct.productAvailable}
                onChange={handleCheckbox}
              />

              <label className="form-check-label">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;