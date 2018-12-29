pragma solidity ^0.4.25;

import "../token/BaseToken.sol";

/**
 * @title CappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transfer function
 */
contract CappedDelivery is TokenRecover {

  using SafeMath for uint256;

  BaseToken public token;

  uint256 public cap;
  bool public allowMultipleSend;

  uint256 public distributedTokens;
  mapping (address => uint256) public receivedTokens;

  /**
   * @param _token Address of the token being distributed
   * @param _cap Max amount of token to be distributed
   * @param _allowMultipleSend Allow multiple send to same address
   */
  constructor(address _token, uint256 _cap, bool _allowMultipleSend) public {
    require(_token != address(0));
    require(_cap > 0);

    token = BaseToken(_token);
    cap = _cap;
    allowMultipleSend = _allowMultipleSend;
  }

  function multiSend(address[] addresses, uint256[] amounts) public onlyOwner {
    require(addresses.length > 0);
    require(amounts.length > 0);
    require(addresses.length == amounts.length);

    for (uint i = 0; i < addresses.length; i++) {
      address to = addresses[i];
      uint256 amount = amounts[i];

      if (allowMultipleSend || receivedTokens[to] == 0) {
        receivedTokens[to] = receivedTokens[to].add(amount);
        distributedTokens = distributedTokens.add(amount);

        require(distributedTokens <= cap);

        _distributeTokens(to, amount);
      }
    }
  }

  function remainingTokens() public view returns(uint256) {
    return cap.sub(distributedTokens);
  }

  function _distributeTokens(address _to, uint256 _amount) internal {
    token.transfer(_to, _amount);
  }
}
