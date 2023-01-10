const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "cettecléestvraimenttrèssécurisé";

module.exports = function (req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.sendStatus(401);

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") return res.sendStatus(401);

  const user = jwt.verify(token, SECRET);
  req.user = user;
  next();
};


///checkRequestFormat.js///

const BadRequestError = require("../errors/BadRequestError");

module.exports = function checkRequestFormat(req, res, next) {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.headers["content-type"]?.startsWith("application/json")) {
      throw new BadRequestError();
    }
  }
  next();
};

///checkRole.js///

const ForbiddenError = require("../errors/ForbiddenError");

const ROLES = {
  USER: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

function checkRole({ minRole }) {
  return function checkRoleMiddleware(req, res, next) {
    const userRole = req.user.role;
    console.log(userRole, minRole);
    if (ROLES[userRole] >= minRole) {
      next();
    } else {
      throw new ForbiddenError();
    }
  };
}

checkRole.ROLES = ROLES;

module.exports = checkRole;

///errorHandler.js///

const { ValidationError } = require("sequelize");
const HttpError = require("../errors/HttpError");

module.exports = function errorHandler(error, req, res, next) {
  if (error instanceof ValidationError) {
    res.status(422).json(
      error.errors.reduce((acc, item) => {
        acc[item.path] = [...(acc[item.path] || []), item.message];
        return acc;
      }, {})
    );
  } else if (error instanceof HttpError) {
    res.sendStatus(error.code);
  } else {
    res.sendStatus(500);
  }
  console.error(error);
};
