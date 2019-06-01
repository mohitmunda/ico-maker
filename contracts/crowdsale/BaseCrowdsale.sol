pragma solidity ^0.5.9;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "./utils/Contributions.sol";

/**
 * @title BaseCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Extends from Crowdsale with more stuffs like TimedCrowdsale, CappedCrowdsale.
 *  Base for any other Crowdsale contract
 */
contract BaseCrowdsale is TimedCrowdsale, CappedCrowdsale, TokenRecover {

    // reference to Contributions contract
    Contributions private _contributions;

    // the minimum value of contribution in wei
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
        address payable wallet,
        uint256 cap,
        uint256 minimumContribution,
        address token,
        address contributions
    )
        public
        Crowdsale(rate, wallet, ERC20(token))
        TimedCrowdsale(openingTime, closingTime)
        CappedCrowdsale(cap)
    {
        require(contributions != address(0));
        _contributions = Contributions(contributions);
        _minimumContribution = minimumContribution;
    }

    /**
     * @return the crowdsale contributions contract address
     */
    function contributions() public view returns (Contributions) {
        return _contributions;
    }

    /**
     * @return the minimum value of contribution in wei
     */
    function minimumContribution() public view returns (uint256) {
        return _minimumContribution;
    }

    /**
     * @return false if the ico is not started, true if the ico is started and running, true if the ico is completed
     */
    function started() public view returns (bool) {
        return block.timestamp >= openingTime(); // solhint-disable-line not-rely-on-time
    }

    /**
     * @return false if the ico is not started, false if the ico is started and running, true if the ico is completed
     */
    function ended() public view returns (bool) {
        return hasClosed() || capReached();
    }

    /**
     * @dev Extend crowdsale closing date
     * @param closingTime Crowdsale closing time
     */
    function extendTime(uint256 closingTime) public onlyOwner {
        _extendTime(closingTime);
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the minimumContribution.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal onlyGreaterThanMinimum(weiAmount) view { // solhint-disable-line max-line-length
        super._preValidatePurchase(beneficiary, weiAmount);
    }

    /**
     * @dev Update the contributions contract states
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal {
        super._updatePurchasingState(beneficiary, weiAmount);
        _contributions.addBalance(
            beneficiary,
            weiAmount,
            _getTokenAmount(weiAmount)
        );
    }
}
