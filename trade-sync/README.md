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
Furthermore, each entry in `tradLogs` and `positionLogs` must contain a reference to a valid `schema`.
The `schemas` property contains the `schema` to use when parsing the lines and should appear in the order corresponding to the entry parts.

Example config:
```json
{
  "firebase": {
    "databaseURL": "https://zorro-fire-log.firebaseio.com"
  },
  "tradeLogs": [
    {
      "path": "./test/demotrades.csv",
      "alias": "demo-trades",
      "schema": "mySchema"
    }
  ],
  "positionLogs": [
    {
      "path": "./test/positions.csv",
      "alias": "demo-positions",
      "schema": "mySchema"
    }
  ],
  "schemas": {
    "mySchema": {
      "name": "string",
      "type": "string",
      "asset": "string",
      "id": "int",
      "lots": "float",
      "open": "date",
      "close": "date",
      "entry": "float",
      "exit": "float",
      "profit": "float",
      "roll": "float",
      "exitType": "string"
    }
  }
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

### Known Issues
If another program aquires a lock on the file, this can result in a `[Error: EBUSY: resource busy or locked, open 'path\to\file.csv']` from `fs.watch`.
Currently the only "fix" is to restart the script
