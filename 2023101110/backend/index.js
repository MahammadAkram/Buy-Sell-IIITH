const mongoose = require("mongoose")
const cors = require("cors")
const express = require("express")
const bcrypt = require("bcrypt");
const EmployeeModel = require('./models/Employee.js');
const ItemsModel = require('./models/Items.js');
const OrdersModel = require('./models/Orders.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require("./models/authMiddleware.js");

const SECRET_KEY = "28140506";


const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://mahammadakramsamuluru:akram123@cluster0.npbcj.mongodb.net/assignment-1");




app.post('/api/Register', async (req, res) => {
    try {

        const { formData } = req.body;

        if (!formData.Email || !formData.Password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const FirstName = formData.FirstName;
        const LastName = formData.LastName;
        const Email = formData.Email;
        const Age = formData.Age;
        const ContactNumber = formData.ContactNumber;
        let Password = formData.Password;

        // console.log(Password);
        const newEmployee = new EmployeeModel({ FirstName, LastName, Email, Age, ContactNumber, Password });
        await newEmployee.save();

        return res.json({ newEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





app.post('/api/Login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        // console.log("hi1");
        if (!Email || !Password) {
            // console.log("hi2");
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const employee = await EmployeeModel.findOne({ Email });
        // console.log("hi3");

        if (!employee) {
            // console.log("hi4");

            return res.status(400).json({ message: 'Invalid Email or Password' });
        }
        // console.log("hi5");

        const isMatch = await bcrypt.compare(Password, employee.Password);
        console.log(Password);
        console.log(employee.Password);
        if (!isMatch) {
            // console.log("hi6");

            return res.status(400).json({ message: 'Invalid Email or Password' });
        }


        const token = jwt.sign(
            { userId: employee._id, email: employee.Email },
            SECRET_KEY,
            { expiresIn: "2h" }
        );



        return res.json({

            message: 'User Logged in successfully',
            token,
            user: {
                FirstName: employee.FirstName,
                LastName: employee.LastName,
                Email: employee.Email,
                Age: employee.Age,
                ContactNumber: employee.ContactNumber
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// populateItems();
app.post("/api/additems", async (req, res) => {
    try {
        const { Name, Price, Description, Category } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }

        const userId = decoded.userId; 
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }
        // console.log("")
        
        const newItem = new ItemsModel({
            Name,
            Price,
            Description,
            Category,
            SellerID: userId, 
        });

        await newItem.save();
        console.log("item added");
        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.post('/api/items', async (req, res) => {
    try {
        const newItem = new ItemsModel(req.body);
        console.log(req.body);
        // await newItem.save();
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});



app.get('/api/Items', async (req, res) => {
    try {
        const items = await ItemsModel.find({});
        // console.log(items)
        res.json({
            items,
            ids: items.map(item => item._id)

        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.get('/api/Items/:id', async (req, res) => {
    try {
        const item = await ItemsModel.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch item details" });
    }
});





app.get("/api/auth/user", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await EmployeeModel.findOne({ Email: email });
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log(user._id)
        console.log(user.Email)
        return res.json({ id: user._id, email: user.Email });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});




app.get('/api/cart/:userEmail', async (req, res) => {
    try {
        const userId = req.params.userEmail; 


        
        const user = await EmployeeModel.findOne({ Email: userId }).populate('Cart');

        if (!user) return res.status(404).json({ message: "User not found" });

       
        res.status(200).json(user.Cart);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: "Error fetching cart items", error });
    }
});


app.post('/api/cart/add', async (req, res) => {
    try {
        // console.log("hi")
        const { itemId } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });


        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const user = await EmployeeModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.Cart.push(itemId);
        await user.save();

        res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Error adding item to cart", error });
    }
});


app.delete('/api/cart/remove/:itemId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;
        const { itemId } = req.params;

        const user = await EmployeeModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

       
        user.Cart = user.Cart.filter(id => id.toString() !== itemId);
        await user.save();

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Error removing item from cart", error });
    }
});
app.post('/api/cart/remove', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;
        const { itemId } = req.body;

        console.log("Removing item with ID:", itemId); 

        const user = await EmployeeModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

       
        const initialCartSize = user.Cart.length;
        user.Cart = user.Cart.filter((id) => (id.toString() !== itemId));

        if (user.Cart.length === initialCartSize) {
            return res.status(400).json({ message: "Item not found in cart" });
        }

        await user.save();
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Error removing item from cart", error });
    }
});



app.put('/api/UpdateUser', async (req, res) => {
    try {
        const { formData } = req.body;

        if (!formData.Email) {
            return res.status(400).json({ message: 'Email is required to identify the user' });
        }


        const updatedUser = await EmployeeModel.findOneAndUpdate(
            { Email: formData.Email },
            {
                FirstName: formData.FirstName,
                LastName: formData.LastName,
                Age: formData.Age,
                ContactNumber: formData.ContactNumber,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user details' });
    }
});




app.get('/api/:email', async (req, res) => {
    try {
        const employee = await EmployeeModel.findOne({ Email: req.params.email });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ _id: employee._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/otp', async (req, res) => {
    const cart = req.body.cartItems;
    // console.log(cart);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
        const buyer_id = decoded.userId;
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
        const hashed_otp = await bcrypt.hash(otp, 10);
        // console.log(otp);
        for (item of cart) {
            // console.log("a");
            const result = await OrdersModel.create({ ItemID: item._id, BuyerID: buyer_id, SellerID: item.SellerID, Amount: item.Price, HashedOTP: hashed_otp, Status: "Pending" });
        }
        res.json({ otp: otp });
    }
});


app.get('/api/orders/pending-orders', async (req, res) => {

    try {
        // console.log("hi")
        // console.log("Fetching pending items.");
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token)
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const ID = decoded.userId;
        console.log(ID)
        const pendingOrders = await OrdersModel.find({ BuyerID: ID });
        console.log(pendingOrders); 

        res.json({ pendingOrders: pendingOrders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/orders/pendingitems', async (req, res) => {
    console.log("hi")
    try {
        console.log("Fetching pending items.");
        const token = req.headers.authorization?.split(" ")[1];
        // console.log(token)
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const ID = decoded.userId;
        const results = await OrdersModel.find({ SellerID: ID });
        // console.log(results);
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No pending items found" });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get('/api/orders/bought-items', async (req, res) => {
    const { userId } = req.query;

    try {
        const boughtItems = await Order.find({ buyer: userId, status: 'completed' });
        res.json(boughtItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/orders/sold-items', async (req, res) => {
    const { userId } = req.query;

    try {
        const soldItems = await Order.find({ seller: userId, status: 'completed' });
        res.json(soldItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

app.listen(3001, () => {
    console.log("server is running");
})

