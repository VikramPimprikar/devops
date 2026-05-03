const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const dishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  price: Number,
  rating: Number,
  image: String,
  dishes: [dishSchema]
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

const sampleData = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Bella Italia",
    cuisine: "Italian",
    price: 250,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    dishes: [
      { name: "Truffle Mushroom Risotto", price: 320, description: "Creamy risotto with wild mushrooms and truffle oil." },
      { name: "Margherita Pizza", price: 260, description: "Wood-fired crust, tomato, mozzarella and basil." },
      { name: "Pesto Linguine", price: 280, description: "Fresh basil pesto tossed with al dente linguine." },
      { name: "Prosciutto Panini", price: 240, description: "Grilled panini with prosciutto and melted provolone." },
      { name: "Caprese Salad", price: 180, description: "Tomato, mozzarella and basil with balsamic glaze." },
      { name: "Gnocchi al Pesto", price: 260, description: "Pillowy potato dumplings with basil pesto." },
      { name: "Seafood Linguine", price: 330, description: "Linguine with prawns, clams, and garlic." },
      { name: "Tiramisu", price: 150, description: "Classic coffee-soaked dessert with mascarpone." },
      { name: "Bruschetta Trio", price: 170, description: "Tomato, mushroom, and olive bruschetta." },
      { name: "Affogato", price: 130, description: "Vanilla gelato with espresso shot." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Spice Route",
    cuisine: "Indian",
    price: 180,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    dishes: [
      { name: "Butter Chicken", price: 210, description: "Rich tomato gravy with tender chicken pieces." },
      { name: "Paneer Tikka Masala", price: 190, description: "Grilled paneer cubes in spiced curry." },
      { name: "Garlic Naan", price: 65, description: "Soft flatbread brushed with garlic butter." },
      { name: "Keema Paratha", price: 145, description: "Stuffed flatbread with spiced minced meat." },
      { name: "Lamb Rogan Josh", price: 260, description: "Slow-cooked lamb in Kashmiri spices." },
      { name: "Dal Makhani", price: 160, description: "Creamy black lentils simmered with butter." },
      { name: "Veg Biryani", price: 190, description: "Aromatic basmati rice with vegetables and spices." },
      { name: "Samosa Chaat", price: 120, description: "Crispy samosas topped with chutneys and yogurt." },
      { name: "Mango Lassi", price: 110, description: "Fresh mango yogurt drink." },
      { name: "Ras Malai", price: 140, description: "Soft cheese balls in sweet cardamom milk." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Taco Fiesta",
    cuisine: "Mexican",
    price: 220,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    dishes: [
      { name: "Carnitas Tacos", price: 170, description: "Slow-cooked pork tacos with salsa verde." },
      { name: "Chipotle Burrito", price: 210, description: "Spiced rice, beans and your choice of protein." },
      { name: "Street Corn", price: 110, description: "Grilled corn with chili mayo and cotija cheese." },
      { name: "Chicken Quesadilla", price: 190, description: "Melted cheese and grilled chicken in a tortilla." },
      { name: "Shrimp Tostadas", price: 220, description: "Crispy tostada topped with zesty shrimp." },
      { name: "Churros", price: 120, description: "Cinnamon-sugar fried dough with chocolate." },
      { name: "Guacamole Bowl", price: 140, description: "Fresh avocado dip with chips." },
      { name: "Beef Enchiladas", price: 230, description: "Cheesy enchiladas with red chili sauce." },
      { name: "Nachos Grande", price: 210, description: "Loaded nachos with cheese, beans, and salsa." },
      { name: "Horchata", price: 95, description: "Sweet rice milk drink with cinnamon." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Sakura Sushi",
    cuisine: "Japanese",
    price: 300,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    dishes: [
      { name: "Salmon Nigiri", price: 260, description: "Fresh salmon with seasoned rice." },
      { name: "Dragon Roll", price: 320, description: "Shrimp tempura roll with avocado and eel sauce." },
      { name: "Miso Soup", price: 90, description: "Warm broth with tofu and seaweed." },
      { name: "California Roll", price: 240, description: "Crab, avocado, and cucumber roll." },
      { name: "Tempura Udon", price: 230, description: "Udon noodles with crispy tempura." },
      { name: "Seaweed Salad", price: 120, description: "Refreshing seaweed with sesame dressing." },
      { name: "Spicy Tuna Roll", price: 280, description: "Tuna with spicy mayo and crunch." },
      { name: "Eel Avocado Roll", price: 300, description: "Eel and avocado with sweet glaze." },
      { name: "Matcha Cheesecake", price: 160, description: "Green tea dessert with creamy texture." },
      { name: "Gyoza", price: 140, description: "Pan-fried dumplings with dipping sauce." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Pizza Paradise",
    cuisine: "Italian",
    price: 240,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    dishes: [
      { name: "Four Cheese Pizza", price: 270, description: "Mozzarella, gorgonzola, parmesan and ricotta." },
      { name: "Caprese Salad", price: 170, description: "Tomato, mozzarella and basil with balsamic drizzle." },
      { name: "Tiramisu", price: 150, description: "Classic coffee-soaked dessert." },
      { name: "Pepperoni Feast", price: 260, description: "Loaded with spicy pepperoni and cheese." },
      { name: "Garlic Knots", price: 90, description: "Soft knots brushed with garlic butter." },
      { name: "Veggie Supreme", price: 250, description: "Bell peppers, onions, mushrooms, and olives." },
      { name: "Pasta Alfredo", price: 230, description: "Creamy Alfredo sauce with fettuccine." },
      { name: "Chicken Parmigiana", price: 280, description: "Crispy chicken topped with cheese and marinara." },
      { name: "Bruschetta", price: 130, description: "Tomato basil mix on toasted bread." },
      { name: "Limoncello Sorbet", price: 120, description: "Zesty lemon sorbet to finish." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Noodle House",
    cuisine: "Chinese",
    price: 190,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    dishes: [
      { name: "Chow Mein", price: 175, description: "Stir-fried noodles with vegetables." },
      { name: "Kung Pao Chicken", price: 240, description: "Spicy chicken with peanuts and peppers." },
      { name: "Spring Rolls", price: 120, description: "Crispy rolls filled with veggies." },
      { name: "Sweet and Sour Pork", price: 230, description: "Tangy pork with bell peppers and pineapple." },
      { name: "Hot and Sour Soup", price: 110, description: "Spicy soup with tofu and bamboo shoots." },
      { name: "Beef Lo Mein", price: 220, description: "Soft noodles with sliced beef and greens." },
      { name: "Mapo Tofu", price: 180, description: "Spicy tofu in chili bean sauce." },
      { name: "Sesame Chicken", price: 210, description: "Crispy chicken with sesame glaze." },
      { name: "Egg Fried Rice", price: 140, description: "Fluffy rice with scrambled egg." },
      { name: "Crispy Duck", price: 340, description: "Roasted duck with sweet plum sauce." }
    ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Curry Corner",
    cuisine: "Indian",
    price: 170,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1604908177522-fbbdfe8a9ed6?w=400",
    dishes: [
      { name: "Paneer Butter Masala", price: 200, description: "Creamy tomato curry with cottage cheese." },
      { name: "Chicken Biryani", price: 240, description: "Saffron rice layered with tender chicken." },
      { name: "Masala Dosa", price: 150, description: "Crispy dosa filled with spiced potatoes." },
      { name: "Saag Paneer", price: 230, description: "Spinach curry with paneer cubes." },
      { name: "Lamb Vindaloo", price: 260, description: "Spicy lamb curry with vinegar heat." },
      { name: "Aloo Gobi", price: 150, description: "Potato and cauliflower cooked with spices." },
      { name: "Tandoori Chicken", price: 250, description: "Marinated chicken grilled in clay oven." },
      { name: "Raita", price: 80, description: "Cooling yogurt with cucumber and spices." },
      { name: "Naan Basket", price: 120, description: "Assorted naan breads for sharing." },
      { name: "Gulab Jamun", price: 130, description: "Sweet syrup-soaked dough balls." }
    ]
  }
];

const orderSchema = new mongoose.Schema({
  items: [String],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// Routes
app.get("/restaurants", async (req, res) => {
  let data = await Restaurant.find();
  data = data.filter(r => r.name !== "Dragon Wok");

  if (data.length === 0) {
    return res.json(sampleData);
  }

  res.json(data);
});

app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (restaurant && restaurant.name !== "Dragon Wok") {
      return res.json(restaurant);
    }
  } catch (err) {
    // ignore invalid ID errors and fall back to sample data
  }

  const sampleRestaurant = sampleData.find(r => r._id.toString() === id && r.name !== "Dragon Wok");
  if (sampleRestaurant) {
    return res.json(sampleRestaurant);
  }

  res.status(404).json({ error: "Restaurant not found" });
});

app.post("/restaurants", async (req, res) => {
  const newRestaurant = new Restaurant(req.body);
  await newRestaurant.save();
  res.json(newRestaurant);
});

app.post("/orders", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));