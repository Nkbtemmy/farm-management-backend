import express from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import passport from 'passport';

import routes from './route/zroute';
import { errorConverter, errorHandler } from './middleware/error';
import ApiError from './utils/ApiError';
import { jwtStrategy } from './config/passport';
const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//  api routes
app.use(routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
