import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/products");

        const backendIds = response.data.map((p) => p.id);

        const updatedItems = cart.filter((item) =>
          backendIds.includes(item.id)
        );

        const itemsWithImages = await Promise.all(
          updatedItems.map(async (item) => {
            try {
              const image = await axios.get(
                `/product/${item.id}/image`,
                {
                  responseType: "blob",
                }
              );

              return {
                ...item,
                imageUrl: URL.createObjectURL(image.data),
              };
            } catch (err) {
              return {
                ...item,
                imageUrl:
                  "https://via.placeholder.com/250?text=No+Image",
              };
            }
          })
        );

        setCartItems(itemsWithImages);
      } catch (err) {
        console.error(err);
      }
    };

    if (cart.length) fetchImages();
    else setCartItems([]);
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalPrice(total);
  }, [cartItems]);

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.quantity < item.stockQuantity
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    removeFromCart(id);

    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const checkout = async () => {
    try {
      for (const item of cartItems) {
        const updatedProduct = {
          ...item,
          stockQuantity:
            item.stockQuantity - item.quantity,
        };

        delete updatedProduct.imageUrl;
        delete updatedProduct.quantity;

        const formData = new FormData();

        formData.append(
          "product",
          new Blob(
            [JSON.stringify(updatedProduct)],
            {
              type: "application/json",
            }
          )
        );

        await axios.put(
          `/product/${item.id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      clearCart();

      setCartItems([]);

      setShowModal(false);

      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);

      alert("Checkout failed.");
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">

        <div className="title">
          Shopping Bag
        </div>

        {cartItems.length === 0 ? (
          <div
            style={{
              padding: "2rem",
            }}
          >
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="cart-item"
              >
                <div
                  className="item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="description">
                    <span>{item.brand}</span>

                    <span>{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                    <input
                      readOnly
                      value={item.quantity}
                    />

                    <button
                      className="minus-btn"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>
                  </div>

                  <div className="total-price">
                    ₹
                    {item.price *
                      item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      deleteItem(item.id)
                    }
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}

            <div className="total">
              Total : ₹{totalPrice}
            </div>

            <Button
              style={{ width: "100%" }}
              onClick={() =>
                setShowModal(true)
              }
            >
              Checkout
            </Button>
          </>
        )}

        <CheckoutPopup
          show={showModal}
          handleClose={() =>
            setShowModal(false)
          }
          cartItems={cartItems}
          totalPrice={totalPrice}
          handleCheckout={checkout}
        />
      </div>
    </div>
  );
};

export default Cart;