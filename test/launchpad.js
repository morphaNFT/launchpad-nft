const config = require("../config.json")
const {Contract} = require("ethers");
const {abi} = require("../artifacts/contracts/Launchpad.sol/Launchpad.json")
const {abi20} = require("../test/abi/ERC20.json")
const {getFutureTimestamp, sleep} = require("./utils");

describe("【【launchpad contract】】", function () {
    describe("contribute", function () {
        it("contribute true", async function () {
            // 选择网络
            const [userSigner] = await ethers.getSigners();
            console.log("用户地址：", await userSigner.getAddress())
            const netWork = await ethers.provider.getNetwork();
            console.log("networkId:",netWork.chainId)

            // user1 launchpad实例
            let launchpadWithSigner1 = new Contract(config.contracts.launchpad, abi, userSigner)

            // 开启项目
            let isOpen = await launchpadWithSigner1.isOpen()
            if (!isOpen) {
                let txOpen = await launchpadWithSigner1.open()
                await txOpen.wait()
                console.log("项目开启：",txOpen.hash)
            }else {
                console.log("项目已经开启：")
            }

            let projectStartTime = await launchpadWithSigner1.startTime()
            if (projectStartTime > getFutureTimestamp(0)) {
                // 修改项目开始时间为当前时间+30s
                const futureStartTime = getFutureTimestamp(30)
                let saleTimes = {
                    startTime: futureStartTime,
                    // publicSaleTime: config.project.publicSaleTime
                    publicSaleTime: futureStartTime
                }
                let txUpdateSetSaleDetails = await launchpadWithSigner1.setSaleDetails(saleTimes, config.project.mintPrice, config.project.whitelistSigner)
                await txUpdateSetSaleDetails.wait();
                console.log("修改项目开始时间到未来30s:", txUpdateSetSaleDetails.hash)
                // 等待30s 模拟项目开始
                await sleep(30000)
                console.log("项目时间开始...........")
            }else {
                console.log("项目时间已经开始")
            }

            let paymentToken = launchpadWithSigner1.paymentToken()
            if (paymentToken !== "0x0000000000000000000000000000000000000000") {
                // paymentToken 合约实例
                let paymentTokenWithSignerUser1 = new Contract(config.project.paymentToken, abi20, userSigner)
                let txApproveUser1 = await paymentTokenWithSignerUser1.approve(config.contracts.launchpad, ethers.constants.MaxUint256)
                await txApproveUser1.wait();
                console.log("用户一授权token权限到合约：",txApproveUser1.hash)
            }

            // 用户1数据签名（白名单校验用）
            const launchpad = config.contracts.launchpad
            const userAddress = await userSigner.getAddress()
            const messageHash = ethers.utils.solidityKeccak256(["address", "address", "uint256"], [userAddress, launchpad, netWork.chainId]);
            const messageHashBytes = ethers.utils.arrayify(messageHash);
            const signature1 = await userSigner.signMessage(messageHashBytes);
            console.log("后台给用户一签名:", signature1)
            if (config.project.paymentToken === "0x0000000000000000000000000000000000000000") {
                let txUserMint = await launchpadWithSigner1.mint(signature1,{
                    value: ethers.BigNumber.from(config.project.mintPrice)
                })
                await txUserMint.wait();
                console.log("mint success：",txUserMint.hash)
            } else {
                let txUserMint = await launchpadWithSigner1.mint(signature1)
                await txUserMint.wait();
                console.log("mint success：",txUserMint.hash)
            }



        });
    });
});