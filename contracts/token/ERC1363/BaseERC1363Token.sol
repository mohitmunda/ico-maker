pragma solidity ^0.5.5;

import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";
import "../ERC20/BaseERC20Token.sol";

/**
 * @title BaseERC1363Token
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation of the BaseERC20Token with ERC1363 behaviours
 */
contract BaseERC1363Token is BaseERC20Token, ERC1363 {

    /**
     * @param name Name of the token
     * @param symbol A symbol to be used as ticker
     * @param decimals Number of decimals. All the operations are done using the smallest and indivisible token unit
     * @param cap Maximum number of tokens mintable
     * @param initialSupply Initial token supply
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 cap,
        uint256 initialSupply
    )
        public
        BaseERC20Token(name, symbol, decimals, cap, initialSupply)
    {} // solhint-disable-line no-empty-blocks
}
