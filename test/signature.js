describe("【【launchpad contract】】", function () {
    describe("contribute", function () {
        it("contribute true", async function () {
            // 选择网络
            const [whiteSigner] = await ethers.getSigners();
            console.log("签名地址：", await whiteSigner.getAddress())
            const netWork = await ethers.provider.getNetwork();
            console.log("networkId:",netWork.chainId)

            // 用户1数据签名（白名单校验用）
            const launchpad = "0x5DE7f884E6a18554b7Ff73794a9d24C52B2A4901"
            const userAddress = "0x8A8ee995FcE4E30Ecf6627a9D06409766d4d1492"
            const messageHash = ethers.utils.solidityKeccak256(["address", "address", "uint256"], [userAddress, launchpad, netWork.chainId]);
            const messageHashBytes = ethers.utils.arrayify(messageHash);
            const signature1 = await whiteSigner.signMessage(messageHashBytes);
            console.log("后台给用户一签名:", signature1)
        });
    });
});