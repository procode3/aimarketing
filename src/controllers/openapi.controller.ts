import  {Request, Response, NextFunction} from 'express';
import {BadRequestError, UnauthorizedError} from "../middlewares";
import { openai } from '../utils/openai';

export const sendPrompt = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Starting....")
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [{ "role": "user", "content": await parsePrompt(req) }],
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

export const parsePrompt = async(req: Request) => { 
    try {
        const {businessName, industry, age, gender, product, goals} = req.body;

        const prompt = `Generate a social media/online marketing campaign for the below business in JSON format with the following keys:
        - Business name
        - Industry
        - Tagline
        - Sections
        
        The "Sections" key should contain an array of objects, each representing an advertising strategy section with the following structure:
        {
           "id": 1, 
          "sectionTitle": "Advertising",
          "description": "Well-detailed and in-depth description of advertising strategies with more than 150 words, 2 sentences    "
        },
        {
          "id": 2, 
          "sectionTitle": "Branding",
          "description": "Well-detailed and in-depth description of branding strategies with more than 100 words"
        },
        {
          "id": 3, 
          "sectionTitle": "Brand Awareness",
          "description": "Well-detailed and in-depth description of brand awareness strategies with more than 100 words"
        },
        {
          "id": 4, 
          "sectionTitle": "Promotion",
          "description": "Well-detailed and in-depth description of promotion strategies with more than 100 words"
        },
        {
           "id": 5, 
          "sectionTitle": "Content Marketing",
          "description": "Well-detailed and in-depth description of content marketing strategies with more than 100 words"
        },
        {
          "id": 6,
          "sectionTitle": "Social Media Marketing",
          "description": "Well-detailed and in-depth description of social media marketing strategies with more than 100 words"
        },
        {
          "id": 7,
          "sectionTitle": "Packaging",
          "description": "Well-detailed and in-depth description of packaging strategies with more than 100 words"
        },
        {
          "id": 8,
          "sectionTitle": "Positioning",
          "description": "Well-detailed and in-depth description of positioning strategies with more than 100 words"
        },
        {
          "id": 9,
          "sectionTitle": "Promotions",
          "description": "Well-detailed and in-depth description of promotions strategies with more than 100 words"
        },
        {
          "id": 10,
          "sectionTitle": "Sales",
          "description": "Well-detailed and in-depth description of sales strategies with more than 100 words"
        } 
        use the simple future tense to describe the strategies.
         The Busines name is  ${businessName}, product is ${product}, Type of business is a ${industry} business. Goals are to ${goals}. Target audience is ${age} year olds. Verbose`;

         return prompt;
    } catch (error) {
        console.log(error);
    }
}

export const parseResponse = async(req: Request, res: Response, next: NextFunction) => {

}

module.exports  = {sendPrompt}