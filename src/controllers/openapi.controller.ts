import  {Request, Response, NextFunction} from 'express';
import {BadRequestError, UnauthorizedError} from "../middlewares";
import { openai } from '../utils/openai';

export const sendPrompt = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Starting....")
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0301",
            messages: [{ "role": "user", "content": "generate a social media/online marketing strategy for me with the following sections: \
            advertising, branding, brand awareness, promotion, content marketing, social media marketing, packaging, positioning, promotions, and sales. Type of business is a merchandising business. Goals are to increase sales and awareness by 20% in 6 months. Target audience is 18-35 year olds. The marketing strategy should contain well detailed and in depth sections of more than 100 words per section." }],
            temperature: 0.5,
            max_tokens: 1000,
            stream: true,
            // response_format: { type: "json_object"},
        });

        if (!response) {
            throw new BadRequestError("Something went wrong");
        }

        for await (const chunk of response) {
            if (chunk.choices.length > 0) {
                const content = chunk.choices[0].delta.content;
                if (content != undefined) {
                    res.write(`${content}`);
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