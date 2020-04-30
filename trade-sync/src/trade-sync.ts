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

const config: Config = require("./config.json");
const serviceAccount = require("./serviceAccountKey.json");

const args = process.argv.slice(2);
console.log(args);

admin.initializeApp({
  ...config.firebase,
  credential: admin.credential.cert(serviceAccount),
});

if (config.tradeLogs && config.tradeLogs.length) {
  config.tradeLogs.forEach((tl) => {
    const tail = new Tail(tl.path, {
      flushAtEOF: true,
      fromBeginning: args.includes("--fromBeginning"),
    });
    tail.on("line", (line: string) => {
      if (line) {
        const parts = line.split(",");
        if (parts.length === 12 && parts[0].toLowerCase() !== "name") {
          const entry: LogEntry = {
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
          admin
            .firestore()
            .collection(tl.alias)
            .doc(createHash("md5").update(line).digest("hex"))
            .set(entry)
            .then(function () {
              console.log("Trade log written!");
            })
            .catch(function (error) {
              console.error("Error writing trade log: ", error);
            });
        } else {
          console.log(
            `Line skipped: ${
              parts.length === 12
                ? "first line"
                : "wrong number of parts: " + parts.length
            }`
          );
        }
      }
    });

    tail.on("error", function (error) {
      console.log("ERROR: ", error);
    });
  });
} else {
  console.log("No trade logs configured.");
}
