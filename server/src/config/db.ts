import mangoose from "mongoose";


const connectDB = async (): Promise<void> => {
    try {
        const conn = await mangoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
