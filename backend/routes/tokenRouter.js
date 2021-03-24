const express = require("express");
const router = express.Router();

const token_con = require("../controllers/token_controller");

router.get("/", token_con.get_refresh);

module.exports = router;