import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import usersRepository from "../repositories/users.repository.js";
import sessionsService from "../services/sessions.service.js";
import env from "./env.config.js";

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.currentUser;
  }

  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const user = await sessionsService.register({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            password
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email"
      },
      async (email, password, done) => {
        try {
          const user = await sessionsService.login(
            email,
            password
          );

          if (!user) {
            return done(null, false, {
              message: "Credenciales inválidas"
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor
        ]),
        secretOrKey: env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await usersRepository.getById(
            payload.id
          );

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
