const config = require("../config.json")

async function main() {
    const netWork = await ethers.provider.getNetwork();
    console.log("【networkId】:",netWork.chainId)

    const [deployer] = await ethers.getSigners();
    console.log("【deployer】:", await deployer.getAddress());

    // LaunchpadFactory 创建
    const LaunchpadFactoryContract = await ethers.getContractFactory("LaunchpadFactory");
    const LaunchpadFactory = await LaunchpadFactoryContract.deploy()
    await LaunchpadFactory.deployed();
    console.log("【NftLaunchpadFactory】:", LaunchpadFactory.address);

    // owner转移
    let txTransferOwnership = await LaunchpadFactory.transferOwnership(config.newPotentialOwner)
    await txTransferOwnership.wait()
    console.log("【txTransferOwnership】:", txTransferOwnership.hash)
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });