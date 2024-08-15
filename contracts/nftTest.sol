// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract nftTest is ERC721, Ownable {
    using SafeERC20 for IERC20;

    uint256 private _nextTokenId;
    IERC20 public immutable paymentToken;
    uint256 public mintPrice;

    constructor(
        uint256 _mintPrice,
        IERC20 _paymentToken)
    ERC721("MyToken", "MTK") Ownable(msg.sender){
        mintPrice = _mintPrice;
        paymentToken = _paymentToken;
    }

    function mint(address to) external payable {
        if (address(paymentToken) == address(0)) {
            require(msg.value == mintPrice, "Incorrect msg value");
        } else {
            paymentToken.safeTransferFrom(msg.sender, address(this), mintPrice);
        }
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}