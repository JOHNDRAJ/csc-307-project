import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
  

app.get("/users", (req, res) => {
const name = req.query.name;
const job = req.query.job
userServices.getUsers(name,job)
.then(users => {
  res.json({users_list: users})
})
.catch(error => {
  res.status(500).send("An error occurred while fetching users.");
});
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userServices.findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        res.json(user);
      }
    })
    .catch((error) => {
      res.status(500).send("Error occurred while fetching the user.");
    });
});
  
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  if (userToAdd && userToAdd.name && userToAdd.job) {
    userServices.addUser(userToAdd)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((error) => {
        res.status(400).send("Invalid user data or error saving to the database.");
      });
  } else {
    res.status(400).send("Invalid user data.");
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userServices.deleteUser(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send("User not found.");
      } else {
        res.status(200).json(deletedUser);
      }
    })
    .catch((error) => {
      res.status(500).send("Error occurred while deleting the user.");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});