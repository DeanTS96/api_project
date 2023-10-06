const {getCommentsById, postCommentByArticleId, deleteCommentById} = require('../controllers/comments.controllers');
const commentsRouter = require('express').Router();

commentsRouter.get('/:article_id/comments', getCommentsById);
commentsRouter.post('/:article_id/comments', postCommentByArticleId);
commentsRouter.delete('/:comment_id', deleteCommentById);

module.exports = commentsRouter;