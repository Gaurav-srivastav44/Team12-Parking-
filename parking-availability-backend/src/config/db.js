const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MONGO_URI is provided
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('Error: MONGO_URI is not defined in environment variables');
            console.error('Please create a .env file with MONGO_URI=mongodb://localhost:27017/parking-availability');
            console.error('Or set it as: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/parking-availability');
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoURI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error('Please check your MONGO_URI in the .env file');
        process.exit(1);
    }
};

module.exports = connectDB;
