import express, { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { sendPrompt } from "../controllers/openapi.controller";


router.post('/getStategy', sendPrompt);

module.exports = router