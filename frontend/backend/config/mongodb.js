import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connection Successfully Established To Database");
    } catch (err) {
        console.error(err, "Database Connection Failed", err.message);
        process.exit(1);
    }
}

export default connectDB;