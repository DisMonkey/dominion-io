import cluster from "cluster";
import crypto from "crypto";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import http from "http";
import path from "path";
import { GameEnv } from "../core/configuration/Config";
import { getServerConfigFromServer } from "../core/configuration/ConfigLoader";
import { LeaderboardService } from "./leaderboard/LeaderboardService";
import { logger } from "./Logger";
import { MapPlaylist } from "./MapPlaylist";
import { MasterLobbyService } from "./MasterLobbyService";
import { setNoStoreHeaders } from "./NoStoreHeaders";
import { renderAppShell } from "./RenderHtml";
import { applyStaticAssetCacheControl } from "./StaticAssetCache";

const config = getServerConfigFromServer();
const playlist = new MapPlaylist();
const leaderboardService = new LeaderboardService();
let lobbyService: MasterLobbyService;

const app = express();
const server = http.createServer(app);

const log = logger.child({ comp: "m" });

// Allow cross-origin requests from all Dominion.io frontends
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.options("*", (_req, res) => {
  res.sendStatus(204);
});

app.use(express.json());

// Serve the shared app shell for the root document.
app.use(async (req, res, next) => {
  if (req.path === "/") {
    try {
      await renderAppShell(
        res,
        path.join(__dirname, "../../static/index.html"),
      );
    } catch (error) {
      log.error("Error rendering index.html:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    next();
  }
});

app.use(
  express.static(path.join(__dirname, "../../static"), {
    maxAge: "1y", // Set max-age to 1 year for all static assets
    setHeaders: (res) => {
      applyStaticAssetCacheControl(
        res.setHeader.bind(res),
        res.req.originalUrl,
      );
    },
  }),
);

app.set("trust proxy", 3);
app.use(
  rateLimit({
    windowMs: 1000, // 1 second
    max: 20, // 20 requests per IP per second
  }),
);

app.use("/api", (_req, res, next) => {
  setNoStoreHeaders(res);
  next();
});

// Start the master process
export async function startMaster() {
  if (!cluster.isPrimary) {
    throw new Error(
      "startMaster() should only be called in the primary process",
    );
  }

  log.info(`Primary ${process.pid} is running`);
  log.info(`Setting up ${config.numWorkers()} workers...`);

  lobbyService = new MasterLobbyService(config, playlist, log);

  // Generate admin token for worker authentication
  const ADMIN_TOKEN = crypto.randomBytes(16).toString("hex");
  process.env.ADMIN_TOKEN = ADMIN_TOKEN;

  const INSTANCE_ID =
    config.env() === GameEnv.Dev
      ? "DEV_ID"
      : crypto.randomBytes(4).toString("hex");
  process.env.INSTANCE_ID = INSTANCE_ID;

  log.info(`Instance ID: ${INSTANCE_ID}`);

  // Fork workers
  for (let i = 0; i < config.numWorkers(); i++) {
    const worker = cluster.fork({
      WORKER_ID: i,
      ADMIN_TOKEN,
      INSTANCE_ID,
    });

    lobbyService.registerWorker(i, worker);
    log.info(`Started worker ${i} (PID: ${worker.process.pid})`);
  }

  // Handle worker crashes
  cluster.on("exit", (worker, code, signal) => {
    const workerId = (worker as any).process?.env?.WORKER_ID;
    if (workerId === undefined) {
      log.error(`worker crashed could not find id`);
      return;
    }

    const workerIdNum = parseInt(workerId);
    lobbyService.removeWorker(workerIdNum);

    log.warn(
      `Worker ${workerId} (PID: ${worker.process.pid}) died with code: ${code} and signal: ${signal}`,
    );
    log.info(`Restarting worker ${workerId}...`);

    // Restart the worker with the same ID
    const newWorker = cluster.fork({
      WORKER_ID: workerId,
      ADMIN_TOKEN,
      INSTANCE_ID,
    });

    lobbyService.registerWorker(workerIdNum, newWorker);
    log.info(
      `Restarted worker ${workerId} (New PID: ${newWorker.process.pid})`,
    );
  });

  const PORT = Number(process.env.PORT ?? 3000);
  server.listen(PORT, () => {
    log.info(`Master HTTP server listening on port ${PORT}`);
  });
}

function sendHealth(res: Response): void {
  const ready = lobbyService?.isHealthy() ?? false;
  const stats = lobbyService?.healthStats() ?? { players: 0, games: 0 };
  if (ready) {
    res.json({ status: "ok", ...stats });
  } else {
    res.status(503).json({ status: "unavailable", ...stats });
  }
}

app.get("/health", (_req, res) => {
  sendHealth(res);
});

app.get("/api/health", (_req, res) => {
  sendHealth(res);
});

app.get("/api/instance", (_req, res) => {
  res.json({
    instanceId: process.env.INSTANCE_ID ?? "undefined",
  });
});

async function sendLeaderboard(req: Request, res: Response) {
  const limitParam = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(limitParam)
    ? Math.max(1, Math.min(100, Math.floor(limitParam)))
    : 50;
  res.json({ players: await leaderboardService.top(limit) });
}

app.get("/leaderboard", async (req, res, next) => {
  try {
    await sendLeaderboard(req, res);
  } catch (error) {
    next(error);
  }
});

app.get("/api/leaderboard", async (req, res, next) => {
  try {
    await sendLeaderboard(req, res);
  } catch (error) {
    next(error);
  }
});

// SPA fallback route
app.get("/{*splat}", async function (_req, res) {
  try {
    const htmlPath = path.join(__dirname, "../../static/index.html");
    await renderAppShell(res, htmlPath);
  } catch (error) {
    log.error("Error rendering SPA fallback:", error);
    res.status(500).send("Internal Server Error");
  }
});
