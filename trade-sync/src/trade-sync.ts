import * as admin from "firebase-admin";
import { Tail } from "tail";

interface TradeLog {
  path: string;
  alias?: string;
}

interface Config {
  firebase: { databaseURL: string };
  tradeLogs: TradeLog[];
}

interface LogEntry {
  Name: string;
  Type: string;
  Asset: string;
  ID: number;
  Lots: number;
  Open: admin.firestore.Timestamp;
  Close: admin.firestore.Timestamp;
  Entry: number;
  Exit: number;
  Profit: number;
  Roll: number;
  ExitType: string;
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
            Name: parts[0],
            Type: parts[1],
            Asset: parts[2],
            ID: Number.parseInt(parts[3]),
            Lots: Number.parseFloat(parts[4]),
            Open: admin.firestore.Timestamp.fromDate(new Date(parts[5])),
            Close: admin.firestore.Timestamp.fromDate(new Date(parts[6])),
            Entry: Number.parseFloat(parts[7]),
            Exit: Number.parseFloat(parts[8]),
            Profit: Number.parseFloat(parts[9]),
            Roll: Number.parseFloat(parts[10]),
            ExitType: parts[11],
          };
          admin
            .firestore()
            .collection("tradeLogs")
            .doc((tl.alias || tl.path) + "-" + entry.ID)
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
