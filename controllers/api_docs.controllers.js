const fetchAPIDocs = require('../models/api_docs.models')

function getAPIDocs(req, res, next) {
    fetchAPIDocs().then(apiFile => {
        res.status(200).send({API: apiFile})
    })
}

module.exports = {getAPIDocs};