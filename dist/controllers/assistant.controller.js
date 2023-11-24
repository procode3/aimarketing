"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveCompletedRun = exports.assistMarket = void 0;
const openai_1 = require("../utils/openai");
const assistMarket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, industry, age, gender, product, goals } = req.body;
    const assistant = yield openai_1.openai.beta.assistants.retrieve("asst_JT4LKE7yZGld07CfMyjr6IOM");
    const thread = yield openai_1.openai.beta.threads.create();
    const message = yield openai_1.openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Can you help me with a marketing strategy for my business? Details below:
                Business name: ${businessName || "[imaginary business]"},
                Industry: ${industry || "[imaginary industry]"},
                Age: ${age || "any"},
                gender: ${gender || "both"},
                product: ${product || "[imaginary product]"},
                goals: ${goals || "increase sales"}
                location:Nairobi`
    });
    const run = yield openai_1.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        //   instructions: "Please address the user as Jane Doe. The user has a premium account."
    });
    const status = yield (0, exports.retrieveCompletedRun)(thread.id, run.id);
    const messages = yield openai_1.openai.beta.threads.messages.list(thread.id);
    res.send({ run: run, data: messages.data[0].content[0] });
});
exports.assistMarket = assistMarket;
const retrieveCompletedRun = (threadId, runId) => __awaiter(void 0, void 0, void 0, function* () {
    let run = yield openai_1.openai.beta.threads.runs.retrieve(threadId, runId);
    // Polling status of run until it is completed
    while (run.status !== "completed") {
        run = yield openai_1.openai.beta.threads.runs.retrieve(threadId, runId);
    }
    return true;
});
exports.retrieveCompletedRun = retrieveCompletedRun;
//# sourceMappingURL=assistant.controller.js.map