const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect Database
connectDB();

//Init Middleware
app.use(express.json( {extended: false}))
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
const userRouter = require('./routes/api/users');
const profileRouter = require('./routes/api/profile');
const postsRouter = require('./routes/api/posts');
const authRouter = require('./routes/api/auth');

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));