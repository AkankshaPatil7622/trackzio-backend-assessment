const errorHandler = (err, req, res, next) => {
    console.log("error from error handling middleware");
    res.status(err.statusCode || 500).json({
        success : false,
        message : err.message || "Internal server error",
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler;