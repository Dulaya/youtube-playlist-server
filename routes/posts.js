const router = require('express').Router();
const jwt_decode = require('jwt-decode');

const verify = require('./verifyToken');
const Post = require('../model/Posts');

router.get('/', verify, async (req, res) => {
    const token = req.header('auth-token');
    const userID = jwt_decode(token).data._id;

    try {
        const posts = await Post.find({ userID: userID });
        res.json(posts)
    } catch (error) {
        res.status(400).send(err);
    }

});

router.post('/newpost', verify, async (req, res) => {
    const post = new Post({
        post: req.body.post,
        selectedFile: req.body.selectedFile,
        userID: req.body.userID,
        youTubeLink: req.body.youTubeLink,
    });

    try {
        const savedPost = await post.save();
        res.json({ savedPost });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/deletepost', verify, async (req, res) => {
    const postID = req.body.postID;
    try {
        await Post.findByIdAndDelete(req.body.postID);
        res.json({ postID });
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;