const { ethers } = require("ethers");
const { BigNumber } = require("ethers");

module.exports = {
    makeNonce: function (length) {
        let result = ""
        const characters = "0123456789"
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
        }
        return result
    },

    generateSignature: async function (userSignerAddress) {
        const [userSigner, whiteSigner] = await ethers.getSigners();
        // 数据签名（白名单校验用）
        const nonce = this.makeNonce(4)
        const messageHash = ethers.utils.solidityKeccak256(["address", "string"], [userSignerAddress, nonce]);
        const messageHashBytes = ethers.utils.arrayify(messageHash);
        const signature = await whiteSigner.signMessage(messageHashBytes);

        // const [userSigner, whiteSigner] = await ethers.getSigners();
        //
        // // 生成 nonce
        // const nonce = this.makeNonce(4);
        //
        // // 计算消息哈希
        // const messageHash = ethers.utils.solidityKeccak256(["address", "string"], [userSignerAddress, nonce]);
        // const messageHashBytes = ethers.utils.arrayify(messageHash);
        //
        // // 签名消息
        // const signature = await whiteSigner.signMessage(messageHashBytes);
        // console.log("signature--------", signature)
        return { nonce, signature };
    },

    // 用户投入资金x 实际募集到的资金y  单价z  目标资金b
    // 用户拿到的token数  {(x/y)*b}/z
    // 用户退回的资金  x-{(x/y)*b}
    calculateTokenAndRefund: function (ContributionSum, totalContributionAmount, targetRaiseAmount, outputTokenPrice) {
        const BigNumberContributionSum = BigNumber.from(ContributionSum);
        const BigNumberTotalContributionAmount = BigNumber.from(totalContributionAmount);
        const BigNumberTargetRaiseAmount = BigNumber.from(targetRaiseAmount);
        const BigNumberOutputTokenPrice = BigNumber.from(outputTokenPrice);
        let tokenReckon = BigNumber.from(0);
        if (BigNumberTotalContributionAmount.gt(BigNumberTargetRaiseAmount)) {
            tokenReckon = BigNumberContributionSum.mul(BigNumber.from(10).pow(18)).mul(BigNumberTargetRaiseAmount).div(BigNumberTotalContributionAmount).div(BigNumberOutputTokenPrice);
        }else {
            tokenReckon = BigNumberContributionSum.mul(BigNumber.from(10).pow(18)).div(BigNumberOutputTokenPrice);
        }

        let goBack = BigNumber.from(0);
        if (BigNumberTotalContributionAmount.gt(BigNumberTargetRaiseAmount)) {
            goBack = BigNumberContributionSum.sub(BigNumberContributionSum.mul(BigNumberTargetRaiseAmount).div(BigNumberTotalContributionAmount));
        }

        return { tokenReckon, goBack };
    },

    getFutureTimestamp: function (secondsToAdd) {
        return Math.floor(Date.now() / 1000) + secondsToAdd;
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


