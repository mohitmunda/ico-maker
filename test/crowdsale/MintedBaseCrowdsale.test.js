const { BN, constants, ether, expectRevert, time } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeMintedBaseCrowdsale } = require('./behaviours/MintedBaseCrowdsale.behaviour');

const MintedBaseCrowdsale = artifacts.require('MintedBaseCrowdsale');
const BaseToken = artifacts.require('BaseERC20Token');
const Contributions = artifacts.require('Contributions');

contract('MintedBaseCrowdsale', function ([owner, investor, wallet, purchaser, thirdParty]) {
  const _name = 'BaseToken';
  const _symbol = 'ERC20';
  const _decimals = new BN(18);
  const _cap = ether('1000');
  const _initialSupply = new BN(0);

  const rate = new BN(1000);
  const cap = ether('1');
  const minimumContribution = ether('0.2');

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.openingTime = (await time.latest()).add(time.duration.weeks(1));
    this.closingTime = this.openingTime.add(time.duration.weeks(1));
    this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));

    this.token = await BaseToken.new(_name, _symbol, _decimals, _cap, _initialSupply);
    this.contributions = await Contributions.new();
    this.crowdsale = await MintedBaseCrowdsale.new(
      this.openingTime,
      this.closingTime,
      rate,
      wallet,
      cap,
      minimumContribution,
      this.token.address,
      this.contributions.address,
    );

    await this.token.addMinter(this.crowdsale.address);
    await this.contributions.addOperator(this.crowdsale.address);
  });

  context('like a MintedBaseCrowdsale', function () {
    describe('creating a valid crowdsale', function () {
      it('should be token minter', async function () {
        const isMinter = await this.token.isMinter(this.crowdsale.address);
        isMinter.should.equal(true);
      });

      it('contributions should be right set', async function () {
        const contributions = await this.crowdsale.contributions();
        contributions.should.be.equal(this.contributions.address);
      });

      it('cap should be right set', async function () {
        const expectedCap = await this.crowdsale.cap();
        cap.should.be.bignumber.equal(expectedCap);
      });

      it('minimum contribution should be right set', async function () {
        const expectedMinimumContribution = await this.crowdsale.minimumContribution();
        expectedMinimumContribution.should.be.bignumber.equal(minimumContribution);
      });

      it('should fail with zero rate', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.openingTime,
            this.closingTime,
            0,
            wallet,
            cap,
            minimumContribution,
            this.token.address,
            this.contributions.address,
          ),
        );
      });

      it('should fail if wallet is the zero address', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.openingTime,
            this.closingTime,
            rate,
            ZERO_ADDRESS,
            cap,
            minimumContribution,
            this.token.address,
            this.contributions.address,
          ),
        );
      });

      it('should fail if token is the zero address', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.openingTime,
            this.closingTime,
            rate,
            wallet,
            cap,
            minimumContribution,
            ZERO_ADDRESS,
            this.contributions.address,
          ),
        );
      });

      it('should fail if opening time is in the past', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            (await time.latest()).sub(time.duration.seconds(1)),
            this.closingTime,
            rate,
            wallet,
            cap,
            minimumContribution,
            this.token.address,
            this.contributions.address,
          ),
        );
      });

      it('should fail if opening time is after closing time in the past', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.closingTime,
            this.openingTime,
            rate,
            wallet,
            cap,
            minimumContribution,
            this.token.address,
            this.contributions.address,
          ),
        );
      });

      it('should fail if contributions is the zero address', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.openingTime,
            this.closingTime,
            rate,
            wallet,
            cap,
            minimumContribution,
            this.token.address,
            ZERO_ADDRESS,
          ),
        );
      });

      it('should fail with zero cap', async function () {
        await expectRevert.unspecified(
          MintedBaseCrowdsale.new(
            this.openingTime,
            this.closingTime,
            rate,
            wallet,
            0,
            minimumContribution,
            this.token.address,
            this.contributions.address,
          ),
        );
      });
    });

    shouldBehaveLikeMintedBaseCrowdsale([owner, investor, wallet, purchaser, thirdParty], rate, minimumContribution);
  });
});
