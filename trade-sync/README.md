# trade-sync

## How to use

### Installation

Clone the repository using git
```
$ git clone https://github.com/phl3x0r/zorro-fire-log.git
```

trade-sync requires [Node.js](https://nodejs.org/) and [Typescript](https://www.typescriptlang.org/) to run.
Also, you must have a [Firebase Firestore](https://firebase.google.com/) - see https://firebase.google.com/docs/firestore/quickstart for how to get started. 

Install the dependencies.

```sh
$ cd trade-sync
$ npm install
```

Create a firebase [service account](https://firebase.google.com/docs/admin/setup) and copy the json file to src/serviceAccountKey.json

IMPORTANT: Don't share the contents of this file with others as it contains your private firebase credentials!

### Configuration
Create or edit src/config.json such that it contains the path for your firestore db and a list of tradelogs to watch.

Example:
```json
{
  "firebase": {
    "databaseURL": "https://my-trade-logs.firebaseio.com"
  },
  "tradeLogs": [{ "path": "path/to/trades.csv", "alias": "demo" }]
}
```

### Usage
Compile and run using the following commands:
```sh
$ tsc && node dist/trade-sync.js
```
This will start watching the files specified in the tradeLogs array in config.json and write a new log entry when new lines get appended.

Optionally you can pass --fromBeginning to read all files from the first line.
```sh
$ tsc && node dist/trade-sync.js --fromBeginning
```
