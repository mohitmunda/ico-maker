const { time } = require('openzeppelin-test-helpers');

const { shouldBehaveLikeBaseCrowdsale } = require('./BaseCrowdsale.behaviour');
const { shouldBehaveLikeMintedCrowdsale } = require('./MintedCrowdsale.behaviour');

function shouldBehaveLikeMintedBaseCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  rate,
  minimumContribution
) {
  const value = minimumContribution;

  context('like a MintedCrowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });
    shouldBehaveLikeMintedCrowdsale([owner, investor, wallet, purchaser], rate, value);
  });

  context('like a BaseCrowdsale', function () {
    shouldBehaveLikeBaseCrowdsale([owner, investor, wallet, purchaser, thirdParty], rate, minimumContribution);
  });
}

module.exports = {
  shouldBehaveLikeMintedBaseCrowdsale,
};
