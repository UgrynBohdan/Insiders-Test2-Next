import mongoose from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URI as string;
const MONGODB_URL = 'mongodb://localhost:27017'

if (!MONGODB_URL) {
    throw new Error("❌ Додай MONGODB_URI в .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
    try {
        if (cached.conn) return cached.conn;

        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URL).then((mongoose) => mongoose);
        }
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        throw err
    }
}
