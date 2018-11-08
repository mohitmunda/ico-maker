const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert');

const { shouldBehaveLikeCappedDelivery } = require('./CappedDelivery.behaviour');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CappedDelivery = artifacts.require('MintedCappedDelivery');
const BaseToken = artifacts.require('BaseToken');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('MintedCappedDelivery', function (accounts) {
  const [
    tokenOwner,
    cappedDeliveryOwner,
    receiver,
  ] = accounts;

  const name = 'BaseToken';
  const symbol = 'ERC20';
  const decimals = 18;
  const tokenCap = new BigNumber(100000);

  const cap = new BigNumber(20000);

  beforeEach(async function () {
    this.token = await BaseToken.new(name, symbol, decimals, tokenCap, { from: tokenOwner });
  });

  const testingDelivery = function (allowMultipleSend) {
    context('creating a valid delivery', function () {
      describe('if token address is the zero address', function () {
        it('reverts', async function () {
          await assertRevert(
            CappedDelivery.new(ZERO_ADDRESS, cap, allowMultipleSend, { from: cappedDeliveryOwner })
          );
        });
      });

      describe('if cap is zero', function () {
        it('reverts', async function () {
          await assertRevert(
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

          await this.token.addMinter(this.cappedDelivery.address, { from: tokenOwner });
        });

        describe('sending tokens if minting is finished', function () {
          it('reverts', async function () {
            await this.token.finishMinting({ from: tokenOwner });
            await assertRevert(
              this.cappedDelivery.multiSend([receiver], [100], { from: cappedDeliveryOwner })
            );
          });
        });

        context('like a CappedDelivery', function () {
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
