/**
 * Created by ahmedalaa on 4/16/17.
 */


var messages = {

    benefit_expire: function (ben_name) {
        return "Dear User please note that " + ben_name + "is going to be expired during  this day";
    },
    operation_valid: function () {
        return "Operation done with zero errors";
    }
};

module.exports = messages;