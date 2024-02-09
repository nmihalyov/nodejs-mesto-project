import escape from 'escape-html';

type TEscapedData = Record<string, string>;

const escapeChars = (data: TEscapedData): TEscapedData => {
  const escapedData: TEscapedData = {};

  Object.entries(data).forEach(([key, value]) => {
    escapedData[key] = escape(value);
  });

  return escapedData;
};

export default escapeChars;
