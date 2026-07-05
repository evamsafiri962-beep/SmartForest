const router = require("express").Router();
const controller = require("../controllers/deviceController");

router.post("/", controller.registerDevice);
router.get("/", controller.getDevices);

module.exports = router;