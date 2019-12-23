const { expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');

function shouldBehaveLikeTimedCrowdsale ([owner, investor, wallet, purchaser], rate, value) {
  it('should be ended only after end', async function () {
    (await this.crowdsale.hasClosed()).should.equal(false);
    await time.increaseTo(this.afterClosingTime);
    (await this.crowdsale.isOpen()).should.equal(false);
    (await this.crowdsale.hasClosed()).should.equal(true);
  });

  describe('accepting payments', function () {
    it('should reject payments before start', async function () {
      (await this.crowdsale.isOpen()).should.equal(false);
      await expectRevert.unspecified(this.crowdsale.send(value));
      await expectRevert.unspecified(this.crowdsale.buyTokens(investor, { from: purchaser, value: value }));
    });

    it('should accept payments after start', async function () {
      await time.increaseTo(this.openingTime);
      (await this.crowdsale.isOpen()).should.equal(true);
      await this.crowdsale.send(value);
      await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
    });

    it('should reject payments after end', async function () {
      await time.increaseTo(this.afterClosingTime);
      await expectRevert.unspecified(this.crowdsale.send(value));
      await expectRevert.unspecified(this.crowdsale.buyTokens(investor, { value: value, from: purchaser }));
    });
  });

  describe('extending closing time', function () {
    it('should not reduce duration', async function () {
      // Same date
      await expectRevert.unspecified(this.crowdsale.extendTime(this.closingTime, { from: owner }));

      // Prescending date
      const newClosingTime = this.closingTime.sub(time.duration.seconds(1));
      await expectRevert.unspecified(this.crowdsale.extendTime(newClosingTime, { from: owner }));
    });

    context('before crowdsale start', function () {
      beforeEach(async function () {
        (await this.crowdsale.isOpen()).should.equal(false);
        await expectRevert.unspecified(this.crowdsale.send(value));
      });

      it('it extends end time', async function () {
        const newClosingTime = this.closingTime.add(time.duration.days(1));
        const { logs } = await this.crowdsale.extendTime(newClosingTime, { from: owner });
        expectEvent.inLogs(logs, 'TimedCrowdsaleExtended', {
          prevClosingTime: this.closingTime,
          newClosingTime: newClosingTime,
        });
        (await this.crowdsale.closingTime()).should.be.bignumber.equal(newClosingTime);
      });
    });

    context('after crowdsale start', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
        (await this.crowdsale.isOpen()).should.equal(true);
        await this.crowdsale.send(value);
      });

      it('it extends end time', async function () {
        const newClosingTime = this.closingTime.add(time.duration.days(1));
        const { logs } = await this.crowdsale.extendTime(newClosingTime, { from: owner });
        expectEvent.inLogs(logs, 'TimedCrowdsaleExtended', {
          prevClosingTime: this.closingTime,
          newClosingTime: newClosingTime,
        });
        (await this.crowdsale.closingTime()).should.be.bignumber.equal(newClosingTime);
      });
    });

    context('after crowdsale end', function () {
      beforeEach(async function () {
        await time.increaseTo(this.afterClosingTime);
      });

      it('it reverts', async function () {
        const newClosingTime = await time.latest();
        await expectRevert.unspecified(this.crowdsale.extendTime(newClosingTime, { from: owner }));
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeTimedCrowdsale,
};
