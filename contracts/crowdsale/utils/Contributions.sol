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

  uint256 private _totalSoldTokens;
  uint256 private _totalWeiRaised;
  address[] private _addresses;

  mapping(address => Contributor) private _contributors;

  constructor() public {}

  function totalSoldTokens() public view returns(uint256) {
    return _totalSoldTokens;
  }

  function totalWeiRaised() public view returns(uint256) {
    return _totalWeiRaised;
  }

  function addresses(uint256 index) public view returns(address) {
    return _addresses[index];
  }

  /**
   * @dev add contribution into the contributions array
   * @param account Address being contributing
   * @param weiAmount Amount of wei contributed
   * @param tokenAmount Amount of token received
   */
  function addBalance(
    address account,
    uint256 weiAmount,
    uint256 tokenAmount
  )
    public
    onlyOperator
  {
    if (_contributors[account].weiAmount == 0) {
      _addresses.push(account);
    }
    // solium-disable-next-line max-len
    _contributors[account].weiAmount = _contributors[account].weiAmount.add(weiAmount);
    _totalWeiRaised = _totalWeiRaised.add(weiAmount);

    // solium-disable-next-line max-len
    _contributors[account].tokenAmount = _contributors[account].tokenAmount.add(tokenAmount);
    _totalSoldTokens = _totalSoldTokens.add(tokenAmount);
  }

  /**
   * @dev get wei contribution for the given address
   * @param account Address has contributed
   * @return uint256
   */
  function weiContribution(
    address account
  )
    public
    view
    returns (uint256)
  {
    return _contributors[account].weiAmount;
  }

  /**
   * @dev get token balance for the given address
   * @param account Address has contributed
   * @return uint256
   */
  function tokenBalance(
    address account
  )
    public
    view
    returns (uint256)
  {
    return _contributors[account].tokenAmount;
  }

  /**
   * @dev return the contributions length
   * @return uint
   */
  function getContributorsLength() public view returns (uint) {
    return _addresses.length;
  }

  function removeOperator(address account) public onlyOwner {
    _removeOperator(account);
  }
}
