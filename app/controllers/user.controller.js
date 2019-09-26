const User = require('../models/user.model.js');
const crypto = require('crypto');

// Create and Save a new User
exports.create = (req, res) => {
    let hash = crypto
        .createHash('md5')
        .update(req.body.email)
        .digest('hex');

    // Create a User
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        token: hash
    });

    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating user.'
            });
        });
};

exports.getUsers = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving users.'
            });
        });
};

exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email: email, password: password})
        .then(user => {
            if (!user) {
                res.status(404).send({message: 'User does not exists'});
            }
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({message: err.message || 'Something went wrong while authenticating user'});
        });
};

exports.getUser = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: 'User not found with id ' + req.params.userId
                });
            }
            res.send(user);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'User not found with id ' + req.params.userId
                });
            }
            return res.status(500).send({
                message: 'Error retrieving user with id ' + req.params.userId
            });
        });
};
