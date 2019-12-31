module.exports = {
  norpc: true,
  testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
  compileCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle compile --network coverage',
  client: require('ganache-cli'),
  providerOptions: {
    hardfork: 'istanbul',
  },
  copyPackages: [
    'erc-payable-token',
    'eth-token-recover',
    '@openzeppelin/contracts',
  ],
  skipFiles: [
    'mocks'
  ],
};
