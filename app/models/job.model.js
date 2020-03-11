const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const JobSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        creator: { type: String, required: true },
        datecreated: { type: Date, required: true }
    },
    {
        timestamps: true
    }
);
JobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Job', JobSchema);
