# ICO Maker

[![NPM Package](https://img.shields.io/npm/v/ico-maker.svg?style=flat-square)](https://www.npmjs.org/package/ico-maker)
[![Build Status](https://travis-ci.org/vittominacori/ico-maker.svg?branch=master)](https://travis-ci.org/vittominacori/ico-maker)
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/ico-maker/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/ico-maker?branch=master)
[![MIT licensed](https://img.shields.io/github/license/vittominacori/ico-maker.svg)](https://github.com/vittominacori/ico-maker/blob/master/LICENSE)

Smart Contracts to build your ICO solution and issue your ERC20 Token

## Prerequisites

Install Truffle if you want to run your own node

```bash
npm install -g truffle
```

Create your Smart Contracts folder and init Truffle

```bash
mkdir MyICO
cd MyICO
truffle init
npm init -y
```

## Install

```bash
npm install ico-maker
```

## Usage

### BaseERC20Token.sol

[BaseERC20Token](https://github.com/vittominacori/ico-maker/blob/master/contracts/token/ERC20/BaseERC20Token.sol) is an ERC20 token with a lot of stuffs like Capped, Mintable, Burnable behaviours.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/token/ERC20/BaseERC20Token.sol";

contract MyToken is BaseERC20Token {
  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 cap,
    uint256 initialSupply
  )
    public
    BaseERC20Token(name, symbol, decimals, cap, initialSupply)
  {}
}
```

### BaseERC1363Token.sol

[BaseERC1363Token](https://github.com/vittominacori/ico-maker/blob/master/contracts/token/ERC1363/BaseERC1363Token.sol) is a BaseERC20Token token with a ERC1363 Payable Token behaviours.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/token/ERC1363/BaseERC1363Token.sol";

contract MyToken is BaseERC1363Token {
  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 cap,
    uint256 initialSupply
  )
    public
    BaseERC1363Token(name, symbol, decimals, cap, initialSupply)
  {}
}
```

### Contributions.sol

[Contributions](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/utils/Contributions.sol) is an utility Smart Contract where to store additional data about crowdsale like the wei contributed or the token balance of each address.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/crowdsale/utils/Contributions.sol";

contract MyContributions is Contributions {}
```

### BaseCrowdsale.sol

[BaseCrowdsale](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/BaseCrowdsale.sol) is an extensible Crowdsale contract with Timed and Capped behaviours.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/crowdsale/BaseCrowdsale.sol";

contract MyCrowdsale is BaseCrowdsale {
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
  {}
}
```

### MintedBaseCrowdsale.sol

[MintedBaseCrowdsale](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/MintedBaseCrowdsale.sol) is an extensible BaseCrowdsale contract with Minted behaviours.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/crowdsale/MintedBaseCrowdsale.sol";

contract MyCrowdsale is MintedBaseCrowdsale {
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
    MintedBaseCrowdsale(
      openingTime,
      closingTime,
      rate,
      wallet,
      cap,
      minimumContribution,
      token,
      contributions
    )
  {}
}
```

### CappedDelivery.sol

[CappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/CappedDelivery.sol) is a Capped Smart Contract to transfer tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/distribution/CappedDelivery.sol";

contract MyAirdrop is CappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend)
    public
    CappedDelivery(token, cap, allowMultipleSend)
  {}
}
```

### MintedCappedDelivery.sol

[MintedCappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/MintedCappedDelivery.sol) is a Capped Smart Contract to mint tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/distribution/MintedCappedDelivery.sol";

contract MyAirdrop is MintedCappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend)
    public
    MintedCappedDelivery(token, cap, allowMultipleSend)
  {}
}
```

### SpenderCappedDelivery.sol

[SpenderCappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/SpenderCappedDelivery.sol) is a Capped Smart Contract to transferFrom tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/distribution/SpenderCappedDelivery.sol";

contract MyAirdrop is SpenderCappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend, address wallet)
    public
    SpenderCappedDelivery(token, cap, allowMultipleSend, wallet)
  {}
}
```

### BaseTimelock.sol

[BaseTimelock](https://github.com/vittominacori/ico-maker/blob/master/contracts/token/ERC20/BaseTimelock.sol) is a TokenTimelock which is a token holder contract that will allow a beneficiary to extract the tokens after a given release time.

```solidity
pragma solidity ^0.5.15;

import "ico-maker/contracts/token/ERC20/BaseTimelock.sol";

contract MyTimelock is BaseTimelock {
  constructor(
    IERC20 token,
    address beneficiary,
    uint256 releaseTime
  )
    public
    BaseTimelock(token, beneficiary, releaseTime)
  {}
}
```

## Development

### Install dependencies

```bash
npm install
```

### Usage (using Truffle)

Open the Truffle console

```bash
npm run console
```

#### Compile

```bash
npm run compile
```

#### Test

```bash
npm run test
```

### Usage (using Buidler)

Open the Buidler console

```bash
npm run buidler:console
```

#### Compile

```bash
npm run buidler:compile
```

#### Test

```bash
npm run buidler:test
```

## Linter

Use Solhint

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use ESLint and fix

```bash
npm run lint:fix
```

## License

Code released under the [MIT License](https://github.com/vittominacori/ico-maker/blob/master/LICENSE).
