var express = require('express');
var router = express.Router();
const userModel=require("../models/users");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/all",async(req,res)=>{
  const usersData= await userModel.find({});

  res.json(usersData);
});

router.post("/signup", async(req,res)=>{
  const {uname,password,email}=req.body;
  let user=new userModel({
    userId:Date.now(),
    uname,password,email
  });

  user= await user.save();

  res.json({user,response:true});
});

router.post("/login",async(req,res)=>{
  const {email,pass}=req.body;

  const user=await userModel.findOne({email,password:pass});
  if(user){
    res.json({user,validate:true});
  }else{
    res.json({user,validate:false,msg:"Wrong email or password"});
  }
})

module.exports = router;
