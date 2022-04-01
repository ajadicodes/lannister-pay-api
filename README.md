# REST & GraphQL APIs for LannisterPay’s transaction fee processing service

## Table of Contents

- [REST & GraphQL APIs for LannisterPay’s transaction fee processing service](#rest--graphql-apis-for-lannisterpays-transaction-fee-processing-service)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Highlights](#highlights)
  - [Getting Started](#getting-started)

## About

REST & GraphQL APIs for LannisterPay’s transaction fee processing service.

## Highlights

One code base two -- REST & GraphQL -- APIs.

- Written in TypeScript
- Fastify 🤝 Apollo-Server
- GraphQL API :link: [/graphql](https://lannister-pay-api-app.herokuapp.com/graphql)
- Auto-generated REST API based on their respective GraphQL served :link: [/fees](https://lannister-pay-api-app.herokuapp.com/fees) & [/compute-transaction-fee](https://lannister-pay-api-app.herokuapp.com/compute-transaction-fee)
- Fully generated documentation that is always up-to-date :link: [See docs](https://lannister-pay-api-app.herokuapp.com/).

## Getting Started

These instructions will get a copy of the project up and running on your local machine for development and testing purposes.

**Clone repository then**

```shell
cd <project-name>
```

**Install dependences**

```shell
yarn  # npm install
```

**Run Development Server**

```bash
yarn dev # npm run dev
```

**Generate types**

```bash
yarn generate # npm run generate
```

**Run Tests**

```bash
yarn test
```
