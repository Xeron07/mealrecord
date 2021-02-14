var express = require('express');
var router = express.Router();
const userModel=require("../models/users");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/all",async(req,res)=>{
  const usersData= await userModel.find({});

  res.json({usersData,response:true});
});

router.post("/add", async(req,res)=>{
  const {uname,password}=req.body;
  let user=new userModel({
    u_id:Date.now(),
    uname,password
  });

  user= await user.save();

  res.json({user,response:true});
});

module.exports = router;
