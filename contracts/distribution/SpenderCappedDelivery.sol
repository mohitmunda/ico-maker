pragma solidity ^0.4.24;

import "./CappedDelivery.sol";

/**
 * @title SpenderCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transferFrom function
 */
contract SpenderCappedDelivery is CappedDelivery {

  address public wallet;

  /**
   * @param _token Address of the token being distributed
   * @param _cap Max amount of token to be distributed
   * @param _allowMultipleSend Allow multiple send to same address
   * @param _wallet Address where are tokens stored
   */
  constructor(
    address _token,
    uint256 _cap,
    bool _allowMultipleSend,
    address _wallet
  )
    CappedDelivery(_token, _cap, _allowMultipleSend)
    public
  {
    require(_wallet != address(0));

    wallet = _wallet;
  }

  function _distributeTokens(address _to, uint256 _amount) internal {
    token.transferFrom(wallet, _to, _amount);
  }
}
