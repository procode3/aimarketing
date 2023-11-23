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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = exports.parsePrompt = exports.sendPrompt = void 0;
const middlewares_1 = require("../middlewares");
const openai_1 = require("../utils/openai");
const sendPrompt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        console.log("Starting....");
        const response = yield openai_1.openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [{ "role": "user", "content": yield (0, exports.parsePrompt)(req) }],
            temperature: 0.5,
            max_tokens: 1000,
            stream: true,
            // response_format: { type: "json_object"},
        });
        if (!response) {
            throw new middlewares_1.BadRequestError("Something went wrong");
        }
        try {
            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                _c = response_1_1.value;
                _d = false;
                const chunk = _c;
                if (chunk.choices.length > 0) {
                    const content = chunk.choices[0].delta.content;
                    if (content != undefined) {
                        res.write(`${content}`);
                    }
                    else {
                        res.write(`data: break\n\n`);
                        res.end();
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // res.send(response);
    }
    catch (error) {
        next(error);
    }
});
exports.sendPrompt = sendPrompt;
const parsePrompt = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessName, industry, age, gender, product, goals } = req.body;
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.parsePrompt = parsePrompt;
const parseResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.parseResponse = parseResponse;
module.exports = { sendPrompt: exports.sendPrompt };
//# sourceMappingURL=openapi.controller.js.map