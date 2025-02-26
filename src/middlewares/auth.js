const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");
  const token = req.body.auth;
  const isAdminAuthorized = token === "abc123";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting checked");

  console.log(req.body.auth);
  const token = req.body.auth;

  const isUserAuthorized = token === "xyz123";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
