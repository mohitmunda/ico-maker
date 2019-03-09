const { BN, shouldFail, time } = require('openzeppelin-test-helpers');

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');
const { shouldBehaveLikeMintedCrowdsale } = require('./MintedCrowdsale.behaviour');
const { shouldBehaveLikeTimedCrowdsale } = require('./TimedCrowdsale.behaviour');
const { shouldBehaveLikeCappedCrowdsale } = require('./CappedCrowdsale.behaviour');

function shouldBehaveLikeMintedBaseCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  rate,
  minimumContribution
) {
  const value = minimumContribution;

  context('like a TimedCrowdsale', function () {
    shouldBehaveLikeTimedCrowdsale([owner, investor, wallet, purchaser], rate, value);
  });

  context('like a CappedCrowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });
    shouldBehaveLikeCappedCrowdsale([investor, purchaser]);
  });

  context('like a MintedCrowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });
    shouldBehaveLikeMintedCrowdsale([owner, investor, wallet, purchaser], rate, value);
  });

  context('like a BaseCrowdsale', function () {
    describe('high-level purchase', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      it('should add beneficiary to contributions list', async function () {
        let contributorsLength = await this.contributions.getContributorsLength();
        assert.equal(contributorsLength, 0);

        const preTokenBalance = await this.contributions.tokenBalance(investor);
        preTokenBalance.should.be.bignumber.equal(new BN(0));
        const preWeiContribution = await this.contributions.weiContribution(investor);
        preWeiContribution.should.be.bignumber.equal(new BN(0));

        await this.crowdsale.sendTransaction({ value: value, from: investor });

        const postOneTokenBalance = await this.contributions.tokenBalance(investor);
        postOneTokenBalance.should.be.bignumber.equal(value.mul(rate));
        const postOneWeiContribution = await this.contributions.weiContribution(investor);
        postOneWeiContribution.should.be.bignumber.equal(value);

        await this.crowdsale.sendTransaction({ value: value, from: investor });

        const postTwoTokenBalance = await this.contributions.tokenBalance(investor);
        (postTwoTokenBalance.sub(postOneTokenBalance)).should.be.bignumber.equal(value.mul(rate));
        postTwoTokenBalance.should.be.bignumber.equal(value.mul(new BN(2)).mul(rate));
        const postTwoWeiContribution = await this.contributions.weiContribution(investor);
        (postTwoWeiContribution.sub(postOneWeiContribution)).should.be.bignumber.equal(value);
        postTwoWeiContribution.should.be.bignumber.equal(value.mul(new BN(2)));

        contributorsLength = await this.contributions.getContributorsLength();
        assert.equal(contributorsLength, 1);
      });

      it('should fail if less than minimum contribution', async function () {
        await shouldFail.reverting(
          this.crowdsale.sendTransaction({ value: minimumContribution.sub(new BN(1)), from: investor })
        );
      });
    });

    describe('low-level purchase', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      it('should add beneficiary to contributions list', async function () {
        let contributorsLength = await this.contributions.getContributorsLength();
        assert.equal(contributorsLength, 0);

        const preTokenBalance = await this.contributions.tokenBalance(investor);
        preTokenBalance.should.be.bignumber.equal(new BN(0));
        const preWeiContribution = await this.contributions.weiContribution(investor);
        preWeiContribution.should.be.bignumber.equal(new BN(0));

        await this.crowdsale.buyTokens(investor, { value, from: purchaser });

        const postOneTokenBalance = await this.contributions.tokenBalance(investor);
        postOneTokenBalance.should.be.bignumber.equal(value.mul(rate));
        const postOneWeiContribution = await this.contributions.weiContribution(investor);
        postOneWeiContribution.should.be.bignumber.equal(value);

        await this.crowdsale.buyTokens(investor, { value, from: purchaser });

        const postTwoTokenBalance = await this.contributions.tokenBalance(investor);
        (postTwoTokenBalance.sub(postOneTokenBalance)).should.be.bignumber.equal(value.mul(rate));
        postTwoTokenBalance.should.be.bignumber.equal(value.mul(new BN(2)).mul(rate));
        const postTwoWeiContribution = await this.contributions.weiContribution(investor);
        (postTwoWeiContribution.sub(postOneWeiContribution)).should.be.bignumber.equal(value);
        postTwoWeiContribution.should.be.bignumber.equal(value.mul(new BN(2)));

        contributorsLength = await this.contributions.getContributorsLength();
        assert.equal(contributorsLength, 1);
      });

      it('should fail if less than minimum contribution', async function () {
        await shouldFail.reverting(
          this.crowdsale.buyTokens(investor, { value: minimumContribution.sub(new BN(1)), from: purchaser })
        );
      });
    });

    context('check statuses', function () {
      describe('before start', function () {
        it('started should be false', async function () {
          const toTest = await this.crowdsale.started();
          assert.equal(toTest, false);
        });

        it('ended should be false', async function () {
          const toTest = await this.crowdsale.ended();
          assert.equal(toTest, false);
        });

        it('capReached should be false', async function () {
          const toTest = await this.crowdsale.capReached();
          assert.equal(toTest, false);
        });
      });

      describe('after start and before end', function () {
        beforeEach(async function () {
          await time.increaseTo(this.openingTime);
        });

        it('started should be true', async function () {
          const toTest = await this.crowdsale.started();
          assert.equal(toTest, true);
        });

        describe('if cap not reached', function () {
          it('ended should be false', async function () {
            const toTest = await this.crowdsale.ended();
            assert.equal(toTest, false);
          });

          it('capReached should be false', async function () {
            const toTest = await this.crowdsale.capReached();
            assert.equal(toTest, false);
          });
        });

        describe('if cap reached', function () {
          beforeEach(async function () {
            const cap = await this.crowdsale.cap();
            await this.crowdsale.send(cap);
          });

          it('ended should be true', async function () {
            const toTest = await this.crowdsale.ended();
            assert.equal(toTest, true);
          });

          it('capReached should be true', async function () {
            const toTest = await this.crowdsale.capReached();
            assert.equal(toTest, true);
          });
        });
      });

      describe('after end', function () {
        beforeEach(async function () {
          await time.increaseTo(this.afterClosingTime);
        });

        it('started should be true', async function () {
          const toTest = await this.crowdsale.started();
          assert.equal(toTest, true);
        });

        it('ended should be true', async function () {
          const toTest = await this.crowdsale.ended();
          assert.equal(toTest, true);
        });
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
  shouldBehaveLikeMintedBaseCrowdsale,
};
