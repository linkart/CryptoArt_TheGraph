# CryptoArt.Ai Subgraph


### Built via

```bash
graph init
```

### Install graph-client

`npm install -g @graphprotocol/graph-cli`

### Auth with subgraph

`graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`


### Dev cycle

Install
```bash
yarn install
```

If schema changes
```bash
yarn codegen
```

Compile mappings
```bash
graph build
or
yarn build
```

Push that puppy!
```bash
graph deploy --studio <SUBGRAPH_NAME>
```


