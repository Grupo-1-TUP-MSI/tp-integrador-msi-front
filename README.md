# Trabajo Practico Integrador - Metodologia de Sistemas I

## Installation

#### Requirements

- [Node.js](https://nodejs.org/en/) version _>=16.0.0_
- [yarn](https://yarnpkg.com/) - npm install -g yarn
- [git](https://git-scm.com/)

#### Steps

Create a .env file in the root of the project with the following content:

```bash
BACKEND_URL='Put the backend url here'
```

Development mode

```
yarn install && yarn start
```

Production mode

```
yarn install && yarn build
```

#### How to analyze the bundle size

```
yarn install && yarn build --stats
```

And then use the [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) to open _build/bundle-stats.json_.
