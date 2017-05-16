/**
 * Created by ahmedalaa on 4/20/17.
 */

var tokens = {
    medical_selected: "med",
    benefit_selected: "ben",
    atm_selected: "atm",
    card_selected: "card",
    first_login: "new_login",
    old_login: "current_user",
    default_password: "AhmedAlaa",
    all_categories: "SUBSCRIBED_IN_ALL",
    medical_sector: "SUBSCRIBED_IN_MEDICAL_ALL",
    atm_sector: "SUBSCRIBED_IN_ATM",
    all_user_api_key: "VALID_FOR_ALL",
    news_required: "news_required",
    benefit_required: "ben_required",
    category_required: "cat_required",
    areas_required: "area_required",
    medical_required: "med_required",
    radius: (15 / 3963.2),
    upload_dir: process.env.OPENSHIFT_DATA_DIR + "/uploads/"
};

module.exports = tokens;
