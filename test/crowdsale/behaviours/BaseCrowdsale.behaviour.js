const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const { shouldBehaveLikeCrowdsale } = require('./Crowdsale.behaviour');
const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

function shouldBehaveLikeBaseCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  { rate },
) {
  const value = ether('1');

  context('like a Crowdsale', async function () {
    shouldBehaveLikeCrowdsale(
      [owner, investor, wallet, purchaser, thirdParty],
      { rate },
    );
  });

  context('like a BaseCrowdsale', async function () {
    describe('checking properties', function () {
      it('investorsNumber should be zero', async function () {
        expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(new BN(0));
      });

      it('investorExists should be false', async function () {
        expect(await this.crowdsale.investorExists(investor)).to.be.equal(false);
      });

      it('should not get investor by index', async function () {
        await expectRevert(
          this.crowdsale.getInvestorAddress(0),
          'EnumerableSet: index out of bounds',
        );
      });

      it('weiContribution for investor should be zero', async function () {
        expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(new BN(0));
      });
    });

    describe('accepting payments', function () {
      function checkAfterPaymentBehaviours () {
        it('should increase investorsNumber', async function () {
          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(new BN(1));

          await this.crowdsale.sendTransaction({ value, from: purchaser });
          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(new BN(2));
        });

        it('should not increase investorsNumber twice', async function () {
          await this.crowdsale.sendTransaction({ value, from: investor });
          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(new BN(1));
        });

        it('investorExists should be true', async function () {
          expect(await this.crowdsale.investorExists(investor)).to.be.equal(true);
        });

        it('should get investor by index', async function () {
          expect(await this.crowdsale.getInvestorAddress(0)).to.be.equal(investor);
        });

        it('weiContribution for investor should be right set', async function () {
          expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(value);
        });
      }

      describe('high-level purchase', function () {
        beforeEach(async function () {
          await this.crowdsale.sendTransaction({ value, from: investor });
        });

        checkAfterPaymentBehaviours();
      });

      describe('low-level purchase', function () {
        beforeEach(async function () {
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
        });

        checkAfterPaymentBehaviours();
      });
    });
  });

  context('like a TokenRecover', function () {
    beforeEach(async function () {
      this.instance = this.crowdsale;
    });

    shouldBehaveLikeTokenRecover([owner, thirdParty]);
  });
}

module.exports = {
  shouldBehaveLikeBaseCrowdsale,
};
