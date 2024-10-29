export const errorHandler = (statusCode, message) => {
  const newError = new Error();
  newError.statusCode = statusCode;
  newError.message = message;

  return newError;
}