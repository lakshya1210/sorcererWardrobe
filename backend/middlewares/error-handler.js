import { StatusCodes } from "http-status-codes"
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }

  // duplicate value errors
  if (err.code && err.code === 11000) {
    customError.msg = `${Object.keys(err.keyValue)} already registered`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  // validation errors
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  // cast error
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware