import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();

  const {
    addToCart,
    removeFromCart,
    refreshData,
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();

    return () => {
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/product/${id}`);

      setProduct(response.data);

      if (response.data.imageName) {
        fetchImage();
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `/product/${id}/image`,
        {
          responseType: "blob",
        }
      );

      setImageUrl(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);

      removeFromCart(Number(id));

      alert("Product deleted successfully.");

      refreshData();

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Unable to delete product.");
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart.");
  };

  if (!product) {
    return (
      <h2
        className="text-center"
        style={{ padding: "10rem" }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div
        className="containers"
        style={{ display: "flex" }}
      >
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{
            width: "50%",
            height: "auto",
            objectFit: "cover",
          }}
        />

        <div
          className="right-column"
          style={{ width: "50%" }}
        >
          <div className="product-description">

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "lighter",
                }}
              >
                {product.category}
              </span>

              <h6>
                Listed :
                <i>
                  {" "}
                  {new Date(
                    product.releaseDate
                  ).toLocaleDateString()}
                </i>
              </h6>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                marginBottom: ".5rem",
                textTransform: "capitalize",
              }}
            >
              {product.name}
            </h1>

            <i>{product.brand}</i>

            <p
              style={{
                marginTop: "20px",
                fontWeight: "bold",
              }}
            >
              PRODUCT DESCRIPTION
            </p>

            <p>{product.description}</p>
          </div>

          <div className="product-price">

            <span
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              ₹{product.price}
            </span>

            <br />
            <br />

            <button
              className={`cart-btn ${
                !product.productAvailable
                  ? "disabled-btn"
                  : ""
              }`}
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
            >
              {product.productAvailable
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            <br />
            <br />

            <h6>
              Stock Available :
              <span
                style={{
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {product.stockQuantity}
              </span>
            </h6>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={handleEditClick}
            >
              Update
            </button>

            <button
              className="btn btn-danger"
              onClick={deleteProduct}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;