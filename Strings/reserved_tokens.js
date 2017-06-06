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
    cardholders_required: "card_required",
    areas_required: "area_required",
    medical_required: "med_required",
    function_name: {
        add_user: "add_user",
        add_cat: "add_category",
        add_benefit: "add_benefit",
        add_medical: "add_medical",
        add_atm: "add_atm",
        add_news: "add_news",
        add_area: "add_area",
        change_password: "change_password",
        set_privilege: "set_privilege"
    },
    radius: (15 / 3963.2),
    upload_dir: process.env.OPENSHIFT_DATA_DIR + "/uploads/"
};

module.exports = tokens;
