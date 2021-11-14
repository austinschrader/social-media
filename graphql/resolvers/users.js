const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { JWT_SECRET } = require("../../config");

function generateToken(user) {
  return jsonwebtoken.sign(
    {
      id: user.id,
      userName: user.userName,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { userName, password }) {
      const { errors, valid } = validateLoginInput(userName, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ userName });

      if (!user) {
        errors.userName = "User not found";
        throw new UserInputError("Invalid credentials", {
          errors,
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        errors.password = "Invalid credentials";
        throw new UserInputError("Invalid credentials", {
          errors,
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },

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

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result.id,
        token,
      };
    },
  },
};
