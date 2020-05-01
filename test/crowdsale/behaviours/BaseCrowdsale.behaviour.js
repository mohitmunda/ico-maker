const { BN, ether } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const { shouldBehaveLikeCrowdsale } = require('./Crowdsale.behaviour');

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

      it('weiContribution should be zero', async function () {
        expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(new BN(0));
      });
    });

    describe('accepting payments', function () {
      function checkPaymentBehaviours () {
        it('should increase investorsNumber', async function () {
          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(new BN(1));
        });

        it('investorExists should be true', async function () {
          expect(await this.crowdsale.investorExists(investor)).to.be.equal(true);
        });

        it('weiContribution should be right set', async function () {
          expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(value);
        });
      }

      describe('high-level purchase', function () {
        beforeEach(async function () {
          await this.crowdsale.sendTransaction({ value, from: investor });
        });

        checkPaymentBehaviours();
      });

      describe('low-level purchase', function () {
        beforeEach(async function () {
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
        });

        checkPaymentBehaviours();
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeBaseCrowdsale,
};
