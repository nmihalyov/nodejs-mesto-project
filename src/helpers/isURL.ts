import { CelebrateError } from 'celebrate';

const isURL = (str: string): URL => {
  try {
    const url = new URL(str);

    return url;
  } catch (error) {
    throw new CelebrateError('Некорректный формат URL');
  }
};

export default isURL;
