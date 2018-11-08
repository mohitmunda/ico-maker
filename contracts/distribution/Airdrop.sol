pragma solidity ^0.4.24;

import "../token/BaseToken.sol";

/**
 * @title Airdrop
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transferFrom function
 */
contract Airdrop is TokenRecover {

  using SafeMath for uint256;

  BaseToken public token;

  address public wallet;
  uint256 public distributedTokens;
  mapping (address => uint256) public receivedTokens;

  /**
   * @param _token Address of the token being distributed
   * @param _wallet Address where are tokens stored
   */
  constructor(address _token, address _wallet) public {
    require(_token != address(0));
    require(_wallet != address(0));

    token = BaseToken(_token);
    wallet = _wallet;
  }

  function multiSend(address[] addresses, uint256[] amounts) public onlyOwner {
    require(addresses.length > 0);
    require(amounts.length > 0);
    require(addresses.length == amounts.length);

    for (uint i = 0; i < addresses.length; i++) {
      address to = addresses[i];
      uint256 value = amounts[i];

      if (receivedTokens[to] == 0) {
        receivedTokens[to] = receivedTokens[to].add(value);
        distributedTokens = distributedTokens.add(value);

        token.transferFrom(wallet, to, value);
      }
    }
  }
}
