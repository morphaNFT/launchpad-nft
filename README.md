## 项目结构简介
### 合约
- contracts/Launchpad.sol  NFT launchpad 合约
- contracts/LaunchpadFactory.sol  工厂合约
### 脚本
- scripts/depolyFactory.js   工厂合约部署脚本
- scripts/createNftLaunchpad.js  nft launchpad合约创建

## 准备环境
安装node.js

## 安装依赖
```shell
npm install
```
## 私钥配置
将私钥配置在config.js文件中，privateKey： 用户一   signerPrivateKey
```json
{
  "common": {
    "privateKey": ""
  }
}
```

## 配置区块链地址
在`hardhat.config.js`配置文件中,将要部署的网络地址写在`url`这里
```js
networks: {
    morph: {
      url: `https://rpc-quicknode-holesky.morphl2.io`,
      accounts: [`0x${config.common.privateKey}`]
    }
}
```

## 部署工厂合约
```shell
 ## 多劳多得工厂
 npx hardhat run ./scripts/depolyFactory.js --network morph
```
- 控制台将输出如下类似信息
    `【LaunchpadFactory】: 0x...`
- 将合约LaunchpadFactory地址复制到`config.json`里面的`launchpadFactory`字段
    ```json
      {
          "contracts": {
            "launchpadFactory": "0x..."
          }
      }
    ```


## 创建launchpad合约
```shell
## 多劳多的合约
npx hardhat run ./scripts/createNftLaunchpad.js --network morph
```
- 输出分别如下
  `launchpadAddress: 0x...`
- `launchpad`地址复制到 `config.json`里面的`launchpad`字段
 ```json
    {
      "contracts": {
        "launchpad": "0x..."
      }
    }
```