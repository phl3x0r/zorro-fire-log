import * as admin from "firebase-admin";
import { Tail } from "tail";
import { createHash } from "crypto";

interface TradeLog {
  path: string;
  alias?: string;
}

interface Config {
  firebase: { databaseURL: string };
  tradeLogs: TradeLog[];
  positionLogs: TradeLog[];
}

interface LogEntry {
  name: string;
  type: string;
  asset: string;
  id: number;
  lots: number;
  open: admin.firestore.Timestamp;
  close: admin.firestore.Timestamp;
  entry: number;
  exit: number;
  profit: number;
  roll: number;
  exitType: string;
}

interface PositionLogEntry {
  positions: LogEntry[];
}

enum LogType {
  TradeLog = "tradeLog",
  PositionLog = "positionLog",
}

const config: Config = require("./config.json");
const serviceAccount = require("./serviceAccountKey.json");

const args = process.argv.slice(2);

admin.initializeApp({
  ...config.firebase,
  credential: admin.credential.cert(serviceAccount),
});

if (config.tradeLogs && config.tradeLogs.length) {
  writeLogFile(LogType.TradeLog);
} else {
  console.log("No trade logs configured.");
}
if (config.positionLogs && config.positionLogs.length) {
  writeLogFile(LogType.PositionLog);
} else {
  console.log("No position logs configured.");
}

function writeLogFile(logType: LogType) {
  const logfiles =
    logType === LogType.TradeLog ? config.tradeLogs : config.positionLogs;
  logfiles.forEach((tl) => {
    const tail = new Tail(tl.path, {
      flushAtEOF: true,
      fromBeginning: args.includes("--fromBeginning"),
    });
    if (logType === LogType.TradeLog) {
      onTradeLogLine(tail, tl);
    } else if (logType === LogType.PositionLog) {
      onPositionLogLine(tail, tl);
    }
  });
}

// hande lines from trade logs
function onTradeLogLine(tail: Tail, tl: TradeLog) {
  tail.on("line", (line: string) => {
    if (line) {
      const parts = line.split(",");
      if (parts.length === 12 && parts[0].toLowerCase() !== "name") {
        const entry: LogEntry = mapEntry(parts);
        const fbId = createHash("md5").update(line).digest("hex");
        const collection = tl.alias;
        writeToFirestore(collection, fbId, entry);
      } else invalidLine(parts);
    }
  });
  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
}

// hande lines from position logs
function onPositionLogLine(tail: Tail, tl: TradeLog) {
  const entry = { positions: [] };
  let lastWriteEmpty = false;
  tail.on("line", (line: string) => {
    if (line) {
      if (line === "EOF") {
        const fbId = tl.alias;
        const collection = "positions";
        // Don't write empty list if last write was also empty
        if (
          entry.positions.length ||
          (!entry.positions.length && !lastWriteEmpty)
        ) {
          writeToFirestore(collection, fbId, entry, () => {
            lastWriteEmpty = !entry.positions.length;
            entry.positions = [];
          });
        }
      } else {
        const parts = line.split(",");
        if (parts.length === 12 && parts[0].toLowerCase() !== "name") {
          entry.positions.push(mapEntry(parts));
        } else invalidLine(parts);
      }
    }
  });
  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
}

function invalidLine(parts: string[]) {
  {
    console.log(
      `Line skipped: ${
        parts.length === 12
          ? "first line"
          : "wrong number of parts: " + parts.length
      }`
    );
  }
}

function writeToFirestore(
  collection: string,
  fbId: string,
  entry: LogEntry | PositionLogEntry,
  callback?: () => void
) {
  admin
    .firestore()
    .collection(collection)
    .doc(fbId)
    .set(entry)
    .then(function () {
      console.log(
        `${new Date().toISOString()}: Wrote entry id ${fbId} in ${collection}`
      );
      if (callback) {
        callback();
      }
    })
    .catch(function (error) {
      console.error("Error writing trade log: ", error);
    });
}

function mapEntry(parts: string[]): LogEntry {
  return {
    name: parts[0],
    type: parts[1],
    asset: parts[2],
    id: Number.parseInt(parts[3]),
    lots: Number.parseFloat(parts[4]),
    open: admin.firestore.Timestamp.fromDate(new Date(parts[5])),
    close: admin.firestore.Timestamp.fromDate(new Date(parts[6])),
    entry: Number.parseFloat(parts[7]),
    exit: Number.parseFloat(parts[8]),
    profit: Number.parseFloat(parts[9]),
    roll: Number.parseFloat(parts[10]),
    exitType: parts[11],
  };
}
