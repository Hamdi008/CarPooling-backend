require('dotenv').config();
var express = require('express');
var app = express();
app.use(express.json());

var jwt = require('jsonwebtoken');
require("./config/connect");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser');
const User = require('./models/user');
const { redisClient, connectRedis } = require('./config/redisClient');
const authenticate = require('./middleware/authMiddleware');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy home message to user
var message = {
    message: "Find or offer a ride easily!",
};

// Dummy users
var users = [
    { username: "test1", email: "test1@gmail.com", password: "test1" },
    { username: "test2", email: "test2@gmail.com", password: "test2" }
];

// Get home Page message
app.get('/', (req, res) => {
    console.log(`Home Page`);
    res.send(JSON.stringify(message));
});

// Get dummy users
app.get('/users', (req, res) => {
    console.log(`users`);
    res.json(users);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Step 1: Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Step 2: Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Step 3: Generate JWT if match
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// Middleware to verify JWT
/*function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting: "Bearer TOKEN"
    console.log(`authenticateToken token  = ${token}`)
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        
        console.log('decode user =', user);

        req.user = user; // Attach decoded user to request
        next();
    });
}
    */

app.get('/profile', authenticate, (req, res) => {
    console.log(`profile API `)

    console.log('decode req.user =', req.user);

    var profile = {
        username: req.user.username,
        email: req.user.email
    }

    res.json(profile);

});

//addUser API
app.post("/register", async(req,res)=>{
    try {

        console.log("Incoming request body:", req.body);

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send({ message: "Email already exists" });
    
        // Hash password with salt
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Save user
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
    
        res.status(200).send({ message: "User registered successfully", user: savedUser });

    } catch (error) {
        console.log(`Register error: ${error}`)
        res.status(500).send({ message: "Internal Server Error" });
    }
});


app.post('/logout', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Token missing' });

  try {
    await redisClient.set(token, 'blacklisted', { EX: 3600 }); // e.g., 1 hour
    res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    console.error('Redis set failed:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
});


// Connect to Redis before starting the server
connectRedis().then(() => {
// Configure server
var server = app.listen(9000, '0.0.0.0', () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Server running at http://${host}:${port}/`);
});
  }).catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
