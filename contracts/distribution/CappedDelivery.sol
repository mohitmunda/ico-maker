pragma solidity ^0.4.25;

import "../token/BaseToken.sol";

/**
 * @title CappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transfer function
 */
contract CappedDelivery is TokenRecover {

  using SafeMath for uint256;

  BaseToken internal _token;

  uint256 private _cap;
  bool private _allowMultipleSend;

  uint256 private _distributedTokens;
  mapping (address => uint256) private _receivedTokens;

  /**
   * @param token Address of the token being distributed
   * @param cap Max amount of token to be distributed
   * @param allowMultipleSend Allow multiple send to same address
   */
  constructor(address token, uint256 cap, bool allowMultipleSend) public {
    require(token != address(0));
    require(cap > 0);

    _token = BaseToken(token);
    _cap = cap;
    _allowMultipleSend = allowMultipleSend;
  }

  function token() public view returns(BaseToken) {
    return _token;
  }

  function cap() public view returns(uint256) {
    return _cap;
  }

  function allowMultipleSend() public view returns(bool) {
    return _allowMultipleSend;
  }

  function distributedTokens() public view returns(uint256) {
    return _distributedTokens;
  }

  function receivedTokens(address to) public view returns(uint256) {
    return _receivedTokens[to];
  }

  function multiSend(address[] addresses, uint256[] amounts) public onlyOwner {
    require(addresses.length > 0);
    require(amounts.length > 0);
    require(addresses.length == amounts.length);

    for (uint i = 0; i < addresses.length; i++) {
      address to = addresses[i];
      uint256 amount = amounts[i];

      if (_allowMultipleSend || _receivedTokens[to] == 0) {
        _receivedTokens[to] = _receivedTokens[to].add(amount);
        _distributedTokens = _distributedTokens.add(amount);

        require(_distributedTokens <= _cap);

        _distributeTokens(to, amount);
      }
    }
  }

  function remainingTokens() public view returns(uint256) {
    return _cap.sub(_distributedTokens);
  }

  function _distributeTokens(address to, uint256 amount) internal {
    _token.transfer(to, amount);
  }
}
