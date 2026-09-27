//=============================Error Middleware=========================

const errorMiddleware = (error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        message: 'Something went wrong',
        error: error.message
    });

};



//=============================Export===================================

module.exports = errorMiddleware;