import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuSearch, setMenuSearch] = useState("");
  const [filteredDishes, setFilteredDishes] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/restaurants/${id}`);
        setRestaurant(res.data);
        setFilteredDishes(res.data.dishes || []);
      } catch (fetchError) {
        try {
          const listRes = await axios.get("/restaurants");
          const found = (listRes.data || []).find(r => r._id === id || r.id === id);
          if (found) {
            setRestaurant(found);
            setFilteredDishes(found.dishes || []);
          } else {
            setRestaurant(null);
            setFilteredDishes([]);
          }
        } catch {
          setRestaurant(null);
          setFilteredDishes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    if (!restaurant) return;
    const value = menuSearch.trim().toLowerCase();
    if (!value) {
      setFilteredDishes(restaurant.dishes || []);
      return;
    }
    setFilteredDishes(
      (restaurant.dishes || []).filter(dish =>
        dish.name.toLowerCase().includes(value) || dish.description.toLowerCase().includes(value)
      )
    );
  }, [menuSearch, restaurant]);

  if (loading) {
    return <div className="loading-state">Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div className="loading-state">Restaurant not found.</div>;
  }

  return (
    <section className="restaurant-detail-page">
      <div className="detail-hero">
        <div className="detail-hero-text">
          <button className="detail-back" onClick={() => navigate(-1)}>
            ← Back to restaurants
          </button>
          <h2>{restaurant.name}</h2>
          <p className="detail-meta">{restaurant.cuisine} • ⭐ {restaurant.rating}</p>
          <p className="detail-subtitle">Browse all dishes and add your favorites to the cart.</p>
        </div>
        <div className="detail-hero-side">
          <input
            className="menu-search-bar"
            placeholder="Search within menu"
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="restaurant-menu">
        {filteredDishes.length === 0 ? (
          <div className="menu-empty">No dishes match this search.</div>
        ) : (
          filteredDishes.map((dish, index) => (
            <div key={index} className="menu-card">
              <div className="menu-card-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
              </div>
              <div className="menu-card-action">
                <span className="menu-price">₹{dish.price}</span>
                <button className="dish-add" onClick={() => addToCart(dish, restaurant)}>
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RestaurantDetail;
