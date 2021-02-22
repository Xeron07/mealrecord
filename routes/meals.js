var express = require("express");
var router = express.Router();
const mealModel = require("../models/meals");
/* GET home page. */

let now = new Date();
let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
let lastSunday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
const perMeal = 60;

router.get("/", async (req, res, next) => {
  const allData = await mealModel.find({});
  res.json({ allData });
});

router.post("/add", async (req, res) => {
  const { userId, mealCount } = req.body;
  let meal;
  meal= await mealModel.findOne({userId,date:{$gte:today}});
  
  console.log(meal);

  if(meal){
    meal.mealCount=mealCount;
    meal.price=mealCount * perMeal;
  }else{
   meal = new mealModel({
      mealId: Date.now(),
      userId,
      mealCount,
      price: mealCount * perMeal,
      date:new Date()
    });
  }

  let result = await meal.save();
  res.json({ result, isAdded: true });
});

router.get("/weekly", async (req, res) => {
  const pipeline = [
    {
      $match: {
        date: { $gte: lastSunday },
      },
    },
    {
      $group: {
        _id: { userId: "$userId" },
        totalMeal:{
            $sum:"$mealCount"
        },
        totalPrice:{
            $sum:"$price"
        }
      },
    },
    
    {
      $lookup: {
        from: "users",
        let:{uId:"$_id.userId"},
        pipeline:[{
            $match:{
                $expr:{$eq:["$userId","$$uId"]}
            }
        }],
        as: "user",
      },
    },
    
  ];

  const totalPipeline=[
      {
          $match:{
            date: { $gte: lastSunday },
          }
      },
      {
          $group:{
              _id:null,
              totalAmount:{$sum:"$price"},
              totalMealCount:{$sum:"$mealCount"}
          }
      }
  ]

  let weeklyData = await mealModel.aggregate(pipeline);
  let totalData=await mealModel.aggregate(totalPipeline);
  res.json( {weeklyData,sumOfWeek:totalData[0]} );
});

router.post("/daily",async(req,res)=>{
  const pipeline = [
    {
      $match: {
        date: { $gte: today },
      },
    },
    {
      $group: {
        _id: { userId: "$userId" },
        totalMeal:{
            $sum:"$mealCount"
        },
        totalPrice:{
            $sum:"$price"
        }
      },
    },
    
    {
      $lookup: {
        from: "users",
        let:{uId:"$_id.userId"},
        pipeline:[{
            $match:{
                $expr:{$eq:["$userId","$$uId"]}
            }
        }],
        as: "user",
      },
    },
    
  ];

  let weeklyData = await mealModel.aggregate(pipeline);
  res.json({weeklyData});

});

module.exports = router;
