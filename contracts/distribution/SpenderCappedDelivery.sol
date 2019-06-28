pragma solidity ^0.5.10;

import "./CappedDelivery.sol";

/**
 * @title SpenderCappedDelivery
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Contract to distribute tokens by transferFrom function
 */
contract SpenderCappedDelivery is CappedDelivery {

    // wallet where to transfer the tokens from
    address private _wallet;

    /**
     * @param token Address of the token being distributed
     * @param cap Max amount of token to be distributed
     * @param allowMultipleSend Allow multiple send to same address
     * @param wallet Address where are tokens stored
     */
    constructor(
        address token,
        uint256 cap,
        bool allowMultipleSend,
        address wallet
    )
        public
        CappedDelivery(token, cap, allowMultipleSend)
    {
        require(wallet != address(0));
        _wallet = wallet;
    }

    /**
     * @return wallet where to transfer the tokens from
     */
    function wallet() public view returns (address) {
        return _wallet;
    }

    /**
     * @dev distribute token
     * @param account Address being distributing
     * @param amount Amount of token distributed
     */
    function _distributeTokens(address account, uint256 amount) internal {
        _token.transferFrom(_wallet, account, amount);
    }
}
