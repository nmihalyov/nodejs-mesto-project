import { constants } from 'http2';

class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

export default AuthError;
