// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct SaleTimes {
    uint256 startTime;
    uint256 publicSaleTime;
}

enum SaleMode { Public, Whitelist, Mixed }