# Zorro Fire Log DemoApp

## Installation

### Install dependecies

cd into the demo-app directory and run

```sh
$ npm install
```

to install project dependencies.

### Setup environment

replace the contents in src/environments/environment.ts to match your setup (and environment.prod.ts for production setups).

```js
export const environment = {
  production: false,
  // your firebase setup goes here
  firebase: {
    apiKey: "<your-key>",
    authDomain: "<your-project-authdomain>",
    databaseURL: "<your-database-URL>",
    projectId: "<your-project-id>",
    storageBucket: "<your-storage-bucket>",
    messagingSenderId: "<your-messaging-sender-id>",
  },
  // as list of trade logs. should match the aliases used in trade-sync
  tradeLogs: ["example-1", "example-2"],
};
```

## Run development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

NOTE: the app will load trade log entries from your firestore on each reload and may incur quota costs or quota limitations. 

## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
