const { BN, constants, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeCrowdsale } = require('./behaviours/Crowdsale.behaviour');

const BaseCrowdsale = artifacts.require('BaseCrowdsale');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('BaseCrowdsale', function ([owner, investor, wallet, purchaser, thirdParty]) {
  const rate = new BN(1);
  const tokenSupply = new BN('10').pow(new BN('22'));

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  context('like a BaseCrowdsale', function () {
    describe('creating a valid crowdsale', function () {
      it('requires a non-null token', async function () {
        await expectRevert(
          BaseCrowdsale.new(rate, wallet, ZERO_ADDRESS),
          'Crowdsale: token is the zero address',
        );
      });

      context('with token', async function () {
        beforeEach(async function () {
          this.token = await ERC20Mock.new('TEST', 'TEST', owner, tokenSupply);
        });

        it('requires a non-zero rate', async function () {
          await expectRevert(
            BaseCrowdsale.new(0, wallet, this.token.address),
            'Crowdsale: rate is 0',
          );
        });

        it('requires a non-null wallet', async function () {
          await expectRevert(
            BaseCrowdsale.new(rate, ZERO_ADDRESS, this.token.address),
            'Crowdsale: wallet is the zero address',
          );
        });

        context('once deployed', async function () {
          beforeEach(async function () {
            this.crowdsale = await BaseCrowdsale.new(rate, wallet, this.token.address);
            await this.token.transfer(this.crowdsale.address, tokenSupply);
          });

          context('like a Crowdsale', async function () {
            shouldBehaveLikeCrowdsale(
              [owner, investor, wallet, purchaser, thirdParty],
              { rate },
            );
          });
        });
      });
    });
  });
});
