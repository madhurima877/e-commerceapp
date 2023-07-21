const express = require('express')
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const session = require('express-session')
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User")
const port = process.env.port || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/ecommdb")
.then(()=> console.log("db connected sucessfully".blue))
.catch((err)=> console.log(err));

const sessionConfig = {

  secret: 'weneedagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie : {

    expire : Date.now() + 7*24*60*60*1000
  }
}


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Routes
  const productRoutes = require("./routes/productRoutes");
  const reviewRoutes = require("./routes/reviewRoutes");
  const authRoutes = require("./routes/authRoutes")


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))


app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(flash());


app.use((req,res,next)=>{

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.newUser = req.user
  next();

})


// routes middleware
app.use("/products",productRoutes)
app.use(reviewRoutes)
app.use(authRoutes)

app.get("/", (req,res)=>{

  res.render("homePage")
})


app.listen(port, () => console.log(`Server listening at http://localhost:3000`.red))