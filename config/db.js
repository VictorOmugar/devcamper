const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const connectDB =  async  () => {
   const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
   })
   console.log(`mongoDB Connect: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB


