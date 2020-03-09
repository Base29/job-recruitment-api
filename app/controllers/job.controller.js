const Job = require('../models/job.model.js');
const { calculateLimitAndOffset, paginate } = require('paginate-info');
// Create and Save a new Job
exports.create = (req, res) => {
    // Create a Jod
    const job = new Job({
        title: req.body.title || 'Untitled Job',
        description: req.body.description,
        creator: req.body.creator,
        datecreated: Date.now()
    });

    // Save Job in the database
    job.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Job.'
            });
        });
};

// Retrieve and return all jobs from the database.
exports.findAll = async (req, res) => {
    const {
        query: { currentPage, pageSize }
    } = req;
    const { offset } = calculateLimitAndOffset(currentPage, pageSize);

    Job.find()
        .then(jobs => {
            const count = jobs.length;
            const limit = 1;
            const totalPages = Math.ceil(count / limit);
            const paginatedData = jobs.slice(offset, offset + limit);
            const paginationInfo = paginate(currentPage, count, paginatedData);
            Object.assign(paginationInfo, { totalPages: totalPages });
            return res.status(200).json({
                success: true,
                data: { result: paginatedData, meta: paginationInfo }
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving jobs.'
            });
        });
};

// Find a single job with a jobId
exports.findOne = (req, res) => {
    Job.findById(req.params.jobId)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            res.send(job);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            return res.status(500).send({
                message: 'Error retrieving job with id ' + req.params.jobId
            });
        });
};

// Update a job identified by the jobId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.description) {
        return res.status(400).send({
            message: 'Job description can not be empty'
        });
    }

    // Find job and update it with the request body
    Job.findByIdAndUpdate(
        req.params.jobId,
        {
            title: req.body.title || 'Untitled Job',
            content: req.body.description
        },
        { new: true }
    )
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            res.send(job);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            return res.status(500).send({
                message: 'Error updating job with id ' + req.params.jobId
            });
        });
};

// Delete a job with the specified jobId in the request
exports.delete = (req, res) => {
    Job.findByIdAndRemove(req.params.jobId)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            res.send({ message: 'Job deleted successfully!' });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: 'Job not found with id ' + req.params.jobId
                });
            }
            return res.status(500).send({
                message: 'Could not delete job with id ' + req.params.jobId
            });
        });
};
