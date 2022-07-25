<p align="center">
<img width="300" alt="Sellflow Logo" src="https://cdn.shopify.com/s/files/1/0575/2805/8064/files/logo-Dipy-by-Dimerc300_165x@2x.png?v=1642784253">
</p>

<h3 align="center">App React Native usando Shopify storefront</a>!</h3>


## Inicio

Prerequisites:

- [Node.js](https://nodejs.org) installed
- [Expo](https://expo.io/learn)
  `npm install --global expo-cli@latest`
- Instalar [yarn](https://legacy.yarnpkg.com/docs/install)
  `curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.21.1`
- Shopify Api Key y Access Token para Shopify Storefront API.

Clone the repository:

Hacer un `.env.json` 

```sh
cp .env-example.json .env.json
```

Instalar Dependencias

```sh
yarn && yarn apollo:generate
```

Correr App

```sh
yarn start
```


