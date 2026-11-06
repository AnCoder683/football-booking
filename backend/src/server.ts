import { app } from './app.js';

const host = '127.0.0.1';
const port = 3000;

app.listen(port, host, () => {
  console.log(`Backend listening at http://${host}:${port}`);
});
