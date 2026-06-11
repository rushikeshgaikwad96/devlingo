"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontrollers_1 = require("../controllers/authcontrollers");
const router = (0, express_1.Router)();
router.post("/register", authcontrollers_1.register);
router.post("/login", authcontrollers_1.login);
exports.default = router;
