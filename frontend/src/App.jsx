import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [restaurantId, setRestaurantId] = useState("");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
    fetchNotifications();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get(`${API}/restaurants`);
    setRestaurants(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${API}/orders`);
    setOrders(res.data);
  };

  const fetchNotifications = async () => {
    const res = await axios.get(`${API}/notifications`);
    setNotifications(res.data);
  };

  const register = async () => {
    await axios.post(`${API}/register`, {
      name,
      email,
      password
    });

    alert("Registered successfully");
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password
      });

      setUser(res.data.user);
      alert("Login successful");
    } catch {
      alert("Invalid login");
    }
  };

  const placeOrder = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    await axios.post(`${API}/orders`, {
      userId: user.id,
      restaurantId,
      items,
      totalAmount: amount
    });

    alert("Order placed successfully");
    fetchOrders();
    fetchNotifications();
  };

  const makePayment = async (orderId, totalAmount) => {
    await axios.post(`${API}/payment`, {
      orderId,
      amount: totalAmount,
      method: "UPI"
    });

    alert("Payment successful");
    fetchOrders();
  };

  return (
    <div className="container">
      <h1>Food Microservice App</h1>

      <div className="card">
        <h2>Register / Login</h2>

        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>

        {user && <h3>Logged in as {user.name}</h3>}
      </div>

      <div className="card">
        <h2>Restaurants</h2>

        {restaurants.map((r) => (
          <div className="box" key={r.id}>
            <h3>{r.name}</h3>
            <p>Location: {r.location}</p>

            <h4>Menu</h4>
            {r.menu.map((m) => (
              <p key={m.id}>
                {m.item_name} - ₹{m.price}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Place Order</h2>

        <select onChange={(e) => setRestaurantId(e.target.value)}>
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option value={r.id} key={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Items e.g. Pizza, Burger"
          onChange={(e) => setItems(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={placeOrder}>Place Order</button>
      </div>

      <div className="card">
        <h2>Orders</h2>

        {orders.map((o) => (
          <div className="box" key={o.id}>
            <p>Order ID: {o.id}</p>
            <p>User ID: {o.user_id}</p>
            <p>Restaurant ID: {o.restaurant_id}</p>
            <p>Items: {o.items}</p>
            <p>Total Amount: ₹{o.total_amount}</p>
            <p>Status: {o.status}</p>

            {o.status !== "Paid" && (
              <button onClick={() => makePayment(o.id, o.total_amount)}>
                Pay Now
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Notifications</h2>

        {notifications.map((n) => (
          <div className="box" key={n.id}>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;