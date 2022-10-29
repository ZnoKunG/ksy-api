const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const employeeRouter = require('./routes/employeeRouter');
const userRouter = require('./routes/userRouter');
require('dotenv').config()

var corsOptions = {
    origin: 'https://ksy-dashboard.herokuapp.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const cors = require('cors', corsOptions);
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded( { extended: false }))
app.use(employeeRouter)
app.use(userRouter)

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log('connected to the database'))

// const swaggerUI = require('swagger-ui-express')
// const swaggerFile = require('./swagger_output.json')
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})