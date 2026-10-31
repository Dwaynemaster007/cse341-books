import app from './app.js';

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT is not defined. Check that your npm scripts use --env-file=.env.');
}

app.listen(PORT, () => {
  console.log(`Server listening at 127.0.0.1:${PORT}`);
});