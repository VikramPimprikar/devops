import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    price: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/restaurants")
      .then(res => setRestaurants(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/restaurants", form);
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🍔 Food Delivery App</h1>

      <h2>Add Restaurant</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="cuisine" placeholder="Cuisine" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <button onClick={handleSubmit}>Add</button>

      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r, index) => (
          <li key={index}>
            {r.name} - {r.cuisine} - ₹{r.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;