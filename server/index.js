//add unique true on user model????
const User = require('./db/models/User');
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const { init } = require('./db/index');
init();
//require("dotenv").config(); // I DONT THINK WE NEED THIS IN MULTIPLE PLACES TBH. JUST HAVING IT IN USER FOR SOME REASON IS GOOD ENOUGH? DOUBLE CHECK
const port = process.env.PORT || 9000;
const axios = require('axios');
const jwt = require('jsonwebtoken');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/github/callback', async (req, res, next) => {
    try {
        let response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                code: req.query.code,
                client_id: process.env.client_id,
                client_secret: process.env.client_secret,
            },
            {
                headers: {
                    accept: 'application/json',
                },
            }
        );
        const data = response.data;
        if (data.error) {
            const error = Error(data.error);
            error.status = 401;
            throw error;
        }
        //third step in the docs, this step requires you to send the authorization token you received as the header, you get back access_token
        //this is a get request so there is no body?
        //this needs to come in the format Authorization: token OAUTH-TOKEN"
        //should now get information about myself
        response = await axios.get('https://api.github.com/user', {
            headers: {
                authorization: `token ${data.access_token}`,
            },
        });

        //NOTE: we may not be able to use email in case someone has a null email on github
        const { email, login } = response.data;

        let user = await User.findOne({
            where: {
                email: email,
            },
        });
        //i am using these are hard coded tests for now below
        const first = login;
        const password = 'guest_pw';
        const role = 'AUTHENTICATED';
        const isAdmin = false;
        //if user doesn't exist yet
        if (!user) {
            user = await User.create({ isAdmin, first, role, password, email });
        }

        const jwtToken = await jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.send(`<html>
      <head>
      <script>
      window.localStorage.setItem('guest', 'false');
      window.localStorage.setItem('token', '${jwtToken}');
      window.document.location = '/#/login';
      </script>
      </head>
    </html>`);
    } catch (ex) {
        next(ex);
    }
});

//some middleware
//we are getting jwt from github?
app.use((err, req, res, next) => {
    res.status(err.status).send({ error: err.message });
});

app.use('/api/products/', require('./api/routes/productRoute'));
app.use('/api/users/', require('./api/routes/userRoute'));
app.use('/api/orders/', require('./api/routes/orderRoute'));
app.use('/api/reviews/', require('./api/routes/reviewRoute'));
app.use('/api/categories', require('./api/routes/categoryRoute'));
app.use('/api/auth', require('./api/routes/authRoute'));
app.use('/api/order_products/', require('./api/routes/orderProductRoute'));

//500 handler
app.use((error, req, res, next) => {
    res.status(500).send(error);
});

app.listen(port, () => console.log(`listening on port: ${port}`));
