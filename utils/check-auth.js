const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = "../config";

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        context.req.user = decoded;
        return true;
      } catch (err) {
        throw new AuthenticationError("Your session expired. Sign in again.");
      }
    }

    throw new Error("Authentication token must be provided");
  }
  throw new Error("Authentication header  must be provided");
};
