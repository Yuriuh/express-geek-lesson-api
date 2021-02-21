const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.LOC_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log(`MongoDB Connected: ${db.connection.host}`)
  } catch (error) {
    console.log(`Fail to connect MongoDB, because ${error}`)
  }
}

module.exports = connectDB
