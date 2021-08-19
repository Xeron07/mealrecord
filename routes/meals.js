var express = require("express");
var router = express.Router();
const mealModel = require("../models/meals");
/* GET home page. */

let now = new Date();
let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
let lastSunday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
const perMeal = 65;

router.get("/", async (req, res, next) => {
  const allData = await mealModel.find({});
  res.json({ allData });
});


//ADD NEW MEAL RECORD 

router.post("/add", async (req, res) => {
  const { userId, mealCount } = req.body;
  let meal;
  let newTime = new Date();
  let currentTime = new Date(
    newTime.getFullYear(),
    newTime.getMonth(),
    newTime.getDate()
  ).getTime();
  meal = await mealModel.findOne({ userId, ds: { $gte: currentTime } });

  if (meal) {
    meal.mealCount = mealCount;
    meal.price = mealCount * perMeal;
  } else {
    meal = new mealModel({
      mealId: Date.now(),
      userId,
      mealCount,
      price: mealCount * perMeal,
      date: new Date(),
      ds: Date.now(),
    });
  }

  let result = await meal.save();
  res.json({ result, isAdded: true });
});


//GET WEEKLY MEAL RECORD

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
        totalMeal: {
          $sum: "$mealCount",
        },
        totalPrice: {
          $sum: "$price",
        },
      },
    },

    {
      $lookup: {
        from: "users",
        let: { uId: "$_id.userId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uId"] },
            },
          },
        ],
        as: "user",
      },
    },
  ];

  const totalPipeline = [
    {
      $match: {
        date: { $gte: lastSunday },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$price" },
        totalMealCount: { $sum: "$mealCount" },
      },
    },
  ];

  let weeklyData = await mealModel.aggregate(pipeline);
  let totalData = await mealModel.aggregate(totalPipeline);
  res.json({ weeklyData, sumOfWeek: totalData[0] });
});

router.post("/daily", async (req, res) => {
  let newTime = new Date();
  let currentTime = new Date(
    newTime.getFullYear(),
    newTime.getMonth(),
    newTime.getDate() 
  ).getTime();
  console.log(currentTime);
  console.log(Date.now());

  const pipeline = [
    {
      $match: {
        ds: { $gte: currentTime },
      },
    },
    {
      $group: {
        _id: { userId: "$userId" },
        totalMeal: {
          $sum: "$mealCount",
        },
        totalPrice: {
          $sum: "$price",
        },
      },
    },

    {
      $lookup: {
        from: "users",
        let: { uId: "$_id.userId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$uId"] },
            },
          },
        ],
        as: "user",
      },
    },
  ];

  let weeklyData = await mealModel.aggregate(pipeline);
  res.json(weeklyData);
});

router.delete("/remove/all",async(req,res)=>{
  let result=await mealModel.remove();
  res.json(result);
})

module.exports = router;
