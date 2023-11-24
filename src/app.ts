import express, {Request, Response} from "express";
import { readdirSync } from "fs";
import 'dotenv/config';
import { errorHandler } from "./middlewares";
import session from "express-session";
import cors from "cors";
import {sendPrompt} from "./controllers/openapi.controller";
import {assistMarket} from "./controllers/assistant.controller";
// import passport from "./utils/passport";

const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");


const app = express();

//  Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// middleware setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));


// app.use(passport.initialize());
// app.use(passport.session());



//serve all routes dynamically using readdirsync
// app.use("/api/v1", require(`./routes/openapi.route.ts`))

app.get("/", (req: Request, res: Response) => res.send("Hello World"));
app.use(errorHandler);
const port = process.env.PORT || 3000;
app.post("/api/v1/getStrategy",  sendPrompt)
app.post("/api/v1/assist",  assistMarket)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
