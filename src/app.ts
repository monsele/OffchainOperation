import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import { actionCorsMiddleware } from "@solana/actions";
import blinkRouter from "./routes/blinks.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
function getActionsJson(req, res) {
  const payload = {
    rules: [
      {
        pathPattern: "/api/actions/**", // Matches all your action URLs
        apiPath: "/api/actions/**"      // The corresponding API path
      }
    ]
  };
  res.json(payload);
}

app.get("/actions.json", getActionsJson);
// Middleware
app.use(express.json());
app.use(cors());
/**
 * The `actionCorsMiddleware` middleware will provide the correct CORS settings for Action APIs
 * so you do not need to use an additional `cors` middleware if you do not require it for other reasons
 */
// Pass an empty object or your specific HeaderHelperArgs configuration if needed
app.use(actionCorsMiddleware({}));
// Routes
app.use("/api", routes);
app.use("/api/", blinkRouter);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
