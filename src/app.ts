import express from 'express';
import path from 'path';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
