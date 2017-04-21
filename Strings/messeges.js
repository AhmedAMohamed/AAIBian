/**
 * Created by ahmedalaa on 4/16/17.
 */


var messages = {

    benefit_expire: function (ben_name) {
        return "Dear User please note that " + ben_name + "is going to be expired during  this day";
    },
    operation_valid_msg: function () {
        return "Operation done with zero errors";
    },
    not_valid_operation: function () {
        return {valid: false, msg: "Not Authorized"};
    },
    valid_operation: function () {
        return {valid: true, msg: "Done"};
    }
};

module.exports = messages;