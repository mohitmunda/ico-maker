App = {
  hasPrivacyMode: false,
  web3Provider: null,
  contracts: {},
  instances: {},

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof ethereum !== 'undefined') {
      console.log('injected web3');
      App.web3Provider = ethereum;
      App.hasPrivacyMode = true;
    } else if (typeof web3 !== 'undefined') {
      console.log('injected web3 (legacy)');
      App.web3Provider = web3.currentProvider;
    } else {
      // set the provider you want from Web3.providers
      console.log('provided web3');
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    if (App.hasPrivacyMode) {
      App.web3Provider.enable();
    }

    $.getJSON('BaseToken.json', function (data) {
      App.contracts.BaseToken = TruffleContract(data);
      App.contracts.BaseToken.setProvider(App.web3Provider);
    });

    $.getJSON('Contributions.json', function (data) {
      App.contracts.Contributions = TruffleContract(data);
      App.contracts.Contributions.setProvider(App.web3Provider);
    });

    $.getJSON('BaseCrowdsale.json', function (data) {
      App.contracts.BaseCrowdsale = TruffleContract(data);
      App.contracts.BaseCrowdsale.setProvider(App.web3Provider);
    });

    $.getJSON('CappedDelivery.json', function (data) {
      App.contracts.CappedDelivery = TruffleContract(data);
      App.contracts.CappedDelivery.setProvider(App.web3Provider);
    });

    $.getJSON('MintedCappedDelivery.json', function (data) {
      App.contracts.MintedCappedDelivery = TruffleContract(data);
      App.contracts.MintedCappedDelivery.setProvider(App.web3Provider);
    });

    $.getJSON('SpenderCappedDelivery.json', function (data) {
      App.contracts.SpenderCappedDelivery = TruffleContract(data);
      App.contracts.SpenderCappedDelivery.setProvider(App.web3Provider);
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
