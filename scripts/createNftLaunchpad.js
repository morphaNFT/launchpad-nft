const config = require("../config.json")
const {Contract} = require("ethers");
const {abi} = require("../artifacts/contracts/LaunchpadFactory.sol/LaunchpadFactory.json")

async function main() {
    const netWork = await ethers.provider.getNetwork();
    console.log("【networkId】:",netWork.chainId)

    const [deployer] = await ethers.getSigners();
    console.log("【deployer】:", await deployer.getAddress());

    // LaunchpadFactory合约实例
    let LaunchpadFactory = new Contract(config.contracts.launchpadFactory, abi, deployer)

    const saleTimes = {
        startTime: config.project.startTime,
        publicSaleTime: config.project.publicSaleTime
    };

    // 创建Launchpad合约
    const txCreateLaunchpad = await LaunchpadFactory.createNftLaunchpad(
        config.project.offeringId,
        config.project.targetNFT,
        saleTimes,
        config.project.mintPrice,
        config.project.paymentToken,
        config.project.whitelistSigner,
        config.project.maxMintPerWallet,
        config.project.saleMode
    )
    await txCreateLaunchpad.wait()
    console.log("txCreateLaunchpad:", txCreateLaunchpad.hash)

    // 获取launchpad合约地址
    const launchpadAddress = await LaunchpadFactory.getLaunchpadByOfferingId(config.project.offeringId)
    console.log("launchpadAddress:", launchpadAddress)
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });