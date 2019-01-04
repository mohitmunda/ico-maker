pragma solidity ^0.4.25;

import "./CappedDelivery.sol";

/**
 * @title SpenderCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transferFrom function
 */
contract SpenderCappedDelivery is CappedDelivery {

  address private _wallet;

  /**
   * @param token Address of the token being distributed
   * @param cap Max amount of token to be distributed
   * @param allowMultipleSend Allow multiple send to same address
   * @param wallet Address where are tokens stored
   */
  constructor(
    address token,
    uint256 cap,
    bool allowMultipleSend,
    address wallet
  )
    CappedDelivery(token, cap, allowMultipleSend)
    public
  {
    require(wallet != address(0));
    _wallet = wallet;
  }

  function wallet() public view returns(address) {
    return _wallet;
  }

  function _distributeTokens(address to, uint256 amount) internal {
    _token.transferFrom(_wallet, to, amount);
  }
}
