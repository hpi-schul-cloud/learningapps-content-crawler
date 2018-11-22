# learningapps-content-crawler

[![Greenkeeper badge](https://badges.greenkeeper.io/schul-cloud/learningapps-content-crawler.svg)](https://greenkeeper.io/)

Fetching interactive OER material hosted on https://www.learningapps.org/ by a given API; posting their converted meta information to a Schul-Cloud endpoint.
Note that one should contact the learningapps-team to get the API details, which are not given here.

## INSTALL
call:
```
npm install
```

And for the time being:

Change dir to ./local_modules/sc_learningapps/
and call
```
npm install
```
there again. This will be fixed using a post install script in package.json in the near future.

## Basics
The Schul-Cloud crawlers are a growing bunch of small pieces of code, intented to be coded by a Schul-Cloud community. Thus, our team tries to show several ways to participate and code a custom crawler for other content providers.


## Infrastructure of the Crawler
Beside the usual elements, there are some more directories:
- ./local_modules - there is one small module placed here for the bare fetching functionality.
- routes - Only one express router: index.js
- ./app.js an express sub which combines the concrete configuration of the app´s credentials with those for the crawler (./crawler.js), the crawler itself and the posting towards the Schul-Cloud - endpoint given by the config params.

The directories ./config and ./node_modules are git ignored.
 

## Configuring the Crawler / starting with no configuration 
NEW:
Due to the intention of being installed in a Docker container; this version gets ALL config parameters from process.env. In case there is no or non correct parameter given, the express app starts (on port 3000) but gives you nothing more than a short description of the parameters needed in the browser. The complete config data at runtime is put inside app.locals.config.

## Calling the Crawler
The whole crawler is just an express subapp; you could start it locally using 

```
npm start
```
.

## Authorization
Sending data to the official Schul-Cloud content service you need a Schul-Cloud service account and pass your credentials via process.env:
CONTENT_USER, CONTENT_PASSWORD.

## TODOs
- There´s always room for optimization.
- The Error handling is not quite elegant and should be re-implemented.

