// Create Webserver
// Create a comment
// Get all comments
// Get a comment by id
// Update a comment
// Delete a comment

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Comment } = require('../models/comment');
const { Post } = require('../models/post');

// Create a comment
router.post('/api/comments', async (req, res) => {
    // Validate the request body
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the post exists
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(400).send('Invalid post ID');

    // Create the comment
    const comment = new Comment({
        postId: req.body.postId,
        name: req.body.name,
        email: req.body.email,
        body: req.body.body
    });

    await comment.save();
    res.send(comment);
});

// Get all comments
router.get('/api/comments', async (req, res) => {
    const comments = await Comment.find();
    res.send(comments);
});

// Get a comment by id
router.get('/api/comments/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('The comment with the given ID was not found');
    res.send(comment);
});

// Update a comment
router.put('/api/comments/:id', async (req, res) => {
    // Validate the request body
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await Comment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        body: req.body.body
    }, { new: true });

    if (!comment) return res.status(404).send('The comment with the given ID was not found');
    res.send(comment);
});

// Delete a comment
router.delete('/api/comments/:id', async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if (!comment) return res.status(404).send('The comment with the given ID was not found');
    res.send(comment);
})
