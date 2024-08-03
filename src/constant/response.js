const responseObj = (res, status = false, statusCode = 500, message = 'Something went wrong!', data = {}) => {
    return res.send({status, statusCode, message, data})
}

module.exports = responseObj