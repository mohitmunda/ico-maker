pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "eth-token-recover/contracts/TokenRecover.sol";
import "../../access/roles/OperatorRole.sol";

/**
 * @title Contributions
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Utility contract where to save any information about Crowdsale contributions
 */
contract Contributions is OperatorRole, TokenRecover {

  using SafeMath for uint256;

  struct Contributor {
    uint256 weiAmount;
    uint256 tokenAmount;
  }

  uint256 public totalSoldTokens;
  uint256 public totalWeiRaised;
  mapping(address => Contributor) public contributors;
  address[] public addresses;

  constructor() public {}

  /**
   * @dev add contribution into the contributions array
   * @param _address Address being contributing
   * @param _weiAmount Amount of wei contributed
   * @param _tokenAmount Amount of token received
   */
  function addBalance(
    address _address,
    uint256 _weiAmount,
    uint256 _tokenAmount
  )
    public
    onlyOperator
  {
    if (contributors[_address].weiAmount == 0) {
      addresses.push(_address);
    }
    // solium-disable-next-line max-len
    contributors[_address].weiAmount = contributors[_address].weiAmount.add(_weiAmount);
    totalWeiRaised = totalWeiRaised.add(_weiAmount);

    // solium-disable-next-line max-len
    contributors[_address].tokenAmount = contributors[_address].tokenAmount.add(_tokenAmount);
    totalSoldTokens = totalSoldTokens.add(_tokenAmount);
  }

  /**
   * @dev get wei contribution for the given address
   * @param _address Address has contributed
   * @return uint256
   */
  function weiContribution(
    address _address
  )
    public
    view
    returns (uint256)
  {
    return contributors[_address].weiAmount;
  }

  /**
   * @dev get token balance for the given address
   * @param _address Address has contributed
   * @return uint256
   */
  function tokenBalance(
    address _address
  )
    public
    view
    returns (uint256)
  {
    return contributors[_address].tokenAmount;
  }

  /**
   * @dev return the contributions length
   * @return uint
   */
  function getContributorsLength() public view returns (uint) {
    return addresses.length;
  }

  function removeOperator(address account) public onlyOwner {
    _removeOperator(account);
  }
}
