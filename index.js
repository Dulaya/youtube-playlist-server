const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const deleteAccountRoute = require('./routes/deleteAccount');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to db!')
);

//Middleware
//app.use(express.json());

app.use(bodyParser.json({ limit: '5MB', extended: true }))
app.use(bodyParser.urlencoded({ limit: '5MB', extended: true }))

app.use(cors());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/deleteaccount', deleteAccountRoute);

app.listen(5000, () => console.log('Server is running'));

