import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (!data || data.length === 0) {
        setProducts([]);
        return;
      }

      const updatedProducts = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await axios.get(
              `/product/${product.id}/image`,
              {
                responseType: "blob",
              }
            );

            const imageUrl = URL.createObjectURL(response.data);

            return {
              ...product,
              imageUrl,
            };
          } catch (err) {
            console.error(
              `Error loading image for product ${product.id}`,
              err
            );

            return {
              ...product,
              imageUrl:
                "https://via.placeholder.com/300x200?text=No+Image",
            };
          }
        })
      );

      setProducts(updatedProducts);
    };

    fetchImages();

    return () => {
      products.forEach((product) => {
        if (
          product.imageUrl &&
          product.imageUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(product.imageUrl);
        }
      });
    };
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category.toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    : products;

  if (isError) {
    return (
      <div
        className="text-center"
        style={{ padding: "8rem" }}
      >
        <img
          src={unplugged}
          alt="Error"
          style={{ width: "120px" }}
        />
        <h4 className="mt-3">
          Unable to connect to server.
        </h4>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "80px",
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(250px,1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {filteredProducts.length === 0 ? (
        <h2
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          No Products Available
        </h2>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            className="card"
            style={{
              width: "250px",
              height: "360px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              backgroundColor: product.productAvailable
                ? "#fff"
                : "#ddd",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />

              <div
                className="card-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "200px",
                }}
              >
                <div>
                  <h5>{product.name}</h5>

                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#555",
                    }}
                  >
                    {product.brand}
                  </p>
                </div>

                <div>
                  <h5>
                    ₹ {product.price}
                  </h5>

                  <button
                    className="btn btn-primary w-100"
                    disabled={!product.productAvailable}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    {product.productAvailable
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;