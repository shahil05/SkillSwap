const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ---------------- MongoDB ---------------- */

mongoose.connect("mongodb+srv://SKILLSWAPUSER:skillswap123@skillswap.sy094ha.mongodb.net/skillswap")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* ---------------- Schemas ---------------- */

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  skillsOffered:[String],
  skillsWanted:[String]
});

const swapSchema = new mongoose.Schema({
  fromUser:String,
  toUser:String,
  status:{type:String,default:"pending"}
});

const ratingSchema = new mongoose.Schema({
  fromUser:String,
  toUser:String,
  rating:Number,
  review:String
});

const User = mongoose.model("User",userSchema);
const Swap = mongoose.model("Swap",swapSchema);
const Rating = mongoose.model("Rating",ratingSchema);

/* ---------------- ROUTES ---------------- */

app.get("/hello",(req,res)=>{
  res.send("server working");
});

/* register */

app.post("/register",async(req,res)=>{
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

/* get users */

app.get("/users",async(req,res)=>{
  const users = await User.find();
  res.json(users);
});

/* matching */

app.get("/matches/:id",async(req,res)=>{

  const user = await User.findById(req.params.id);

  const matches = await User.find({
    _id:{$ne:user._id},
    skillsOffered:{$in:user.skillsWanted},
    skillsWanted:{$in:user.skillsOffered}
  });

  res.json(matches);

});

/* swap request */

app.post("/swap-request",async(req,res)=>{

  const swap = new Swap(req.body);
  await swap.save();

  res.json(swap);

});

/* get requests */

app.get("/my-requests/:id",async(req,res)=>{

  const requests = await Swap.find({
    $or:[
      {fromUser:req.params.id},
      {toUser:req.params.id}
    ]
  });

  res.json(requests);

});

/* accept */

app.patch("/accept/:id",async(req,res)=>{

  const r = await Swap.findByIdAndUpdate(
    req.params.id,
    {status:"accepted"},
    {new:true}
  );

  res.json(r);

});

/* reject */

app.patch("/reject/:id",async(req,res)=>{

  const r = await Swap.findByIdAndUpdate(
    req.params.id,
    {status:"rejected"},
    {new:true}
  );

  res.json(r);

});

/* rating */

app.post("/rate",async(req,res)=>{

  const rating = new Rating(req.body);

  await rating.save();

  res.json(rating);

});

app.get("/ratings/:id",async(req,res)=>{

  const ratings = await Rating.find({toUser:req.params.id});

  res.json(ratings);

});

/* search */

app.get("/search",async(req,res)=>{

  const skill = req.query.skill;

  const users = await User.find({
    skillsOffered:skill
  });

  res.json(users);

});

/* ---------------- SERVER ---------------- */

app.listen(3000,()=>{
  console.log("Server running on port 3000");
});