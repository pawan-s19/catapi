import app from "./app.js";
import { createServer } from "http";
import { PORT } from "./configs/server.js";


const server = createServer(app);

server.listen(PORT, () => {
    console.info(`Server Listening at Port, ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});