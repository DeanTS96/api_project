function articlesErrors(err, req, res, next) {
    console.log('articleErrors');
    if(err.code === '22P02') {
        res.status(400).send({msg: 'invalid id'});
    }
    else if(err.status) {
        res.status(err.status).send({msg:err.msg});
    }
    else{ console.log('eorrur unhandles')}
}

module.exports = articlesErrors;