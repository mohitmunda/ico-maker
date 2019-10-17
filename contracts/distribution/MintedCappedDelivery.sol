pragma solidity ^0.5.12;

import "./CappedDelivery.sol";

/**
 * @title MintedCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by mint function
 */
contract MintedCappedDelivery is CappedDelivery {

    /**
     * @param token Address of the token being distributed
     * @param cap Max amount of token to be distributed
     * @param allowMultipleSend Allow multiple send to same address
     */
    constructor(address token, uint256 cap, bool allowMultipleSend)
        public
        CappedDelivery(token, cap, allowMultipleSend)
    {} // solhint-disable-line no-empty-blocks

    /**
     * @dev distribute token
     * @param account Address being distributing
     * @param amount Amount of token distributed
     */
    function _distributeTokens(address account, uint256 amount) internal {
        _token.mint(account, amount);
    }
}
