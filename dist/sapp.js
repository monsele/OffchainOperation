"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const eventPool_1 = require("./services/eventPool");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use("/api", index_1.default);
async function startServer() {
    try {
        // Initialize event service
        const eventService = eventPool_1.EstatePoolEventService.getInstance();
        await eventService.startListening();
        // Cleanup on server shutdown
        process.on("SIGTERM", () => {
            console.log("SIGTERM received. Shutting down gracefully...");
            eventService.stopListening();
            process.exit(0);
        });
        process.on("SIGINT", () => {
            console.log("SIGINT received. Shutting down gracefully...");
            eventService.stopListening();
            process.exit(0);
        });
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log("Blockchain event listeners are active");
        });
    }
    catch (error) {
        console.error("Failed to start server or event listeners:", error);
        process.exit(1);
    }
}
// Start the server
startServer().catch((error) => {
    console.error("Unhandled error during server startup:", error);
    process.exit(1);
});
