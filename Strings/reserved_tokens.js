/**
 * Created by ahmedalaa on 4/20/17.
 */

var tokens = {
    first_login: "new_login",
    old_login: "current_user",
    default_password: "AhmedAlaa",
    all_categories: "SUBSCRIBED_IN_ALL",
    medical_sector: "SUBSCRIBED_IN_MEDICAL_ALL",
    atm_sector: "SUBSCRIBED_IN_ATM",
    all_user_api_key: "VALID_FOR_ALL",
    upload_dir: process.env.OPENSHIFT_DATA_DIR + "/uploads/"
};

module.exports = tokens;
