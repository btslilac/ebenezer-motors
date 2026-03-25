// Vercel serverless entry-point — wraps the Express app
// Vercel calls this file for all /api/* routes (see vercel.json)
import "../server/src/config/env.js"; // ensures dotenv.config() runs first
import app from "../server/src/app.js";

export default app;
