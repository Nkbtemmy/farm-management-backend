import ApiError from '../utils/ApiError';

describe('ApiError', () => {
  it('should create an ApiError instance with the provided parameters', () => {
    const statusCode = 400;
    const message = 'Bad Request';
    const isOperational = false;
    const stack = 'Error stack trace';

    const error = new ApiError(statusCode, message, isOperational, stack);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.isOperational).toBe(isOperational);
    expect(error.stack).toBe(stack);
  });

  it('should create an ApiError instance with default isOperational and stack', () => {
    const statusCode = 500;
    const message = 'Internal Server Error';

    const error = new ApiError(statusCode, message);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toContain('ApiError');
  });

  it('should capture the stack trace if stack is not provided', () => {
    const statusCode = 404;
    const message = 'Not Found';

    const error = new ApiError(statusCode, message);

    expect(error.stack).toContain('ApiError');
  });
});
