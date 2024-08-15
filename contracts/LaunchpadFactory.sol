// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Launchpad.sol";
import { SaleTimes, SaleMode } from "./Para.sol";

contract LaunchpadFactory is Ownable {
    // 使用映射存储所有已部署的 Launchpad 合约地址，以项目ID为key
    mapping(string => address) internal allLaunchpads;

    event LaunchpadCreated(string indexed offeringId, address indexed launchpad);

    constructor()Ownable(msg.sender){}

    // 创建新的 Launchpad 合约
    function createNftLaunchpad(
        string memory _offeringId,
        address _targetNFT,
        SaleTimes memory saleTimes,
        uint256 _mintPrice,
        IERC20 _paymentToken,
        address _whitelistSigner,
        uint256 _maxMintPerWallet,
        SaleMode _saleMode,
        uint256 _sum
    ) external onlyOwner returns (address) {
        require(isStringNonEmpty(_offeringId), "The project ID is not a valid string");
        // 检查项目ID是否已经存在
        require(allLaunchpads[_offeringId] == address(0), "Project ID already exists");

        // 部署新的 Launchpad 合约
        Launchpad newLaunchpad = new Launchpad(
            _offeringId,
            _targetNFT,
            saleTimes,
            _mintPrice,
            _paymentToken,
            _whitelistSigner,
            _maxMintPerWallet,
            _saleMode,
            _sum
        );

        // 将新合约地址储存到映射中
        allLaunchpads[_offeringId] = address(newLaunchpad);

        //token 授权
        if (address(_paymentToken) != address(0)) {
            uint256 maxUInt256 = type(uint256).max;
            newLaunchpad.authorizeTransfer(maxUInt256);
        }

        // 将 Launchpad 合约的所有权转移给调用者
        newLaunchpad.transferOwnership(msg.sender);

        emit LaunchpadCreated(_offeringId, address(newLaunchpad));

        return address(newLaunchpad);
    }

    // 获取已部署的 Launchpad 合约地址
    function getLaunchpadByOfferingId(string memory _offeringId) external view returns (address) {
        return allLaunchpads[_offeringId];
    }

    // 检查字符串长度是否大于0
    function isStringNonEmpty(string memory str) public pure returns (bool) {
        return bytes(str).length > 0;
    }
}