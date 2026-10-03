import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internmatch')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`)
    // If local MongoDB is not running, log error gracefully but don't exit process so app stays alive
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}
