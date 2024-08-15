// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { SaleTimes, SaleMode } from "./Para.sol";

// 定义目标 NFT 合约的接口
interface ITargetNFT {
    function mint(address to) external payable;
}

contract Launchpad is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    string public offeringId;
    ITargetNFT public targetNFT;
    SaleMode public saleMode;
    uint256 public startTime;
    uint256 public publicSaleTime;
    uint256 public mintPrice;
    IERC20 public immutable paymentToken;
    address public whitelistSigner;
    uint256 public maxMintPerWallet;
    uint256 public mintedSum;
    uint256 public sum;
    bool public isOpen;
    // 用户铸造的信息
    mapping(address => uint256) public mintedCount;

    event Mint(address indexed minter);
    event SaleDetailsUpdated(uint256 startTime, uint256 publicSaleTime, uint256 mintPrice, address whitelistSigner);

    constructor(
        string memory _offeringId,
        address _targetNFT,
        SaleTimes memory saleTimes,
        uint256 _mintPrice,
        IERC20 _paymentToken,
        address _whitelistSigner,
        uint256 _maxMintPerWallet,
        SaleMode _saleMode,
        uint256 _sum
    ) Ownable(msg.sender) {
        require(_targetNFT != address(0), "Invalid targetNFT address");
        require(_maxMintPerWallet > 0, "Max mint per wallet must be greater than 0");
        if (_saleMode == SaleMode.Whitelist || _saleMode == SaleMode.Mixed) {
            require(_whitelistSigner != address(0), "Whitelist signer cannot be zero address");
        }
        if (_saleMode == SaleMode.Public || _saleMode == SaleMode.Whitelist) {
            require(saleTimes.startTime == saleTimes.publicSaleTime, "StartTime and publicSaleTime must be equal in both Public and Whitelist modes");
        }
        if (_saleMode == SaleMode.Mixed) {
            require(saleTimes.startTime < saleTimes.publicSaleTime, "StartTime needs to be less than publicSaleTime");
        }
        offeringId = _offeringId;
        targetNFT = ITargetNFT(_targetNFT);
        startTime = saleTimes.startTime;
        publicSaleTime = saleTimes.publicSaleTime;
        mintPrice = _mintPrice;
        paymentToken = _paymentToken;
        whitelistSigner = _whitelistSigner;
        maxMintPerWallet = _maxMintPerWallet;
        saleMode = _saleMode;
        sum = _sum;
    }

    modifier onlyDuringSale() {
        require(isOpen, "Sale not active");
        require(block.timestamp >= startTime, "Sale has not started");
        _;
    }
    modifier onlyNotStart() {
        require(block.timestamp < startTime, "Sales have already started and modification is not allowed");
        _;
    }

    function setSaleDetails(
        SaleTimes memory saleTimes,
        uint256 _mintPrice,
        address _whitelistSigner
    ) external onlyOwner onlyNotStart {
        require(block.timestamp < saleTimes.startTime, "StartTime must be a future time");
        if (saleMode == SaleMode.Whitelist || saleMode == SaleMode.Mixed) {
            require(_whitelistSigner != address(0), "Whitelist signer cannot be zero address");
        }
        if (saleMode == SaleMode.Public || saleMode == SaleMode.Whitelist) {
            require(saleTimes.startTime == saleTimes.publicSaleTime, "StartTime should be equal to publicSaleTime");
        }
        if (saleMode == SaleMode.Mixed) {
            require(saleTimes.startTime < saleTimes.publicSaleTime, "StartTime needs to be less than publicSaleTime");
        }
        startTime = saleTimes.startTime;
        publicSaleTime = saleTimes.publicSaleTime;
        mintPrice = _mintPrice;
        whitelistSigner = _whitelistSigner;

        emit SaleDetailsUpdated(startTime, publicSaleTime, mintPrice, whitelistSigner);
    }

    function open() external onlyOwner {
        require(!isOpen, "Project already open");
        isOpen = true;
    }

    function close() external onlyOwner {
        isOpen = false;
    }

    function mint(bytes calldata signature) external payable onlyDuringSale nonReentrant {
        require(sum > mintedSum, "Insufficient number of NFTs");
        require(mintedCount[msg.sender] < maxMintPerWallet, "Mint limit reached");

        if (address(paymentToken) == address(0)) {
            require(msg.value == mintPrice, "Incorrect msg value");
        } else {
            paymentToken.safeTransferFrom(msg.sender, address(this), mintPrice);
        }

        if (saleMode == SaleMode.Whitelist || (saleMode == SaleMode.Mixed && block.timestamp < publicSaleTime)) {
            require(_isValidSignature(msg.sender, signature), "Not whitelisted");
        }

        mintedCount[msg.sender]++;
        mintedSum++;
        if (address(paymentToken) == address(0)) {
            targetNFT.mint{value: msg.value}(msg.sender);
        }else{
            targetNFT.mint(msg.sender);
        }

        emit Mint(msg.sender);
    }

    function _isValidSignature(address user, bytes memory signature) internal view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(user, address(this), block.chainid));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        return ethSignedMessageHash.recover(signature) == whitelistSigner;
    }

    function authorizeTransfer(uint256 amount) external onlyOwner {
        require(paymentToken.approve(address(targetNFT), amount), "Approve failed");
    }
}