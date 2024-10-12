## Project Structure Introduction
### contract
- contracts/Launchpad.sol  NFT launchpad contract
- contracts/LaunchpadFactory.sol Factory Contract
### scripts
- scripts/depolyFactory.js   Factory contract deployment script
- scripts/createNftLaunchpad.js  nft launchpad contract creation

## Prepare the environment
Install Node.js

## Install dependencies
```shell
npm install
```
## Private key configuration
Configure the private key in the config. js file
```json
{
  "common": {
    "privateKey": ""
  }
}
```

## Configure blockchain address
In the hardhat.config.js configuration file, write the network address to be deployed here in 'url'
```js
networks: {
    morph: {
      url: `https://rpc-quicknode-holesky.morphl2.io`,
      accounts: [`0x${config.common.privateKey}`]
    }
}
```

## Deploy factory contract
```shell
 npx hardhat run ./scripts/depolyFactory.js --network morph
```
- The console will output similar information as follows
    `【LaunchpadFactory】: 0x...`
- Copy the contract LaunchpadFactory address to the `launchpadFactory` field in `config. json`
    ```json
      {
          "contracts": {
            "launchpadFactory": "0x..."
          }
      }
    ```


## Create a launchpad contract
```shell
npx hardhat run ./scripts/createNftLaunchpad.js --network morph
```
- The output is as follows
  `launchpadAddress: 0x...`
- `launchpad` copy address to `config.json`里面的`launchpad`字段
 ```json
    {
      "contracts": {
        "launchpad": "0x..."
      }
    }
```