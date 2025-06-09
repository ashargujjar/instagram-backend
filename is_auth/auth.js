const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "this_is_my_first_aap_Inshallah");
  } catch (err) {
    err.statuscode = 500;
    throw err;
  }
  if (!decodedToken) {
    const err = new Error("not Authenticate");
    err.statuscode = 401;
    throw err;
  }
  req.user = decodedToken.user;
  next();
};
