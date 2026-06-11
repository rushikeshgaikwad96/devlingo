import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI as string;
    
    const connectWithRetry = async () => {
        try {
            const conn = await mongoose.connect(mongoUri);
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`MongoDB connection failed: ${error}`);
            console.log("Server will remain active. Retrying database connection in 5 seconds...");
            setTimeout(connectWithRetry, 5000);
        }
    };

    await connectWithRetry();
};

export default connectDB;
