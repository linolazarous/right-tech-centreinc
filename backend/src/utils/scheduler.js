const { generateAndPostAd } = require("../controllers/adController");
const cron = require("node-cron");

const scheduleAds = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Generating and posting ads...");
    await generateAndPostAd();
  });
};

module.exports = { scheduleAds };