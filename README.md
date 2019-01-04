# ICO Maker

[![NPM Package](https://img.shields.io/npm/v/ico-maker.svg?style=flat-square)](https://www.npmjs.org/package/ico-maker)
[![Build Status](https://travis-ci.org/vittominacori/ico-maker.svg?branch=master)](https://travis-ci.org/vittominacori/ico-maker) 
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/ico-maker/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/ico-maker?branch=master)

Smart Contracts to build your ICO solution and issue your ERC20 Token.

## Prerequisites

Install truffle.

```bash
npm install -g truffle      // Version 4.1.15+ required.
```

Create your Smart Contracts folder and init truffle

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

### BaseToken.sol

[BaseToken](https://github.com/vittominacori/ico-maker/blob/master/contracts/token/BaseToken.sol) is an ERC20 token with a lot of stuffs like Capped, Mintable, Burnable and ERC1363 Payable Token behaviours.

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/token/BaseToken.sol";

contract MyToken is BaseToken {
  constructor(
    string name,
    string symbol,
    uint8 decimals,
    uint256 cap
  )
    BaseToken(name, symbol, decimals, cap)
    public
  {}
}
```

### Contributions.sol

[Contributions](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/utils/Contributions.sol) is an utility Smart Contract where to store additional data about crowdsale like the wei contributed or the token balance of each address.

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/crowdsale/utils/Contributions.sol";

contract MyContributions is Contributions {}
```

### BaseCrowdsale.sol

[BaseCrowdsale](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/BaseCrowdsale.sol) is an extensible Crowdsale contract with Timed and Capped behaviours.

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/crowdsale/BaseCrowdsale.sol";

contract MyCrowdsale is BaseCrowdsale {
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
    public
  {}
}
```

### CappedDelivery.sol

[CappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/CappedDelivery.sol) is a Capped Smart Contract to transfer tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/distribution/CappedDelivery.sol";

contract MyAirdrop is CappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend)
    CappedDelivery(token, cap, allowMultipleSend)
    public
  {}
}
```

### MintedCappedDelivery.sol

[MintedCappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/MintedCappedDelivery.sol) is a Capped Smart Contract to mint tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/distribution/MintedCappedDelivery.sol";

contract MyAirdrop is MintedCappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend)
    MintedCappedDelivery(token, cap, allowMultipleSend)
    public
  {}
}
```

### SpenderCappedDelivery.sol

[SpenderCappedDelivery](https://github.com/vittominacori/ico-maker/blob/master/contracts/distribution/SpenderCappedDelivery.sol) is a Capped Smart Contract to transferFrom tokens (i.e. for Airdrop or Bounty Program).

```solidity
pragma solidity ^0.4.25;

import "ico-maker/contracts/distribution/SpenderCappedDelivery.sol";

contract MyAirdrop is SpenderCappedDelivery {
  constructor(address token, uint256 cap, bool allowMultipleSend, address wallet)
    SpenderCappedDelivery(token, cap, allowMultipleSend, wallet)
    public
  {}
}
```

## Development

Install truffle.

```bash
npm install -g truffle      // Version 4.1.15+ required.
```

### Install dependencies

```bash
npm install
```

### Linter

Use Ethlint

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use both and fix

```bash
npm run lint:fix
```

### Compile and test the contracts.
 
Open the Truffle console

```bash
truffle develop
```

Compile 

```bash
compile 
```

Test

```bash
test
```

### Optional

Install the [truffle-flattener](https://github.com/alcuadrado/truffle-flattener)

```bash
npm install -g truffle-flattener
```

Usage 

```bash
truffle-flattener contracts/token/BaseToken.sol > .dist/BaseToken.dist.sol
```

### License

Code released under the [MIT License](https://github.com/vittominacori/ico-maker/blob/master/LICENSE).
