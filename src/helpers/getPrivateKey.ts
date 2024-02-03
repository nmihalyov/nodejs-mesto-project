const getPrivateKey = (): string => {
  const { NODE_ENV, JWT_PRIVATE_KEY } = process.env;

  if (NODE_ENV === 'production' && JWT_PRIVATE_KEY) {
    return JWT_PRIVATE_KEY;
  }

  return 'dev-secret';
};

export default getPrivateKey;
