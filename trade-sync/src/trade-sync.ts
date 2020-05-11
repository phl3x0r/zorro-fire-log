#!/usr/bin/env node
import * as admin from "firebase-admin";
import { Tail } from "tail";
import { createHash } from "crypto";

interface TradeLog {
  path: string;
  alias: string;
  schema: string;
}

interface Schema {
  [key: string]: "string" | "int" | "float" | "date";
}

interface Config {
  firebase: { databaseURL: string; credential: { [key: string]: string } };
  tradeLogs: TradeLog[];
  positionLogs: TradeLog[];
  schemas: { [key: string]: Schema };
}

interface LogEntry {
  [key: string]: any;
}

interface PositionLogEntry {
  positions: LogEntry[];
}

enum LogType {
  TradeLog = "tradeLog",
  PositionLog = "positionLog",
}

let fs = require("fs");
let path = require("path");
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const program = require("commander");
clear();
console.log(
  chalk.green(figlet.textSync("trade-sync", { horizontalLayout: "full" }))
);
program
  .version("0.2.1")
  .description("A script for syncing logfiles to firebase")
  .option("-b, --fromBeginning", "Read files from first line")
  .option("-c, --config <file>", "config file", "trade-sync.config.json")
  .parse(process.argv);

let config: Config = <Config>{};
let configPath = path.join(process.cwd(), program.config);
if (fs.existsSync(configPath)) {
  config = require(configPath);
} else {
  console.error(chalk.red(`config file ${configPath} not found`));
  process.exit(1);
}

admin.initializeApp({
  databaseURL: config.firebase.databaseURL,
  credential: admin.credential.cert(config.firebase.credential),
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
    const schema = config.schemas[tl.schema];
    if (!schema) {
      console.error(chalk.red(`Schema [${schema}] not found!`));
    }
    const tail = new Tail(tl.path, {
      flushAtEOF: true,
      fromBeginning: !!program.fromBeginning,
    });
    if (logType === LogType.TradeLog) {
      onTradeLogLine(tail, tl, schema);
    } else if (logType === LogType.PositionLog) {
      onPositionLogLine(tail, tl, schema);
    }
  });
}

// hande lines from trade logs
function onTradeLogLine(tail: Tail, tl: TradeLog, schema: Schema) {
  tail.on("line", (line: string) => {
    if (line) {
      const parts = line.split(",");
      if (validateLine(parts, schema)) {
        const entry: LogEntry = mapEntry(parts, schema);
        const fbId = createHash("md5").update(line).digest("hex");
        const collection = tl.alias;
        writeToFirestore(collection, fbId, entry);
      }
    }
  });
  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
}

// hande lines from position logs
function onPositionLogLine(tail: Tail, tl: TradeLog, schema: Schema) {
  const entry: { positions: LogEntry[] } = { positions: [] };
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
        if (validateLine(parts, schema)) {
          entry.positions.push(mapEntry(parts, schema));
        }
      }
    }
  });
  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
}

function validateLine(parts: string[], schema: Schema) {
  const schemaKeys = Object.keys(schema);
  if (
    parts.length === schemaKeys.length &&
    parts[0].toLowerCase() !== schemaKeys[0].toLowerCase()
  ) {
    return true;
  } else {
    console.log(
      `Line skipped: ${
        parts.length === schemaKeys.length
          ? "first line"
          : `parts[${parts.length}] [${parts}] do no match schema[${schemaKeys.length}] [${schemaKeys}]`
      }`
    );
  }
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
      console.error(chalk.red("Error writing trade log: ", error));
    });
}

function mapEntry(parts: string[], schema: Schema): LogEntry {
  const mappings = Object.entries(schema);
  const mappedParts = parts.map((part, index) =>
    mapPart(part, mappings[index])
  );

  return mappedParts.reduce((acc, cur) => {
    if (cur) {
      acc[cur[0]] = cur[1];
    }
    return acc;
  }, <LogEntry>{});
}

function mapPart(
  part: string,
  c: [string, "string" | "int" | "float" | "date"]
): [string, string | number | admin.firestore.Timestamp] | null {
  const name = c[0];
  const type = c[1];

  if (type === "string") {
    return [name, String(part)];
  }
  if (type === "int") {
    return [name, Number.parseInt(part)];
  }
  if (type === "float") {
    return [name, Number.parseFloat(part)];
  }
  if (type === "date") {
    return [name, admin.firestore.Timestamp.fromDate(new Date(part))];
  }
  console.warn(chalk.yellow(`Mapping type [${type}] not found in schema!`));
  return null;
}
