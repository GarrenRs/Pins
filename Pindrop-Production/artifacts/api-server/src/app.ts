import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ---------------------------------------------------------------------------
// CORS
// In production: set FRONTEND_ORIGIN to your exact frontend origin.
// In development: allows standard localhost origins automatically.
// ---------------------------------------------------------------------------
const configuredOrigin = process.env.FRONTEND_ORIGIN;
const isProduction = process.env.NODE_ENV === "production";

let corsOrigin: string | string[] | boolean;

if (configuredOrigin) {
  // Explicit origin always wins (production or dev with explicit override)
  corsOrigin = configuredOrigin;
} else if (isProduction) {
  // Production with no FRONTEND_ORIGIN set — safest fallback is to block all
  // cross-origin requests. The operator MUST set FRONTEND_ORIGIN in production.
  corsOrigin = false;
  logger.warn("FRONTEND_ORIGIN is not set in production — CORS will block all browser cross-origin requests.");
} else {
  // Local development: allow standard localhost origins so the dev server
  // can communicate with this API without requiring any configuration.
  corsOrigin = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
  ];
}

app.use(cors({ origin: corsOrigin }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use("/api", router);

export default app;
