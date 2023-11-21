import  {Request, Response, NextFunction} from 'express';
import {BadRequestError, UnauthorizedError} from "../middlewares";
import { openai } from '../utils/openai';

export const sendPrompt = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Starting....")
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": "Explain a marketing strategy eminem style!"}],
            temperature: 0,
            max_tokens: 256,
            });

        if (!response) {
            throw new BadRequestError("Something went wrong");
        }
        res.send(response);
    } catch (error) {
        next(error)
}
    
}

module.exports  = {sendPrompt}