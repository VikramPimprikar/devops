import { useEffect, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://13.50.153.9:5000/api";

const SAMPLE_RESTAURANTS = [
  { id: 1, name: "The Spice Route", location: "Bandra, Mumbai", menu: [{ id: 1, item_name: "Chicken Biryani", price: 280 }, { id: 2, item_name: "Paneer Tikka", price: 220 }, { id: 3, item_name: "Naan", price: 45 }] },
  { id: 2, name: "Pizza Palace", location: "Andheri, Mumbai", menu: [{ id: 4, item_name: "Margherita Pizza", price: 320 }, { id: 5, item_name: "Garlic Bread", price: 120 }, { id: 6, item_name: "Pasta", price: 260 }] },
  { id: 3, name: "Dragon Wok", location: "Juhu, Mumbai", menu: [{ id: 7, item_name: "Fried Rice", price: 180 }, { id: 8, item_name: "Manchurian", price: 160 }, { id: 9, item_name: "Spring Rolls", price: 130 }] },
];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function Toast({ message }) {
  return message ? <div className="toast show">{message}</div> : null;
}

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const login = async () => {
    if (!email || !password) {
      showToast("Please fill all fields");
      return;
    }

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!data?.user) throw new Error("Login failed");
      onLogin(data.user);
    } catch (e) {
      showToast(e.message || "Login failed");
    }
  };

  const register = async () => {
    if (!name || !email || !password) {
      showToast("Please fill all fields");
      return;
    }

    try {
      await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      showToast("Account created! Please sign in.");
      setTab("login");
    } catch (e) {
      showToast(e.message || "Registration failed");
    }
  };

  const demoLogin = () => onLogin({ id: 1, name: "Demo User", email: "demo@foodops.com" });

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="big-dot">🍽️</div>
          <h2>FoodOps</h2>
          <p>Food delivery, powered by microservices</p>
        </div>

        <div className="tabs">
          <button className={`tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign in</button>
          <button className={`tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Create account</button>
        </div>

        {tab === "login" ? (
          <div>
            <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="btn-primary" onClick={login}>Sign in</button>
            <div className="divider">or</div>
            <button className="btn-secondary" onClick={demoLogin}>⚡ Try demo account</button>
          </div>
        ) : (
          <div>
            <div className="field"><label>Full name</label><input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button className="btn-primary" onClick={register}>Create account</button>
          </div>
        )}
      </div>
      <Toast message={toast} />
    </div>
  );
}

function RestaurantCard({ r, selected, onSelect }) {
  return (
    <div className={`rest-card${selected ? " selected" : ""}`} onClick={() => onSelect(r.id)}>
      <div className="rest-header">
        <div className="rest-icon">🍴</div>
        <div>
          <div className="rest-name">{r.name}</div>
          <div className="rest-loc">📍 {r.location}</div>
        </div>
      </div>
      <div className="menu-list">
        {(r.menu || []).map(m => (
          <div className="menu-row" key={m.id}>
            <span>{m.item_name}</span>
            <span className="menu-price">₹{m.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ o, onPay }) {
  return (
    <div className="order-card">
      <div className="order-top">
        <div className="order-id">Order #{o.id}</div>
        <span className={`status-badge ${o.status === "Paid" ? "paid" : "pending"}`}>{o.status || "Pending"}</span>
      </div>
      <div className="order-detail">🏪 Restaurant #{o.restaurant_id}</div>
      <div className="order-detail">📋 {o.items}</div>
      <div className="order-amount">₹{o.total_amount}</div>
      {o.status !== "Paid" && (
        <button className="pay-btn" onClick={() => onPay(o.id, o.total_amount)}>💳 Pay now</button>
      )}
    </div>
  );
}

function MainPage({ user, onLogout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState("");
  const [orderItems, setOrderItems] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restData, orderData, notifyData] = await Promise.all([
          apiRequest("/restaurants"),
          apiRequest("/orders"),
          apiRequest("/notifications"),
        ]);
        setRestaurants(Array.isArray(restData) ? restData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
        setNotifications(Array.isArray(notifyData) ? notifyData : []);
      } catch (error) {
        setRestaurants(SAMPLE_RESTAURANTS);
        setOrders([]);
        setNotifications([]);
        showToast(error.message || "Could not load data");
      }
    };

    loadData();
  }, []);

  const placeOrder = async () => {
    if (!selectedRestId || !orderItems || !orderAmount) {
      showToast("Please fill all order details");
      return;
    }

    try {
      await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          restaurantId: selectedRestId,
          items: orderItems,
          totalAmount: orderAmount,
        }),
      });
      showToast("Order placed successfully!");
      setOrderItems("");
      setOrderAmount("");
      const [restData, orderData, notifyData] = await Promise.all([
        apiRequest("/restaurants"),
        apiRequest("/orders"),
        apiRequest("/notifications"),
      ]);
      setRestaurants(Array.isArray(restData) ? restData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setNotifications(Array.isArray(notifyData) ? notifyData : []);
    } catch (e) {
      showToast(e.message || "Could not place order");
    }
  };

  const makePayment = async (orderId, totalAmount) => {
    try {
      await apiRequest("/payment", {
        method: "POST",
        body: JSON.stringify({ orderId, amount: totalAmount, method: "UPI" }),
      });
      showToast("Payment successful!");
      const orderData = await apiRequest("/orders");
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (e) {
      showToast(e.message || "Payment failed");
    }
  };

  const handleSelectRest = (id) => setSelectedRestId(String(id));

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-dot">🍽️</div>
          FoodOps
        </div>
        <div className="nav-right">
          <span className="nav-pill">Microservices</span>
          <div className="user-name-nav">
            <span className="dot-sm"></span>
            {user.name}
          </div>
          <button className="nav-btn" onClick={onLogout}>Sign out</button>
        </div>
      </nav>

      <div className="main-page">
        <div className="stats-row">
          <div className="stat">
            <div className="stat-icon orange">🏪</div>
            <div><div className="stat-num">{restaurants.length}</div><div className="stat-label">Restaurants</div></div>
          </div>
          <div className="stat">
            <div className="stat-icon green">🛍️</div>
            <div><div className="stat-num">{orders.length}</div><div className="stat-label">Total orders</div></div>
          </div>
          <div className="stat">
            <div className="stat-icon blue">🔔</div>
            <div><div className="stat-num">{notifications.length}</div><div className="stat-label">Notifications</div></div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">🏪 Restaurants</div>
            <span className="badge-count">{restaurants.length}</span>
          </div>
          <div className="rest-grid">
            {restaurants.length === 0
              ? <div className="empty">Loading restaurants…</div>
              : restaurants.map(r => <RestaurantCard key={r.id} r={r} selected={selectedRestId === String(r.id)} onSelect={handleSelectRest} />)
            }
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">🛒 Place order</div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Restaurant</label>
              <select value={selectedRestId} onChange={e => setSelectedRestId(e.target.value)}>
                <option value="">Select restaurant</option>
                {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Total amount (₹)</label>
              <input type="number" placeholder="0" value={orderAmount} onChange={e => setOrderAmount(e.target.value)} />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: "14px" }}>
            <label>Items</label>
            <input type="text" placeholder="e.g. Pizza, Garlic bread" value={orderItems} onChange={e => setOrderItems(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={placeOrder}>✓ Place order</button>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">📦 Your orders</div>
            <span className="badge-count">{orders.length}</span>
          </div>
          <div className="order-grid">
            {orders.length === 0
              ? <div className="empty">No orders yet</div>
              : orders.map(o => <OrderCard key={o.id} o={o} onPay={makePayment} />)
            }
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">🔔 Notifications</div>
          </div>
          <div className="notif-list">
            {notifications.length === 0
              ? <div className="empty">No notifications</div>
              : notifications.map(n => (
                <div className="notif-item" key={n.id}>
                  <div className="notif-dot"></div>
                  <span>{n.message}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return user
    ? <MainPage user={user} onLogout={() => setUser(null)} />
    : <AuthPage onLogin={setUser} />;
}

export default App;