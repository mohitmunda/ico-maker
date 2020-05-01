const { balance, BN, constants, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

function shouldBehaveLikeCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  { rate },
) {
  const value = ether('1');
  const expectedTokenAmount = rate.mul(value);

  describe('checking properties', function () {
    it('rate should be right set', async function () {
      const expectedRate = await this.crowdsale.rate();
      expectedRate.should.be.bignumber.equal(rate);
    });

    it('token should be right set', async function () {
      const expectedToken = await this.crowdsale.token();
      expectedToken.should.be.equal(this.token.address);
    });

    it('wallet should be right set', async function () {
      const expectedWallet = await this.crowdsale.wallet();
      expectedWallet.should.be.equal(wallet);
    });

    it('weiRaised should be zero', async function () {
      const expectedWeiRaised = await this.crowdsale.weiRaised();
      expectedWeiRaised.should.be.bignumber.equal(new BN(0));
    });
  });

  describe('accepting payments', function () {
    describe('bare payments', function () {
      it('should accept payments', async function () {
        await this.crowdsale.send(value, { from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.send(0, { from: purchaser }), 'Crowdsale: weiAmount is 0',
        );
      });
    });

    describe('buyTokens', function () {
      it('should accept payments', async function () {
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(investor, { value: 0, from: purchaser }), 'Crowdsale: weiAmount is 0',
        );
      });

      it('requires a non-null beneficiary', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(ZERO_ADDRESS, { value: value, from: purchaser }),
          'Crowdsale: beneficiary is the zero address',
        );
      });

      it('should increase weiRaised', async function () {
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });

        const expectedWeiRaised = await this.crowdsale.weiRaised();
        expectedWeiRaised.should.be.bignumber.equal(value);
      });
    });
  });

  describe('high-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: investor,
        beneficiary: investor,
        value: value,
        amount: expectedTokenAmount,
      });
    });

    it('should assign tokens to sender', async function () {
      await this.crowdsale.sendTransaction({ value: value, from: investor });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(expectedTokenAmount);
    });

    it('should forward funds to wallet', async function () {
      const balanceTracker = await balance.tracker(wallet);
      await this.crowdsale.sendTransaction({ value, from: investor });
      expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
    });
  });

  describe('low-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: purchaser,
        beneficiary: investor,
        value: value,
        amount: expectedTokenAmount,
      });
    });

    it('should assign tokens to beneficiary', async function () {
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(expectedTokenAmount);
    });

    it('should forward funds to wallet', async function () {
      const balanceTracker = await balance.tracker(wallet);
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
    });
  });
}

module.exports = {
  shouldBehaveLikeCrowdsale,
};
