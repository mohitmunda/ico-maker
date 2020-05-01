# ICO Maker

[![NPM Package](https://img.shields.io/npm/v/ico-maker.svg?style=flat-square)](https://www.npmjs.org/package/ico-maker)
[![Build Status](https://travis-ci.org/vittominacori/ico-maker.svg?branch=master)](https://travis-ci.org/vittominacori/ico-maker)
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/ico-maker/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/ico-maker?branch=master)
[![MIT licensed](https://img.shields.io/github/license/vittominacori/ico-maker.svg)](https://github.com/vittominacori/ico-maker/blob/master/LICENSE)

Smart Contracts to build your Crowdsale solution

## Install

```bash
npm install ico-maker
```

## Usage

### BaseCrowdsale.sol

[BaseCrowdsale](https://github.com/vittominacori/ico-maker/blob/master/contracts/crowdsale/BaseCrowdsale.sol) is an extensible Crowdsale contract with Timed and Capped behaviours.

```solidity
pragma solidity ^0.6.0;

import "ico-maker/contracts/crowdsale/BaseCrowdsale.sol";

contract MyCrowdsale is BaseCrowdsale {
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    )
    public BaseCrowdsale(rate, wallet, token) {}
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
