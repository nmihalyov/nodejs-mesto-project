const getPrivateKey = (): string => {
  const { JWT_PRIVATE_KEY } = process.env;

  if (JWT_PRIVATE_KEY) {
    return JWT_PRIVATE_KEY;
  }

  return 'dev-secret';
};

export default getPrivateKey;
