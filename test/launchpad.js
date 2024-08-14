describe("【【launchpad contract】】", function () {
    describe("contribute", function () {
        it("contribute true", async function () {
            // 选择网络
            const [whiteSigner] = await ethers.getSigners();
            console.log("签名地址：", await whiteSigner.getAddress())
            const netWork = await ethers.provider.getNetwork();
            console.log("networkId:",netWork.chainId)

            // user1 launchpad实例
            // let launchpadWithSigner1 = new Contract(config.contracts.launchpad, abi, userSigner)
            // user2 launchpad实例
            // let launchpadWithSigner2 = new Contract(config.contracts.launchpad, abi, whiteSigner)

            // 设置tokenIds
            // let txAddTokens = launchpadWithSigner1.addTokenIds([1,2,3,4,5])
            // await txAddTokens.wait()
            // console.log("addTokens：",txAddTokens.hash)
            //
            // // 开启项目
            // let isOpen = await launchpadWithSigner1.isOpen()
            // if (!isOpen) {
            //     let txOpen = await launchpadWithSigner1.open()
            //     await txOpen.wait()
            //     console.log("项目开启：",txOpen.hash)
            // }else {
            //     console.log("项目已经开启：")
            // }
            //
            // let projectStartTime = await launchpadWithSigner1.startTime()
            // if (projectStartTime > getFutureTimestamp(0)) {
            //     // 修改项目开始时间为当前时间+30s
            //     const futureStartTime = getFutureTimestamp(30)
            //     let saleTimes = {
            //         startTime: futureStartTime,
            //         publicSaleTime: config.project.publicSaleTime
            //     }
            //     let txUpdateSetSaleDetails = await launchpadWithSigner1.setSaleDetails(saleTimes, config.project.mintPrice, config.project.whitelistSigner)
            //     await txUpdateSetSaleDetails.wait();
            //     console.log("修改项目开始时间到未来30s:", txUpdateSetSaleDetails.hash)
            //     // 等待30s 模拟项目开始
            //     await sleep(30000)
            //     console.log("项目时间开始...........")
            // }else {
            //     console.log("项目时间已经开始")
            // }

            // let paymentToken = launchpadWithSigner1.paymentToken()
            // if (paymentToken !== "0x0000000000000000000000000000000000000000") {
            //     // paymentToken 合约实例
            //     let paymentTokenWithSignerUser1 = new Contract(config.project.paymentToken, abi20, userSigner)
            //     let txApproveUser1 = await paymentTokenWithSignerUser1.approve(config.contracts.launchpad, ethers.constants.MaxUint256)
            //     await txApproveUser1.wait();
            //     console.log("用户一授权token权限到合约：",txApproveUser1.hash)
            // }else {
            //
            // }

            // 用户1数据签名（白名单校验用）
            const launchpad = "0x02B5825543dfaD7B7B47c5A5A9a95FB53dd7DC0B"
            const userAddress = "0x5565dCED382BEBbb3309289c41F01Ed91BF90A6B"
            const messageHash = ethers.utils.solidityKeccak256(["address", "address", "uint256"], [userAddress, launchpad, netWork.chainId]);
            const messageHashBytes = ethers.utils.arrayify(messageHash);
            const signature1 = await whiteSigner.signMessage(messageHashBytes);
            console.log("后台给用户一签名:", signature1)

            // const futureStartTime = getFutureTimestamp(30)
            // let saleTimes = {
            //     startTime: futureStartTime,
            //     publicSaleTime: futureStartTime+1000
            // }
            // let txUpdateSetSaleDetails = await launchpadWithSigner1.setSaleDetails(saleTimes, config.project.mintPrice, config.project.whitelistSigner)
            // await txUpdateSetSaleDetails.wait();
            // console.log("修改项目开始时间到未来30s:", txUpdateSetSaleDetails.hash)
            // // 等待30s 模拟项目开始
            // await sleep(30000)
            // console.log("项目时间开始...........")
        });
    });
});