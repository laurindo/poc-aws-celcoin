class MessageStatus {
    getSuccess(statusCode = 200, result) {
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'SUCCESS',
                code: statusCode,
                type: 'info',
                data: result
            })
        };
    }

    getError(statusCode = 500, errorDetails = 'Internal Error') {
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                message: 'ERROR',
                code: statusCode,
                type: 'error',
                data: errorDetails
            })
        };
    }
}

module.exports = MessageStatus;