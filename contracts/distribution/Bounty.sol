pragma solidity ^0.4.24;

import "../token/BaseToken.sol";

/**
 * @title Bounty
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by mint function
 */
contract Bounty is TokenRecover {

  using SafeMath for uint256;

  BaseToken public token;

  uint256 public cap;
  uint256 public distributedTokens;
  mapping (address => uint256) public receivedTokens;

  /**
   * @param _token Address of the token being distributed
   * @param _cap Max amount of token to be distributed
   */
  constructor(address _token, uint256 _cap) public {
    require(_token != address(0));
    require(_cap > 0);

    token = BaseToken(_token);
    cap = _cap;
  }

  function multiSend(address[] addresses, uint256[] amounts) public onlyOwner {
    require(addresses.length > 0);
    require(amounts.length > 0);
    require(addresses.length == amounts.length);

    for (uint i = 0; i < addresses.length; i++) {
      address to = addresses[i];
      uint256 value = amounts[i];

      receivedTokens[to] = receivedTokens[to].add(value);
      distributedTokens = distributedTokens.add(value);

      require(distributedTokens <= cap);

      token.mint(to, value);
    }
  }

  function remainingTokens() public view returns(uint256) {
    return cap.sub(distributedTokens);
  }
}
