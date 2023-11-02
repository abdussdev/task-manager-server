// Load dotenv variables
require("dotenv").config();

// Start our server
const app = require('./app');

app.listen(process.env.RUNNING_PORT, () => {
  console.log(`Server is listening on port ${process.env.RUNNING_PORT}`);
});
