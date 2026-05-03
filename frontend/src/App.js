import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RestaurantDetail from "./RestaurantDetail";
import "./App.css";

function HomePage({ filteredRestaurants, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, sortBy, setSortBy, categories, addToCart }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="restaurant-grid"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {filteredRestaurants.map((r, index) => (
        <motion.div
          key={index}
          className="restaurant-card"
          onClick={() => navigate(`/restaurant/${r._id?.toString() || r.id}`)}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src={r.image} alt={r.name} className="restaurant-image" />
          <div className="restaurant-info">
            <div className="restaurant-top-row">
              <div>
                <h3 className="restaurant-name">{r.name}</h3>
                <p className="restaurant-cuisine">{r.cuisine}</p>
              </div>
              <div className="restaurant-rating">⭐ {r.rating}</div>
            </div>

            <div className="restaurant-details">
              <span className="restaurant-price">Avg. ₹{r.price}</span>
              <span className="dish-count">{r.dishes?.length || 0} dishes</span>
            </div>

            <ul className="dish-list">
              {(r.dishes || []).slice(0, 3).map((dish, dishIndex) => (
                <li key={dishIndex} className="dish-item">
                  <div>
                    <strong>{dish.name}</strong>
                    <p>{dish.description}</p>
                  </div>
                  <div className="dish-actions">
                    <span>₹{dish.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish, r);
                      }}
                      className="dish-add"
                    >
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [address, setAddress] = useState("221B Baker Street, Mumbai");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("card");

  const categories = ["All", "Italian", "Chinese", "Indian", "Mexican", "Japanese"];

  useEffect(() => {
    axios.get("/restaurants")
      .then(res => {
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(r => r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, selectedCategory, sortBy]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (dish, restaurant) => {
    setCart([...cart, {
      name: dish.name,
      price: dish.price,
      cuisine: restaurant.cuisine,
      restaurant: restaurant.name
    }]);
    setCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const openCart = () => {
    setCartOpen(true);
    setPaymentOpen(false);
  };

  const closeCart = () => {
    setCartOpen(false);
    setPaymentOpen(false);
  };

  const proceedToPayment = () => {
    if (!cart.length) return;
    setPaymentOpen(true);
  };

  const handlePayment = () => {
    const items = cart.map(item => item.name);

    axios.post("/orders", { items, total, paymentType })
      .then(() => {
        alert("Payment successful! Your order is on the way.");
        setCart([]);
        closeCart();
      })
      .catch(err => {
        console.error(err);
        alert("Something went wrong while placing the order.");
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className={`app-container ${darkMode ? 'dark' : ''}`} style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🍽️</div>
        <div>Loading delicious options...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <header className="header">
          <div className="header-top">
            <div className="brand-block">
              <h1>🍽️ FlavorQuest</h1>
              <p className="tagline">Order from top-rated restaurants with fast checkout</p>
            </div>

            <div className="header-actions">
              <div className="cart-banner" onClick={openCart}>
                <span>🛒 {cart.length} items</span>
                <strong>₹{total}</strong>
                <span className="cart-action">View Cart</span>
              </div>
              <button onClick={toggleDarkMode} className="theme-toggle">
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>

          <div className="search-row">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          <div className="address-row">
            <label>Delivery address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
              placeholder="Enter your delivery address"
            />
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                filteredRestaurants={filteredRestaurants}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/restaurant/:id" element={<RestaurantDetail addToCart={addToCart} />} />
        </Routes>

        <div className={`full-screen-overlay ${cartOpen ? 'open' : ''}`}>
          <div className="cart-screen">
            <div className="cart-header">
              <button className="back-btn" onClick={closeCart}>←</button>
              <div>
                <h2>{paymentOpen ? 'Payment' : 'Your Cart'}</h2>
                <p>{cart.length} item{cart.length === 1 ? '' : 's'} • ₹{total}</p>
              </div>
            </div>

            {!cart.length && (
              <div className="empty-cart-message">
                <h3>Your cart is empty</h3>
                <p>Add delicious dishes from the list to checkout fast.</p>
              </div>
            )}

            {!!cart.length && (
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div className="cart-item" key={`${item.name}-${index}`}>
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.restaurant} • {item.cuisine}</p>
                      </div>
                      <div className="item-right">
                        <span>₹{item.price}</span>
                        <button onClick={() => removeFromCart(index)} className="remove-item">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                {!paymentOpen && (
                  <div className="cart-actions">
                    <button className="primary-btn" onClick={proceedToPayment}>
                      Proceed to payment • ₹{total}
                    </button>
                  </div>
                )}

                {paymentOpen && (
                  <div className="payment-section">
                    <div className="payment-title">
                      <h3>Select payment type</h3>
                      <p>Choose a secure option to complete your order.</p>
                    </div>
                    <div className="payment-options">
                      <button
                        className={`payment-card ${paymentType === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentType('card')}
                      >
                        Card
                      </button>
                      <button
                        className={`payment-card ${paymentType === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentType('upi')}
                      >
                        UPI
                      </button>
                      <button
                        className={`payment-card ${paymentType === 'wallet' ? 'active' : ''}`}
                        onClick={() => setPaymentType('wallet')}
                      >
                        Wallet
                      </button>
                    </div>
                    <button className="primary-btn pay-btn" onClick={handlePayment}>
                      Pay ₹{total} with {paymentType === 'card' ? 'Card' : paymentType === 'upi' ? 'UPI' : 'Wallet'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '40px', color: darkMode ? '#a0aec0' : '#666', fontSize: '0.9rem' }}>
          <p>Discover your next favorite meal with FlavorQuest! 🌟</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
