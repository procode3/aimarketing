import  {Request, Response, NextFunction} from 'express';
import {BadRequestError, UnauthorizedError} from "../middlewares";
import { openai } from '../utils/openai';

export const sendPrompt = async(req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log("Starting....")
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo-1106",
//             messages: [{ "role": "user", "content": "generate a marketing strategy for me. Type of business is a merchandising business. Goals are to increase sales and awareness by 20% in 6 months. Target audience is 18-35 year olds. The marketing strategy should contain various sections of at least 100 words. The whole response is in JSON" }],
//             temperature: 0,
//             max_tokens: 1024,
//             stream: true,
//             response_format: { type: "json_object" },
//         });

//         if (!response) {
//             throw new BadRequestError("Something went wrong");
//         }

//         for await (const chunk of response) {
//             if (chunk.choices.length > 0) {
//                 const content = chunk.choices[0].delta.content;
//                 if (content != undefined) {
//                     res.write(`${content}`);
//                 } else {
//                     res.write(`data: break\n\n`);
//                     res.end();
//                 }
//             }
//         }

//         const response2 = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo-1106",
//             messages: [{ "role": "user", "content": "generate a marketing strategy for me. Type of business is a merchandising business. Goals are to increase sales and awareness by 20% in 6 months. Target audience is 18-35 year olds. The marketing strategy should contain various sections of at least 100 words. The whole response is in JSON" }],
//             temperature: 0,
//             max_tokens: 1024,
//             stream: true,
//             response_format: { type: "json_object" },
//         });

//         if (!response2) {
//             throw new BadRequestError("Something went wrong");
//         }

//         for await (const chunk of response2) {
//             if (chunk.choices.length > 0) {
//                 const content = chunk.choices[0].delta.content;
//                 if (content != undefined) {
//                     res.write(`${content}`);
//                 } else {
//                     res.write(`data: break\n\n`);
//                     res.end();
//                 }
//             }
//         }

//         // res.send(response);
//     } catch (error) {
//         next(error)
// }

try {
    console.log("Starting....");
    let sections = ''
    const generateProfile = async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    "role": "user",
                    "content": "Create a marketing strategy profile as marketingStrategyProfile key for a merchandising business in JSON include sections as a key. Goals are to increase sales and awareness by 20% in 6 months. Target audience is 18-35 year olds. The marketing strategy should contain various sections of at least 100 words. The whole response is in JSON. List the elements or sections.",
                },
            ],
            stream: true,
            temperature: 0.8,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });
        
        for await (const chunk of response) {
            if (chunk.choices.length > 0) {
                const content = chunk.choices[0].delta.content;
                if (content != undefined) {
                    sections +=content
                    res.write(`${content}`);
                } else {
                    res.write(`data: break\n\n`);
                    res.flushHeaders();
        
                }
            }
        }
        return sections;    
    };

        // Generate marketing strategy profile
    const sectionsRetrived = await generateProfile();

    const expandSections = async () => {
        const prompt = await JSON.stringify(Object.keys(await JSON.parse(sectionsRetrived).marketingStrategyProfile.sections))
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    "role": "user",
                    "content": `Create an indepth step by step approach in paragraphs on the each section of the following items of a marketing strategy for a merchandising business in this list ${prompt}  in JSON.`,
                },
            ],
            temperature: 0.8,
            stream: true,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

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
    };



    // Expand on each section
    await expandSections();

    // Additional calls for expanding on other sections can be added as needed

    res.end(); // End the response stream

} catch (error) {
    next(error);
}

    
}

module.exports  = {sendPrompt}