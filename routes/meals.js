var express = require('express');
var router = express.Router();
const mealModel=require("../models/meals");
/* GET home page. */

let now = new Date();
let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
let lastSunday = new Date(today.setDate(today.getDate()-today.getDay()+1));
const perMeal=60;

router.get('/', async(req, res, next)=> {
    const allData=await mealModel.find({});
  res.json({ allData });
});



router.post("/add",async (req,res)=>{
    const{userId,mealCount}=req.body;

    const meal=new mealModel({
        mealId:Date.now(),
        userId,
        mealCount,
        price:(mealCount*perMeal),
    });

    let result=await meal.save();
    res.json({result,isAdded:true});
})



router.get('/weekly',async(req,res)=>{
    const pipeline=[
        {$match:{
            date:{$gte:lastSunday,$lte:today}
        }},
    {
        $group:{
            _id:{userId:"$userId"},
            
        }
    },
    {
        $lookup:{
            from:"users",
            localField:"userId",
            foreignField:"userId",
            as:"user"
        }
    }
    ];

    const weeklyData=await mealModel.aggregate(pipeline);
    res.json({weeklyData});
})

module.exports = router;
