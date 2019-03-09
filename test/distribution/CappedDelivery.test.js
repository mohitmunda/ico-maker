const { BN, constants, shouldFail } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeCappedDelivery } = require('./CappedDelivery.behaviour');

const CappedDelivery = artifacts.require('CappedDelivery');
const BaseToken = artifacts.require('BaseToken');

contract('CappedDelivery', function (accounts) {
  const [
    tokenOwner,
    cappedDeliveryOwner,
    receiver,
  ] = accounts;

  const name = 'BaseToken';
  const symbol = 'ERC20';
  const decimals = new BN(18);
  const tokenCap = new BN(100000);
  const initialSupply = new BN(0);

  const cap = new BN(20000);

  beforeEach(async function () {
    this.token = await BaseToken.new(name, symbol, decimals, tokenCap, initialSupply, { from: tokenOwner });
  });

  const testingDelivery = function (allowMultipleSend) {
    context('creating a valid delivery', function () {
      describe('if token address is the zero address', function () {
        it('reverts', async function () {
          await shouldFail.reverting(
            CappedDelivery.new(ZERO_ADDRESS, cap, allowMultipleSend, { from: cappedDeliveryOwner })
          );
        });
      });

      describe('if cap is zero', function () {
        it('reverts', async function () {
          await shouldFail.reverting(
            CappedDelivery.new(this.token.address, 0, allowMultipleSend, { from: cappedDeliveryOwner })
          );
        });
      });

      context('testing behaviours', function () {
        beforeEach(async function () {
          this.cappedDelivery = await CappedDelivery.new(
            this.token.address,
            cap,
            allowMultipleSend,
            { from: cappedDeliveryOwner }
          );

          await this.token.mint(this.cappedDelivery.address, tokenCap, { from: tokenOwner });
        });

        describe('sending tokens if minting is not finished', function () {
          it('reverts', async function () {
            await shouldFail.reverting(
              this.cappedDelivery.multiSend([receiver], [100], { from: cappedDeliveryOwner })
            );
          });
        });

        context('like a CappedDelivery', function () {
          beforeEach(async function () {
            await this.token.finishMinting({ from: tokenOwner });
          });

          shouldBehaveLikeCappedDelivery(accounts, cap, allowMultipleSend);
        });
      });
    });
  };

  context('if allowing multiple send', function () {
    const allowMultipleSend = true;
    testingDelivery(allowMultipleSend);
  });

  context('if not allowing multiple send', function () {
    const allowMultipleSend = false;
    testingDelivery(allowMultipleSend);
  });
});
