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
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });