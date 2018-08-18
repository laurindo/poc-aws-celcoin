const Recharge = require('./Recharge');
const Payment= require('./Payment');

class Celcoin {
    contructor() {}
    recharge() {
        return new Recharge();
    }
    payment() {
        return new Payment();
    }
}

module.exports = Celcoin;