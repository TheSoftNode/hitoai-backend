import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { NextFunction, Request, Response } from "express";
import globalErrorHandler from "../error_handlers/errorHandler";
import { mountedRoutes } from "./routes";
import path from "path";


const app = express();
const __dirname = path.resolve();

// Serve the 'uploads' folder as static content
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Always put at the top of all middlewares
// SET Security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

// The body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));


// The cross origin resource sharing
const corOptions = cors({
  origin: true,
  credentials: true,
});
app.use(corOptions);

mountedRoutes(app);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Can't find ${req.originalUrl} in this server!`);
  err.statusCode = 404;
  next(err);
  // next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
