const config = require("../config.json")

async function main() {
    const netWork = await ethers.provider.getNetwork();
    console.log("【networkId】:",netWork.chainId)

    const [deployer] = await ethers.getSigners();
    console.log("【deployer】:", await deployer.getAddress());

    // nftTest 创建
    const nftTestContract = await ethers.getContractFactory("nftTest");
    const nftTest = await nftTestContract.deploy(config.project.mintPrice, config.project.paymentToken)
    await nftTest.deployed();
    console.log("【nftTest】:", nftTest.address);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });