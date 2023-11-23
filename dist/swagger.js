"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Evento API End Point Documentation",
            version: "1.0.0",
            description: "API for Evento API End Point Documentation",
        },
        servers: [
            {
                url: "http://localhost:3000/",
                description: "Local server",
            },
            {
                url: "https://your-live-server-url.com/",
                description: "Live server",
            },
        ],
        license: {
            name: "Apache 2.0",
            url: "https://www.apache.org/licenses/LICENSE-2.0.html",
        },
    },
    apis: ["./src/routes/*.route.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
module.exports = specs;
//# sourceMappingURL=swagger.js.map