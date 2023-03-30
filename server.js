const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan') 
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


// Load env vars
dotenv.config({ path: './config/config.env'})

// Connect to Database
connectDB()

// Routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

const app = express()

//  Body Parser
app.use(express.json())

// CookieParser 
app.use(cookieParser())

//  Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File Uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Prevent crose side scripting atacks
app.use(xss())

// Set security Headers
app.use(helmet())

// Set rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Mins
    max: 100
})
app.use(limiter)

// Prevent http param polution
app.use(hpp())

// Enable cors
app.use(cors())

// Sewt static folder
app.use(express.static(path.join(__dirname, 'public')))

//  Mount Routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`error: ${ err.message}`.red)

    // Close server and exit process 
    server.close(() =>  process.exit(1))
})