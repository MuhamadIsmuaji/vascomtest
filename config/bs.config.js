const dotenv = require("dotenv");
const path = require("path");
const bs = require("browser-sync");

dotenv.config({ path: path.join(__dirname, "../.env") });

bs.create().init({
  proxy: `http://127.0.0.1:${process.env.PORT}`,
  files: path.join(__dirname, "../public/**/*"),
  notify: false,
  open: false,
});
