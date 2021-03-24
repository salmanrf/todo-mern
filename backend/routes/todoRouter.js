const express = require('express');
const router = express.Router();

require("dotenv").config();

const {verifyToken} = require("../controllers/token_controller");
const todo_controller = require("../controllers/todo_controller");

router.use(async (req, res, next) => {
  if(!req.headers.authorization) 
    return res.status(401).end();

  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  
  if(!token) 
    return res.sendStatus(401);
  
  try {
    const {user} = await verifyToken(token);
    req.user = user;
    next();
  }catch {
      return res.sendStatus(401);
  } 
});

router.get("/", todo_controller.todo_get_all);
router.post("/", todo_controller.todo_post);
router.put("/:id", todo_controller.todo_put);
router.delete("/:id", todo_controller.todo_delete);

router.get("/today", todo_controller.todo_get_today);
router.get("/upcoming", todo_controller.todo_get_upcoming);

router.get("/collection", todo_controller.collection_get_all);
router.post("/collection", todo_controller.collection_post);

router.get("/:collection", todo_controller.todo_get_collection);

module.exports = router;
