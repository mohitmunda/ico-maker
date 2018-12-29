pragma solidity ^0.4.25;

import "./CappedDelivery.sol";

/**
 * @title MintedCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by mint function
 */
contract MintedCappedDelivery is CappedDelivery {

  /**
   * @param _token Address of the token being distributed
   * @param _cap Max amount of token to be distributed
   * @param _allowMultipleSend Allow multiple send to same address
   */
  constructor(address _token, uint256 _cap, bool _allowMultipleSend)
    CappedDelivery(_token, _cap, _allowMultipleSend)
    public
  {}

  function _distributeTokens(address _to, uint256 _amount) internal {
    token.mint(_to, _amount);
  }
}
