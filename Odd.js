const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const oddSchema = new Schema({
    id: {
        type: String,
        minlength: 1,
        required: true,
    },
    betHouse: {
        type: String,
        minlength: 1,
        required: true,
    },
    leftTeam: {
        type: String,
        minlength: 1,
        required: true,
    },
    rightTeam: {
        type: String,
        minlength: 1,
        required: true,
    },
    left: {
        id: { type: Number },
        type: { type: String },
        betHouse: { type: String },
        odd: { type: Number },
        bet: { type: Number },
        bet: {
            type: Number,
            required: false
        },
        return: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: false
        }
    },
    draw: {
        id: { type: Number },
        type: { type: String },
        betHouse: { type: String },
        odd: { type: Number },
        bet: {
            type: Number,
            required: false
        },
        return: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: false
        }
    },
    right: {
        id: { type: Number },
        type: { type: String },
        betHouse: { type: String },
        odd: { type: Number },
        bet: {
            type: Number,
            required: false
        },
        return: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: false
        }
    }
});

module.exports = mongoose.model("Odds", oddSchema);