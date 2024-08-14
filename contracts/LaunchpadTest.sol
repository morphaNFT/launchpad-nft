// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// 定义目标 NFT 合约的接口
interface ITargetNFT {
    function mint(address to) external payable;
}

contract LaunchpadTest is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    string public offeringId;
    ITargetNFT public targetNFT;
    uint256 public mintPrice;
    IERC20 public immutable paymentToken;

    event Mint(address indexed minter);

    constructor(
        string memory _offeringId,
        address _targetNFT,
        uint256 _mintPrice,
        IERC20 _paymentToken
    ) Ownable(msg.sender) {
        require(_targetNFT != address(0), "Invalid targetNFT address");
        offeringId = _offeringId;
        targetNFT = ITargetNFT(_targetNFT);
        mintPrice = _mintPrice;
        paymentToken = _paymentToken;
    }




    function mint() external payable nonReentrant {
        if (address(paymentToken) == address(0)) {
            require(msg.value == mintPrice, "Incorrect msg value");
        } else {
            paymentToken.safeTransferFrom(msg.sender, address(this), mintPrice);
        }

        if (address(paymentToken) == address(0)) {
            targetNFT.mint{value: msg.value}(msg.sender);
        }else{
            targetNFT.mint(msg.sender);
        }
        emit Mint(msg.sender);
    }
}