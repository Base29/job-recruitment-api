const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        creator: {type: String, required: true},
        datecreated: {type: Date, required: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Job', JobSchema);
