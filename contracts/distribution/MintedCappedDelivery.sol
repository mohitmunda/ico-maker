pragma solidity ^0.4.25;

import "./CappedDelivery.sol";

/**
 * @title MintedCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by mint function
 */
contract MintedCappedDelivery is CappedDelivery {

  /**
   * @param token Address of the token being distributed
   * @param cap Max amount of token to be distributed
   * @param allowMultipleSend Allow multiple send to same address
   */
  constructor(address token, uint256 cap, bool allowMultipleSend)
    CappedDelivery(token, cap, allowMultipleSend)
    public
  {}

  function _distributeTokens(address to, uint256 amount) internal {
    _token.mint(to, amount);
  }
}
