const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken')
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator')

const User = require('../../models/User')


// @route  POST api/user
// @desc   Register User
// @access Public
router.post('/', [
        check('name', 'Name is Required')
        .not()
        .isEmpty(),
        check('email', 'Please include a valid email')
        .isEmail(),
        check('password', 'Please enter a password with 6 or more character')
        .isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            name,
            email,
            password
        } = req.body;

        try {

            // See if user exists
            let user = await User.findOne({
                email
            })
            if (user) {
                return res.status(400).json({
                    error: [{
                        msg: 'User already exist'
                    }]
                })
            }

            // Get user Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });



            // Encrypt Password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            
            // Return JsonWebToken
            const payload = {

                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtToken'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    token
                });
            })



            // console.log(req.body)
            // res.send("User registered")

        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error');
        }
    });

module.exports = router