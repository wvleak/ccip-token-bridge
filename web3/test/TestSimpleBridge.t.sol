// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "../src/SimpleBridge.sol";

contract TestSimpleBridge is Test {
    SimpleBridge public bridge;

    function setUp() public {
        bridge = new SimpleBridge();
    }
}
