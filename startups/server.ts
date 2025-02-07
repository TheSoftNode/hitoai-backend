import path from "path";
import dotenv from "dotenv";
import app from "./app";

// Handle uncaughtException
process.on("uncaughtException", (err) =>
{
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

// Resolve config.env path
dotenv.config({
    path: path.resolve(__dirname, "../config/config.env"),
});


// Create a port
const port = process.env.PORT || 3000;

// Listen to the port
const server = app.listen(port, () =>
{
    console.log(`App running on port ${port}...`);
});

// Handle unhandled Rejections
process.on("unhandledRejection", (err: any) =>
{
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);

    server.close(() =>
    {
        process.exit(1);
    });
});
