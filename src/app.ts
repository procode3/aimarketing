import express, {Request, Response} from "express";
import { readdirSync } from "fs";
import 'dotenv/config';
import { errorHandler } from "./middlewares";
import session from "express-session";
// import passport from "./utils/passport";

const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");


const app = express();

//  Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// middleware setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));

// app.use(passport.initialize());
// app.use(passport.session());



//serve all routes dynamically using readdirsync
readdirSync("./src/routes").map((path) =>
  app.use("/api/v1", require(`./routes/${path}`))
);
app.get("/", (req: Request, res: Response) => res.send("Hello World"));
app.use(errorHandler);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
