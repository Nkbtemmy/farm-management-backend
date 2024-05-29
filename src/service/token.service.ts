import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import Config from '../config/global.config';

const generateToken = (
  userId: number,
  expires: Moment = moment().add(Config.jwt.accessExpirationMinutes, 'minutes'),
  secret = Config.jwt.secret,
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const verifyToken = (token: string) => {
  const payload = jwt.verify(token, Config.jwt.secret);
  const userId = Number(payload.sub);
  return {
    userId,
  };
};

export default {
  generateToken,
  verifyToken,
};
