function handleErrors(err, req, res, next) {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'invalid id'});
    }
    else if(err.code === '23503') {
        res.status(404).send({msg: 'user doesn\'t exist'});
    }
    else if(err.status) {
        res.status(err.status).send({msg:err.msg});
    }
    else{ 
        console.log('eorrur unhandles')
        res.status(500).send({msg: 'something went wrong :('})
    }
}

module.exports = handleErrors;