const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");

require("dotenv").config();

const todoDB = mongoose.createConnection(process.env.TODO_DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});
todoDB.on("error", (err) => console.error(err));

const userDB = mongoose.createConnection(process.env.USER_DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});
userDB.on("error", (err) => console.error(err));

const todoSchema = require("../models/todo");
const Todo = todoDB.model("Todo", todoSchema);

const collectionSchema = require("../models/todo_collection");
const TodoCollection = todoDB.model("TodoCollection", collectionSchema);

const userSchema = require("../models/user");
const User = userDB.model("User", userSchema);

exports.todo_get_all = (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  User.findById(req.user._id)
    .select("todos")
    .populate("todos", {}, Todo)
    .exec((err, result) => {
      if(err) return res.sendStatus(500);

      const collection = {title: "All", todos: result.todos}
      
      res.status(200).json(collection);
    });
}

exports.todo_get_today = async (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  User.findById(req.user)
    .select("todos")
    .populate({
      path: "todos",
      model: Todo,
      match: {due_date: {$gte: start, $lte: end}}
    })
    .exec((err, result) => {
      if(err) return res.sendStatus(404);

      const collection = {title: "Today", todos: result.todos};

      res.status(200).json(collection);
    });
}

exports.todo_get_upcoming = async (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  User.findById(req.user)
    .select("todos")
    .populate({
      path: "todos",
      model: Todo,
      match: {due_date: {$gt: today}}
    })
    .exec((err, result) => {
      if(err) return res.sendStatus(404);

      const collection = {name: "Upcoming", todos: result.todos};

      res.status(200).json(collection);
    });
}

exports.todo_get_collection = async (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  TodoCollection.findById(req.params.collection)
    .populate({path: "todos", model: Todo})
    .exec((err, result) => {
      if(err) return res.sendStatus(404);

      res.status(200).json(result);
    });
}

exports.todo_post = (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    due_date: new Date(req.body.due_date)
  }); 

  (async () => {
    try {
      const newTodo = await todo.save();
      
      await User.findByIdAndUpdate(req.user._id, {$push: {"todos": [newTodo]}});

      if(req.query.collectionId) {
        await TodoCollection.findByIdAndUpdate(req.query.collectionId, {$push: {"todos": [newTodo]}});
      }

      res.status(200).json({todo: newTodo})
    }catch {
      res.sendStatus(500);
    }
  })();
}

exports.todo_put = (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  const todo = new Todo({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    due_date: new Date(req.body.due_date),
    complete: req.body.complete
  });

  Todo.findByIdAndUpdate(req.params.id, todo, {new: true}, (err, result) => {
    if(err) return res.sendStatus(500);

    res.status(200).json({todo: result});
  });
}

exports.todo_delete = async (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  const user = await User.findById(req.user._id).select("todos");

  const todos = user.todos.filter(td => td.toString() !== req.params.id);

  await User.findByIdAndUpdate(req.user._id, {todos}, {new: true});

  Todo.findByIdAndDelete(req.params.id, (err) => {
    if(err) return res.sendStatus(500);

    res.sendStatus(200);
  });
}

exports.collection_get_all = (req, res, next) => {
  if(!req.user) return res.sendStatus(401);

  User.findById(req.user._id)
    .select("todo_collections")
    .populate("todo_collections", {}, TodoCollection)
    .exec((err, collections) => {
      if(err) return res.sendStatus(500);

      res.status(200).json(collections);
    });
}

exports.collection_post = [
  (req, res, next) => {
    if(!req.user) { 
      res.sendStatus(401);
      return next();
    }

    next();
  },

  body("name").trim().isLength({min: 1, max: 100}).withMessage("Must contain 1-100 characters").escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) 
      return res.status(400).json({errors: errors.mapped()});


    const collection = new TodoCollection({name: req.body.name});

    (async () => {
      const newCollection = await collection.save();

      User.findByIdAndUpdate(req.user._id, {$push: {"todo_collections": [newCollection._id]}}, {new: true},
        (err) => {
          if(err) return res.sendStatus(500);

          res.status(201).json(newCollection);
      });
    })();
  }
] 