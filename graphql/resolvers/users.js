const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput } = require("../../utils/validators");
const { JWT_SECRET } = require("../../config");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ userName });
      if (user) {
        throw new UserInputError("User already exists", {
          errors: {
            userName: "Username already exists",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        userName,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = jsonwebtoken.sign(
        {
          id: result.id,
          userName: result.userName,
          email: result.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        ...result._doc,
        id: result.id,
        token,
        tokenExpiration: 1,
      };
    },
  },
};
