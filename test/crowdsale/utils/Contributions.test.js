const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Contributions = artifacts.require('Contributions');

contract('Contributions', function (
  [_, owner, operator, futureOperator, anotherFutureOperator, thirdParty, anotherThirdParty]
) {
  const tokenToAdd = new BigNumber(100);
  const ethToAdd = ether(1);

  beforeEach(async function () {
    this.contributions = await Contributions.new({ from: owner });
    await this.contributions.addOperator(operator, { from: owner });
  });

  describe('if operator is calling', function () {
    it('should success to add amounts to the address balances', async function () {
      let tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(0);
      let weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(tokenToAdd);
      weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(ethToAdd);

      await this.contributions.addBalance(thirdParty, ethToAdd.mul(3), tokenToAdd.mul(3), { from: operator });

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(tokenToAdd.mul(4));
      weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(ethToAdd.mul(4));
    });

    it('should increase total sold tokens and total wei raised', async function () {
      let totalSoldTokens = await this.contributions.totalSoldTokens();
      let totalWeiRaised = await this.contributions.totalWeiRaised();
      totalSoldTokens.should.be.bignumber.equal(0);
      totalWeiRaised.should.be.bignumber.equal(0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });
      await this.contributions.addBalance(thirdParty, ethToAdd.mul(3), tokenToAdd.mul(3), { from: operator });

      totalSoldTokens = await this.contributions.totalSoldTokens();
      totalWeiRaised = await this.contributions.totalWeiRaised();
      totalSoldTokens.should.be.bignumber.equal(tokenToAdd.mul(4));
      totalWeiRaised.should.be.bignumber.equal(ethToAdd.mul(4));
    });

    it('should increase array length when different address are passed', async function () {
      let contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);

      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 2);
    });

    it('should not increase array length when same address is passed', async function () {
      let contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);
    });

    it('should cycle addresses and have the right value set', async function () {
      await this.contributions.addBalance(owner, ethToAdd.mul(3), tokenToAdd.mul(3), { from: operator });
      await this.contributions.addBalance(thirdParty, ethToAdd.mul(4), tokenToAdd.mul(4), { from: operator });
      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });
      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });

      const tokenBalances = [];
      tokenBalances[owner] = await this.contributions.tokenBalance(owner);
      tokenBalances[thirdParty] = await this.contributions.tokenBalance(thirdParty);
      tokenBalances[anotherThirdParty] = await this.contributions.tokenBalance(anotherThirdParty);

      const weiContributions = [];
      weiContributions[owner] = await this.contributions.weiContribution(owner);
      weiContributions[thirdParty] = await this.contributions.weiContribution(thirdParty);
      weiContributions[anotherThirdParty] = await this.contributions.weiContribution(anotherThirdParty);

      const contributorsLength = (await this.contributions.getContributorsLength()).valueOf();

      for (let i = 0; i < contributorsLength; i++) {
        const address = await this.contributions.addresses(i);
        const tokenBalance = await this.contributions.tokenBalance(address);
        const weiContribution = await this.contributions.weiContribution(address);

        tokenBalance.should.be.bignumber.equal(tokenBalances[address]);
        weiContribution.should.be.bignumber.equal(weiContributions[address]);
      }
    });
  });

  describe('if third party is calling', function () {
    it('reverts and fail to add amounts to the address balances', async function () {
      let tokenBalance = await this.contributions.tokenBalance(thirdParty);
      let weiContribution = await this.contributions.weiContribution(thirdParty);
      assert.equal(tokenBalance, 0);
      assert.equal(weiContribution, 0);

      await shouldFail.reverting(
        this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: thirdParty })
      );

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      weiContribution = await this.contributions.weiContribution(thirdParty);

      assert.equal(tokenBalance, 0);
      assert.equal(weiContribution, 0);
    });
  });

  context('like a TokenRecover', function () {
    beforeEach(async function () {
      this.instance = this.contributions;
    });

    shouldBehaveLikeTokenRecover([owner, thirdParty]);
  });
});
