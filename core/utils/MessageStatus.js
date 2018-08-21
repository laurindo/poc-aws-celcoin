class MessageStatus {
    getSuccess(result) {
        return {
            message: 'SUCCESS',
            code: statusCode,
            type: 'info',
            data: result
        };
    }

    getError(statusCode = 500, errorDetails = 'Internal Error') {
        return {
            message: 'ERROR',
            code: statusCode,
            type: 'error',
            data: errorDetails
        };
    }
}

module.exports = MessageStatus;