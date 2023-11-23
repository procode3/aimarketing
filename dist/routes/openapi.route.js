"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const openapi_controller_1 = require("../controllers/openapi.controller");
router.post('/getStategy', openapi_controller_1.sendPrompt);
module.exports = router;
//# sourceMappingURL=openapi.route.js.map