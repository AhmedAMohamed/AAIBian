var mongoose = require('mongoose');
var User_schema = mongoose.Schema(
    { name: String,
    description: String,
    location: { lat: Number, lng: Number },
    history: {
        event: String,
        notes: String,
        email: String,
        date: Date,
    },
    updateId: String,
    approved: Boolean,
});
var Users = mongoose.model('Users', User_schema);
module.exports = Users;