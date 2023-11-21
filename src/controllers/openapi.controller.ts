import  {Request, Response, NextFunction} from 'express';
import {BadRequestError, UnauthorizedError} from "../middlewares";
import { openai } from '../utils/openai';

export const sendPrompt = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Starting....")
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": "generate a marketing strategy for me. Type of business is a merchandising business. Goals are to increase sales and awareness by 20% in 6 months. Target audience is 18-35 year olds. Your response should be in sections" }],
            temperature: 0,
            max_tokens: 1000,
            stream: true,
        });

        if (!response) {
            throw new BadRequestError("Something went wrong");
        }

        for await (const chunk of response) {
            if (chunk.choices.length > 0) {
                const content = chunk.choices[0].delta.content;
                if (content != undefined) {
                    res.write(`data: ${content}\n\n`);
                } else {
                    res.write(`data: break\n\n`);
                    res.end();
                }
            }
        }

        // res.send(response);
    } catch (error) {
        next(error)
}
    
}

module.exports  = {sendPrompt}