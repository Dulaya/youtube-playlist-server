const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    //Validate data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user is alread in database
    const userExist = await User.findOne({ username: req.body.username });
    if (userExist) return res.status(400).send('Username already exists');

    //Check if email is alread in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    /*//Use username for login instead of email//
    //Check if email is alread in database
    const userEmail = await User.findOne({ email: req.body.email });
    if (!userEmail) return res.status(400).send('Email is not found');
    */

    //Check if username is correct
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Username is not found');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Invalid password');
    }

    //Create and assign a token
    const token = jwt.sign({ data: { userName: user.username, _id: user._id } },
        process.env.TOKEN_SECRET, {
        expiresIn: 86400,//expires in 24 hours
    });

    res.header('auth-token', token).send(token);
})


module.exports = router;