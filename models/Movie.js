const mongoose = require("mongoose");

 movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    
});
module.exports = mongoose.model("Music", movieSchema);
