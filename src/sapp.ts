// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import routes from "./routes/index.js";
// import { EstatePoolEventService } from "./services/eventPool";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api", routes);

// async function startServer() {
//   try {
//     // Initialize event service
//     const eventService = EstatePoolEventService.getInstance();
//     await eventService.startListening();

//     // Cleanup on server shutdown
//     process.on("SIGTERM", () => {
//       console.log("SIGTERM received. Shutting down gracefully...");
//       eventService.stopListening();
//       process.exit(0);
//     });

//     process.on("SIGINT", () => {
//       console.log("SIGINT received. Shutting down gracefully...");
//       eventService.stopListening();
//       process.exit(0);
//     });

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//       console.log("Blockchain event listeners are active");
//     });
//   } catch (error) {
//     console.error("Failed to start server or event listeners:", error);
//     process.exit(1);
//   }
// }

// // Start the server
// startServer().catch((error) => {
//   console.error("Unhandled error during server startup:", error);
//   process.exit(1);
// });
