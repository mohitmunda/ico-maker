const { BN, constants, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeCappedDelivery } = require('./CappedDelivery.behaviour');

const CappedDelivery = artifacts.require('SpenderCappedDelivery');
const BaseToken = artifacts.require('BaseERC20Token');

contract('SpenderCappedDelivery', function (accounts) {
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

  beforeEach(async function () {
    this.token = await BaseToken.new(name, symbol, decimals, tokenCap, initialSupply, { from: tokenOwner });
  });

  const testingDelivery = function (allowMultipleSend) {
    context('creating a valid delivery', function () {
      describe('if token address is the zero address', function () {
        it('reverts', async function () {
          await expectRevert.unspecified(
            CappedDelivery.new(ZERO_ADDRESS, tokenCap, allowMultipleSend, tokenOwner, { from: cappedDeliveryOwner }),
          );
        });
      });

      describe('if cap is zero', function () {
        it('reverts', async function () {
          await expectRevert.unspecified(
            CappedDelivery.new(this.token.address, 0, allowMultipleSend, tokenOwner, { from: cappedDeliveryOwner }),
          );
        });
      });

      describe('if wallet address is the zero address', function () {
        it('reverts', async function () {
          await expectRevert.unspecified(
            CappedDelivery.new(
              this.token.address, tokenCap, allowMultipleSend, ZERO_ADDRESS, { from: cappedDeliveryOwner },
            ),
          );
        });
      });

      context('testing behaviours', function () {
        beforeEach(async function () {
          this.cappedDelivery = await CappedDelivery.new(
            this.token.address,
            tokenCap,
            allowMultipleSend,
            tokenOwner,
            { from: cappedDeliveryOwner },
          );

          await this.token.mint(tokenOwner, tokenCap, { from: tokenOwner });
        });

        it('wallet should be right set', async function () {
          const wallet = await this.cappedDelivery.wallet();
          wallet.should.be.equal(tokenOwner);
        });

        describe('sending tokens if minting is not finished', function () {
          it('reverts', async function () {
            await expectRevert.unspecified(
              this.cappedDelivery.multiSend([receiver], [100], { from: cappedDeliveryOwner }),
            );
          });
        });

        describe('sending tokens if spender has not allowance', function () {
          it('reverts', async function () {
            await this.token.finishMinting({ from: tokenOwner });
            await this.token.enableTransfer({ from: tokenOwner });
            await expectRevert.unspecified(
              this.cappedDelivery.multiSend([receiver], [100], { from: cappedDeliveryOwner }),
            );
          });
        });

        context('like a CappedDelivery', function () {
          beforeEach(async function () {
            await this.token.approve(this.cappedDelivery.address, tokenCap, { from: tokenOwner });
            await this.token.finishMinting({ from: tokenOwner });
            await this.token.enableTransfer({ from: tokenOwner });
          });

          shouldBehaveLikeCappedDelivery(accounts, tokenCap, allowMultipleSend);
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
