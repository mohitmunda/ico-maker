pragma solidity ^0.6.0;

import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "./BaseCrowdsale.sol";

/**
 * @title MintedBaseCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Extends from BaseCrowdsale with more stuffs like MintedCrowdsale.
 */
contract MintedBaseCrowdsale is MintedCrowdsale, BaseCrowdsale {

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
        BaseCrowdsale(
            openingTime,
            closingTime,
            rate,
            wallet,
            cap,
            minimumContribution,
            token,
            contributions
        )
    {} // solhint-disable-line no-empty-blocks
}
