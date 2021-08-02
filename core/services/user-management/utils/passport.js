const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const passportLocal = require("passport-local");
const { userNotAuthenticatedError } = require("./errors");
const { sanitizeUser } = require("./user-helper");
const { createError } = require("./errors");
const { isCorrectPassword } = require("./user-helper");
const { db } = require("./mongoDbConnectors");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

const jwtSecret = "b9f813fb8753440eabb1b44f9ba4da2f";
const jwtKey = "cef1fe6937e444a6b18a26965d619718";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await db.usersCollection.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const validPassword = await isCorrectPassword(user, password);
        if (!validPassword) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  },
  (jwtPayload, cb) =>
    db.usersCollection
      .findOne({ email: jwtPayload.email })
      .then((user) => cb(null, user))
      .catch((err) => cb(err))
);
passport.use(jwtStrategy);

const login = (req, res, next) =>
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(
        createError({
          type: "Authentication",
          message: info.message,
          code: 401,
        })
      );
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        return next(error);
      }
      const token = jwt.sign(
        {
          ...user,
          iss: jwtKey,
        },
        jwtSecret
      );
      return res.status(200).json({ ...sanitizeUser(user), token });
    });
  })(req, res, next);

const verify = (req, res, next) =>
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(createError({ message: err.toString() }));
    if (!user) return next(userNotAuthenticatedError);
    res.status(200).send(sanitizeUser(user));
  })(req, res, next);

module.exports = {
  passport,
  login,
  verify,
  jwtSecret,
  jwtKey,
};
