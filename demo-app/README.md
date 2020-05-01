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

## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
