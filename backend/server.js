import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Database Connection
connectDB();

// Cloudinary Connection
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Routes
app.get("/", (req, res) => {
    res.send("API IS WORKING . . .");
});

// App Listen
app.listen(port, () => {
    console.log(`API IS WORKING . . .`);
    console.log(`Server Started on localhost:${port}`)
});