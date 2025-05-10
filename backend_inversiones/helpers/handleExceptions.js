export const handleError = (res, err) => {
    if (err) {
        console.log(err);
        res.status(500).json({
            error: err,
            message: 'Error in the query 3',
        });
    }
}

export const handleBadRequest = (res, errors) => {
    const messages = createMessageToFields(errors);
    res.status(400).json({ message: messages });
}

export const handleNotFound = (res) => {
    res.status(404).json({ message: 'There is no record with that id' });
}

export const handleUnauthorized = (res) => {
    res.status(401);
    res.send({
        error: 'Invalid account'
    })

}

export const handleDuplicateValue = (res, errors) => {
    res.status(409).json({
        error: errors[0].message
    });
}

const createMessageToFields = (errors) => {
    const messages = {};
    if (errors != null) {
        errors.forEach(element => {
            messages[element.path] = element.message;
        });
    } else {
        console.log('el error capturado esta vacio');
    }
    return messages
}

export const errorNotExists = (type) => {
    const error = new Error();
    switch (type) {
        case "auth":
            error.name = 'UnauthorizedError';
            break;

        case "body":
            error.name = 'SequelizeValidationError';
            error.errors = [{
                path: "body",
                message: "Invalid or missing fields in request body"
            }];
            break;
        default:
            error.name = 'NotExistsError';
            break;
    }
    throw error;
}

export const getHandleError = (error, res) => {
    const errors = error.errors;
    const name = error.name;
    console.log("EEEE", error);
    
    switch (name) {
        case 'SequelizeValidationError':
            return handleBadRequest(res, errors);
        case 'SequelizeUniqueConstraintError':
            return handleDuplicateValue(res, errors);
        case 'NotExistsError':
            return handleNotFound(res);
        case 'UnauthorizedError':
            return handleUnauthorized(res);
        case 'SequelizeDatabaseError':
            return handleBadRequest(res, errors);
        default:
            return null;
    }
}
