const { BN, constants, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeBaseCrowdsale } = require('./behaviours/BaseCrowdsale.behaviour');

const BaseCrowdsale = artifacts.require('BaseCrowdsale');
const BaseToken = artifacts.require('BaseERC20Token');
const Contributions = artifacts.require('Contributions');

contract('BaseCrowdsale', function ([owner, investor, wallet, purchaser, thirdParty]) {
  const _name = 'BaseToken';
  const _symbol = 'ERC20';
  const _decimals = new BN(18);
  const _cap = ether('1000');
  const _initialSupply = new BN(0);

  const rate = new BN(1000);
  const cap = ether('1');
  const minimumContribution = ether('0.2');

  const totalSupply = cap.mul(rate);

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
    this.crowdsale = await BaseCrowdsale.new(
      this.openingTime,
      this.closingTime,
      rate,
      wallet,
      cap,
      minimumContribution,
      this.token.address,
      this.contributions.address,
    );

    await this.token.mint(this.crowdsale.address, totalSupply);
    await this.token.enableTransfer();

    await this.contributions.addOperator(this.crowdsale.address);
  });

  context('like a BaseCrowdsale', function () {
    describe('creating a valid crowdsale', function () {
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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
          BaseCrowdsale.new(
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

    shouldBehaveLikeBaseCrowdsale([owner, investor, wallet, purchaser, thirdParty], rate, minimumContribution);
  });
});
