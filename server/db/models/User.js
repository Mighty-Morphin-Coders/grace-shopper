const Sequelize = require('sequelize');
const { db } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// require('dotenv').config();

//define your model

const User = db.define('user', {
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true,
        },
    },
    role: {
        type: Sequelize.ENUM(['AUTHENTICATED', 'GUEST']),
        allowNull: false,
        defaultValue: 'GUEST',
        validate: {
            notEmpty: true,
        },
    },
    first: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    last: {
        type: Sequelize.STRING,
    },
    fullName: {
        type: Sequelize.VIRTUAL,
        defaultValue: 'guest',
        get() {
            if (this.last) {
                return `${this.first} ${this.last}`;
            } else {
                return `${this.first}`;
            }
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'guest_pw',
        validate: {
            notEmpty: true,
        },
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: 'guestEmail@gmail.com',
        validate: {
            notEmpty: true,
            isEmail: true,
        },
    },
});

User.authenticate = async function ({ email, password }) {
    const user = await User.findOne({
        where: {
            email,
        },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET
        );
        return token;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
};

User.byToken = async function (token) {
    try {
        const { id } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(id);
        if (user) return user;
        const error = Error('bad credentials');
        error.status = 401;
        throw error;
    } catch (ex) {
        const error = Error('bad credentials');
        error.status = 401;
        throw error;
    }
};

User.addHook('beforeCreate', async (user) => {
    //if (user.changed('password')) { ////Arjan comment: i commented this out to check logging in with admin users, uncomment this when we deploy to PROD*******
    user.password = await bcrypt.hash(user.password, 5);
    //}
});

User.addHook('beforeUpdate', async (user) => {
    //if (user.changed('password')) { ////Arjan comment: i commented this out to check logging in with admin users, uncomment this when we deploy to PROD*******
    user.password = await bcrypt.hash(user.password, 5);
    //}
});

//define any class or instance methods

//export your model

module.exports = User;
