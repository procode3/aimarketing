"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const middlewares_1 = require("./middlewares");
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const openapi_controller_1 = require("./controllers/openapi.controller");
const assistant_controller_1 = require("./controllers/assistant.controller");
// import passport from "./utils/passport";
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");
const app = (0, express_1.default)();
//  Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
// middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));
// app.use(passport.initialize());
// app.use(passport.session());
//serve all routes dynamically using readdirsync
// app.use("/api/v1", require(`./routes/openapi.route.ts`))
app.get("/", (req, res) => res.send("Hello World"));
app.use(middlewares_1.errorHandler);
const port = process.env.PORT || 3000;
app.post("/api/v1/getStrategy", openapi_controller_1.sendPrompt);
app.post("/api/v1/assist", assistant_controller_1.assistMarket);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map