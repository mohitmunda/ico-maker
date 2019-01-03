pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol"; // solium-disable-line max-len
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol"; // solium-disable-line max-len
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol"; // solium-disable-line max-len
import "./utils/Contributions.sol";

/**
 * @title BaseCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Extends from Crowdsale with more stuffs like TimedCrowdsale, MintedCrowdsale, TokenCappedCrowdsale.
 *  Base for any other Crowdsale contract
 */
contract BaseCrowdsale is TimedCrowdsale, CappedCrowdsale, MintedCrowdsale, TokenRecover { // solium-disable-line max-len

  Contributions private _contributions;

  uint256 private _minimumContribution;

  /**
   * @dev Reverts if less than minimum contribution
   */
  modifier onlyGreaterThanMinimum(uint256 weiAmount) {
    require(weiAmount >= _minimumContribution);
    _;
  }

  /**
   * @param openingTime Crowdsale opening time
   * @param closingTime Crowdsale closing time
   * @param rate Number of token units a buyer gets per wei
   * @param wallet Address where collected funds will be forwarded to
   * @param cap Max amount of wei to be contributed
   * @param minimumContribution Min amount of wei to be contributed
   * @param token Address of the token being sold
   * @param contributions Address of the contributions contract
   */
  constructor(
    uint256 openingTime,
    uint256 closingTime,
    uint256 rate,
    address wallet,
    uint256 cap,
    uint256 minimumContribution,
    address token,
    address contributions
  )
    Crowdsale(rate, wallet, ERC20(token))
    TimedCrowdsale(openingTime, closingTime)
    CappedCrowdsale(cap)
    public
  {
    require(contributions != address(0));
    _contributions = Contributions(contributions);
    _minimumContribution = minimumContribution;
  }

  /**
   * @return the crowdsale contributions
   */
  function contributions() public view returns(Contributions) {
    return _contributions;
  }

  /**
   * @return the crowdsale minimum contribution
   */
  function minimumContribution() public view returns(uint256) {
    return _minimumContribution;
  }

  /**
   * @dev false if the ico is not started, true if the ico is started and running, true if the ico is completed
   */
  function started() public view returns(bool) {
    // solium-disable-next-line security/no-block-members
    return block.timestamp >= openingTime();
  }

  /**
   * @dev false if the ico is not started, false if the ico is started and running, true if the ico is completed
   */
  function ended() public view returns(bool) {
    return hasClosed() || capReached();
  }

  /**
   * @dev Extend parent behavior requiring purchase to respect the minimumContribution.
   * @param beneficiary Token purchaser
   * @param weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(
    address beneficiary,
    uint256 weiAmount
  )
    internal
    onlyGreaterThanMinimum(weiAmount)
    view
  {
    super._preValidatePurchase(beneficiary, weiAmount);
  }

  /**
   * @dev Update the contributions contract states
   * @param beneficiary Address receiving the tokens
   * @param weiAmount Value in wei involved in the purchase
   */
  function _updatePurchasingState(
    address beneficiary,
    uint256 weiAmount
  )
    internal
  {
    super._updatePurchasingState(beneficiary, weiAmount);
    _contributions.addBalance(
      beneficiary,
      weiAmount,
      _getTokenAmount(weiAmount)
    );
  }
}
