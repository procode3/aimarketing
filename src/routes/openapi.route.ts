import express, { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { sendPrompt } from "../controllers/openapi.controller";


router.get('/test', sendPrompt);

module.exports = router