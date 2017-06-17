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
    atm_required: "atm_required",
    function_name: {
        add_user: "Add Users",
        add_cat: "Add Category",
        add_benefit: "Add Staff Benefits",
        add_medical: "Add Medical Benefits",
        add_atm: "Add ATM",
        add_cardholder: "Add Cardholders Benefits",
        add_news: "Add News",
        add_area: "Add Area",

        change_password: "Change Staff Password",

        set_privilege: "Edit Roles",

        show_feedbacks: "Show Feedback",
        show_news: "Show News",
        show_users: "Show Users",
        show_atms: "Show ATMs",
        show_benefits: "Show Staff Benefits",
        show_cards: "Show Cardholders Benefits",
        show_medicals: "Show Medical Benefits",
        show_areas: "Show Areas",
        show_cat: "Show Categories",

        edit_atm: "Edit ATM",
        edit_card: "Edit Cardholder Benefits",
        edit_ben: "Edit Staff Benefits",
        edit_med: "Edit Medical Benefits",
        edit_news: "Edit news",
        edit_category: "Edit Category",
        edit_area: "Edit Area"
    },
    radius: (15 / 3963.2),
    upload_dir:  /*"/Users/ahmedalaa/Desktop", */ process.env.OPENSHIFT_DATA_DIR + "/uploads/",
    server_name: 'AAAA6_tt21g:APA91bGY8TlMcQxbiHzwpuly5vdZE92gbgGNAF_yaBMG0wIEdQUxMsk_xk4VlrtJB_9FA' +
                 '-ruy1dMpA3XNOFaZwcYll2nMgF1c0GGaYE7sQIRAnpYIZXEqZVMGNXOe9_-GxYs2SQOrR2h'
};

module.exports = tokens;
