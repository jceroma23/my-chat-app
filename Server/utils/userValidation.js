const Joi = require("joi");
const User = require('../model/userSchema');

const userValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    email: Joi.string().email().trim(true).required(),
    password: Joi.string().min(6).trim(true).required(),
});

const loginValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    password: Joi.string().min(8).trim(true).required()
});

const isExistingUsername = async (inputuserName) => {
    const username = await User.findOne({username: inputuserName}); 
    if(username) {
        error = `${username} is already exist!`;
        return error;
    }
}

const isExistingUserEmail = async (inputuserEmail) => {
    const email = await User.findOne({email: inputuserEmail}); 
    if(email) {
        error = `${email} is already exist!`;
        return error;
    }
}

module.exports = {
    userValidation,
    loginValidation,
    isExistingUsername,
    isExistingUserEmail
}