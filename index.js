const express = require("express");
const cross = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 7000;

var app = express();
app.use(cross({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("o vai maro mujhe maro"));

const socketManneger = require("./soutBox");
const {
  login,
  checkUser,
  checkCustomUser,
  createCookies,
  signUp,
  customLogin,
  activate,
} = require("./auth");
const { feedback } = require("./inq");

// ||||||||||||||||||||inquiry|||||||||||||||||||||
app.post("/feedback", feedback);

// ||||||||||||||||||||auth||||||||||||||||||||||||
app.post("/signUp", signUp, createCookies);
app.post("/login", login, createCookies);
app.post("/activate", checkUser, activate);
app.post("/customLogin", checkCustomUser, customLogin, createCookies);

app.post("/checkUser", checkUser, (req, res) => {
  return res.json({ success: true });
});
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true });
});
app.get("/", (req, res) => {
  return res.json({ message: "This is a server # Don't mesh it up" });
});
//////////////////////////////////////////////////////
const {
  joinProject,
  userList,
  userEvents,
  userProfile,
  projectSubmit,
  projectGet,
  addEvent,
  getUserByUID,
  getProjectByUID,
  getEventByUID,
} = require("./user");

app.get("/:id/user", getUserByUID);
app.get("/:id/events", getEventByUID);
app.get("/:id/projects", getProjectByUID);

app.post("/:id/project/join", checkUser, joinProject);

app.post("/projectsubmit", checkUser, projectSubmit);
app.get("/projectget", checkUser, projectGet);
app.post("/addevent", checkUser, addEvent);
app.get("/userlist", checkUser, userList);
app.get("/events", checkUser, userEvents);
app.get("/whoiam", checkUser, userProfile);

const {
  AllProject,
  AllEvent,
  getProjectByID,
  getEventByID,
  TopProject,
  faq,
  SubmitFaq,
} = require("./extra");

app.get("/:id/idprojects", getProjectByID);
app.get("/:id/idevents", getEventByID);

app.get("/alleventsget", AllEvent);
app.get("/allprojectget", AllProject);
app.get("/alltopprojectget", TopProject);

app.get("/faq", faq);
app.post("/submitfaq", SubmitFaq);

const server = http.createServer(app);
const io = (module.exports.io = require("socket.io")(server));
io.of("/shoutBox").on("connection", socketManneger);

server.listen(PORT);

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});