import createError from 'http-errors';

const { NODE_ENV } = process.env;

export const errorHandler = (err, req, res, next) => {
    // Handle Joi validation errors
    if (err.isJoi) {
        err.status = 422;
        err.message = err.details.map(d => d.message).join('; ');
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        err.status = 422;
        err.message = Object.values(err.errors).map(e => e.message).join('; ');
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
        err.status = 409;
        err.message = 'Duplicate key error';
    }

    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
        error: message,
        ...(NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details
        })
    });
};

export const notFoundHandler = (req, res, next) => {
    next(createError.NotFound('Endpoint not found'));
};

export default { errorHandler, notFoundHandler };
