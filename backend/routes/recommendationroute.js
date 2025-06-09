const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendationcontroller");

router.get("/", getRecommendations);

module.exports = router;