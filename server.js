import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import methodOverride from "method-override";
import connectDB from "./config/db.js";
import { form_route, students_list_route, scholarship_route, transport_route, recycle_route } from "./routes/index.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "./utils/jwt.js";
import ExpressError from "./utils/ExpressError.js";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
const app = express();
const port = 3000;
dotenv.config();
connectDB();

//Using middleware for some certain work ---->
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// Middleware to set cache control headers, This is to prevent caching of the login.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});


// Convert the module URL to a file path ---->
const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// The route which gives the login page.
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// The data which we get from the login form.
app.post("/login", (req, res, next) => {
  let { username, password} = req.body;

  if ((username === "gerald") && (password === "a")) {
    let accessToken = generateToken({ username });
    let refreshToken = generateRefreshToken({ username })

    res.cookie('token', accessToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'Strict',
      // path: '/refresh-token', // only sent on this route
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });    

    return res.json({ message: 'Login successful' });
  } else {
    next(new ExpressError("Enter correct Username and password", 401));
  }
})

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.token;

  if (!refreshToken || !accessToken) return res.sendStatus(401);

  try {
    const decoded = jwt.decode(accessToken);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    // if (timeLeft > 120) {
    //   console.log(`Access token is still valid, Time left  ${timeleft} seconds`);
    //   return res.json({ message: 'Access token still valid', timeLeft });
    // }

    const user = verifyRefreshToken(refreshToken);
    const { exp, iat, ...safeUser } = user;
    const newAccessToken = generateToken(safeUser);

    res.cookie('token', newAccessToken, { httpOnly: true });
    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    console.error('Token refresh error:', err.message);
    res.sendStatus(403);
  }
});


// The logout route which clears the cookie.
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});


// Use the form route for handling routes starting with /form
app.use("/form", form_route);
// Use the studentsList route for handling routes starting with /studentlist
app.use("/studentslist", students_list_route);
// Use the scholarship route for handling routes starting with /scholarship
app.use("/scholarship", scholarship_route);
// Use the transport route for handling routes starting with /transport
app.use("/transport", transport_route);
// Use the recycle route for handling routes starting with /rcycle
app.use("/recycle", recycle_route);

// The middleware which send the 404 error if the page is not found.
app.all("*", (req, res) => {
  // res.send("Error 404, Page not found");
  res.render("error404.ejs")
})

// Our custom error handling middleware.
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong", stack} = err;
  console.log(err);
  res.status(statusCode).send(message);
});

// Starts the Server ---->
app.listen(port, () => {
  console.log(`The server started at port: ${port}`);
});
