const express = require("express"),
  bodyParser = require("body-parser");

const public_routes = require("./routes/general.js").general;
const auth_routes = require("./routes/authenticated.js").authenticated;

const app = express();

app.use(bodyParser.json());

// Routers
app.use("/", public_routes);
app.use("/auth", auth_routes);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
