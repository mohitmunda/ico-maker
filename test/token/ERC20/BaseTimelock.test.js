const { BN, expectRevert, time } = require('openzeppelin-test-helpers');

const { shouldBehaveLikeTokenTimelock } = require('./behaviours/TokenTimelock.behaviour');

const ERC20Mintable = artifacts.require('ERC20Mintable');
const BaseTimelock = artifacts.require('BaseTimelock');

contract('BaseTimelock', function ([_, minter, beneficiary]) {
  const amount = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20Mintable.new({ from: minter });
  });

  context('creating a valid timelock', function () {
    it('rejects a release time in the past', async function () {
      const pastReleaseTime = (await time.latest()).sub(time.duration.years(1));
      await expectRevert.unspecified(
        BaseTimelock.new(this.token.address, beneficiary, pastReleaseTime),
      );
    });
  });

  context('as a Timelock', function () {
    beforeEach(async function () {
      this.releaseTime = (await time.latest()).add(time.duration.years(1));
      this.timelock = await BaseTimelock.new(this.token.address, beneficiary, this.releaseTime);
      await this.token.mint(this.timelock.address, amount, { from: minter });
    });

    shouldBehaveLikeTokenTimelock([_, minter, beneficiary], amount);
  });
});
