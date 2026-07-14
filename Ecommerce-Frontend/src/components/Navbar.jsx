import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);

    if (value.trim() === "") {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    try {
      setShowSearchResults(true);

      const response = await axios.get(
        `/products/search?keyword=${value}`
      );

      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme =
      theme === "dark-theme"
        ? "light-theme"
        : "dark-theme";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">

            <a
              className="navbar-brand"
              href="https://www.linkedin.com/in/ishita-gujarathi-370186302/"
              target="_blank"
              rel="noreferrer"
            >
              HiTeckKart
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto">

                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/add_product"
                  >
                    Add Product
                  </Link>
                </li>

                <li className="nav-item dropdown">

                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            onSelectCategory(category)
                          }
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>

                </li>

              </ul>

              <button
                className="theme-btn me-3"
                onClick={toggleTheme}
              >
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              <div className="d-flex align-items-center">

                <Link
                  to="/cart"
                  className="nav-link me-3"
                >
                  <i className="bi bi-cart"></i> Cart
                </Link>

                <input
                  className="form-control"
                  type="search"
                  placeholder="Search..."
                  value={input}
                  onChange={(e) =>
                    handleChange(e.target.value)
                  }
                />

              </div>

            </div>
          </div>
        </nav>

        {showSearchResults && (
          <div
            className="list-group"
            style={{
              position: "absolute",
              right: "20px",
              top: "70px",
              width: "250px",
              zIndex: 1000,
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setShowSearchResults(false);
                    setInput("");
                  }}
                >
                  {product.name}
                </Link>
              ))
            ) : (
              noResults && (
                <div className="list-group-item">
                  No Product Found
                </div>
              )
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;