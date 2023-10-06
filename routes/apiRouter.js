const {getAPIDocs} = require('../controllers/api_docs.controllers');

const apiRouter = require('express').Router();

apiRouter.get('/', getAPIDocs);

module.exports = apiRouter;