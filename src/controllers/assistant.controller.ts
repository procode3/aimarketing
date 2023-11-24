
import { Request, Response, NextFunction } from 'express';
import {openai} from '../utils/openai';



export const assistMarket = async(req: Request, res: Response, next: NextFunction) => {

    const {businessName, industry, age, gender, product, goals} = req.body;

    const assistant = await openai.beta.assistants.retrieve(
        "asst_JT4LKE7yZGld07CfMyjr6IOM"
    )

    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: `Can you help me with a marketing strategy for my business? Details below:
                Business name: ${businessName || "[imaginary business]"},
                Industry: ${industry || "[imaginary industry]"},
                Age: ${age || "any"},
                gender: ${gender || "both"},
                product: ${product || "[imaginary product]"},
                goals: ${goals || "increase sales"}
                location:Nairobi`
        }
    );

    const run = await openai.beta.threads.runs.create(
        thread.id,
        { 
          assistant_id: assistant.id,
        //   instructions: "Please address the user as Jane Doe. The user has a premium account."
        }
      );
    
    const status = await retrieveCompletedRun(thread.id, run.id);

    const messages = await openai.beta.threads.messages.list(
    thread.id
    );

   res.send({run: run, data: messages.data[0].content[0]});
    
}

export const retrieveCompletedRun = async (threadId: string, runId: string) => {
    let run = await openai.beta.threads.runs.retrieve(threadId, runId);

    // Polling status of run until it is completed
    while (run.status !== "completed") {
        run = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    return true;
};



