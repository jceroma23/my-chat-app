const User = require("../model/userSchema");
const bcrypt = require("../utils/bcrypt");
const validation = require('../utils/userValidation');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
const Cookies = require('js-cookie');

// Login
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = validation.userValidation.validate(req.body);
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.comparePassword(password, user.password))) {
      res.status(400).json({ message: "Username and Password is incorrect" });
    } else {
      delete user.password;
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          isAvatarImageSet: user.isAvatarImageSet,
        },
        process.env.JWT_SECRET
      );
      console.log('Login Successful');
      res.status(200).json({ message: "Login successful",
        user: {userId: user._id, 
        username: user.username,
        isAvatarImageSet: user.isAvatarImageSet,
        avatarImage: user.avatarImage
      }, token: token});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register
module.exports.register = async (req, res, next) => {
    try {
    const { username, email, password } = req.body; 
    const { error } = validation.userValidation.validate(req.body); // Validate the request body using Joi

     // Check if a user with the same username already exists in the database
    const isExistingUsername = await validation.isExistingUsername(username);
    const isExistingUserEmail = await validation.isExistingUserEmail(email);
    if (isExistingUsername || isExistingUserEmail || error) {
      const errorMessage = error ? error.details[0].message : '';
      const message = isExistingUsername ? 'A user with this username already exists.' :
                      isExistingUserEmail ? 'A user with this email already exists.' :
                      errorMessage;
      return res.status(400).json({ message });
    }
    const hashedPassword = await bcrypt.securePassword(password);
    const user = await User.create({
        email,
        username,
        password: hashedPassword,
      })
      delete user.password;

    //This for the token that I will be setting to cookies
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        isAvatarImageSet: user.isAvatarImageSet,
      },
      process.env.JWT_SECRET
    );
    console.log(user.username, token);
    // res.cookie('authToken', token, { httpOnly: true, sameSite: 'strict' });
    
    res.status(200).json({ message: "Login successful",
        user: {userId: user._id, 
        username: user.username,
        isAvatarImageSet: user.isAvatarImageSet,
        avatarImage: user.avatarImage
      }, token: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
  };
//setAvatar
module.exports.setAvatar = async (req, res, next) => {
try {
  const avatarImage = req.body.image;
  const userId = req.body.userId;
  const userData = await User.findByIdAndUpdate(userId, {
    isAvatarImageSet: true,
    avatarImage,
  })
  const token = jwt.sign(
    {
      userId: userData._id,
      username: userData.username,
      isAvatarImageSet: userData.isAvatarImageSet,
    },
    process.env.JWT_SECRET
  );
  console.log(userData.isAvatarImageSet);
  res.status(200).json({ message: "Your avatar has been successfully updated.", token: token, isSet: userData.isAvatarImageSet, image: userData.avatarImage });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal server error" });
}
};

//getAllUsers
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    res.status(200).json({ message: "Done Getting All Users.", users});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

