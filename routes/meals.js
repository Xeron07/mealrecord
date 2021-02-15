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

  const meal = new mealModel({
    mealId: Date.now(),
    userId,
    mealCount,
    price: mealCount * perMeal,
    date:new Date()
  });

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

  const weeklyData = await mealModel.aggregate(pipeline);
  res.json( weeklyData );
});

module.exports = router;
