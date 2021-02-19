const router = require('express').Router();
const jwt_decode = require('jwt-decode');

const User = require('../model/User');
const Posts = require('../model/Posts');
const verify = require('./verifyToken');

router.delete('/', verify, async (req, res) => {
    const token = req.header('auth-token');
    const userID = jwt_decode(token).data._id;

    try {
        //Delete all posts matching userID
        await Posts.deleteMany({userID: userID});
        
        //Delete user matching _id
        await User.findByIdAndDelete(userID)

    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;