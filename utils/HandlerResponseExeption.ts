import ErrorCodeMessage, { MESSAGE_BY_CODE } from '../config/ErrorCodeMessage';

class HandlerResponseException {
  static handle(error: Error): { [key: string]: any } {
    if (error.message === ErrorCodeMessage.USER_NOT_FOUND) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message: MESSAGE_BY_CODE[ErrorCodeMessage.USER_NOT_FOUND],
          },
          null,
          2,
        ),
      };
    }

    if (error.message === ErrorCodeMessage.NEED_SET_ONE_CONTACT_MAIN) {
      return {
        statusCode: 409,
        body: JSON.stringify(
          {
            message:
              MESSAGE_BY_CODE[ErrorCodeMessage.NEED_SET_ONE_CONTACT_MAIN],
          },
          null,
          2,
        ),
      };
    }

    if (error.message === ErrorCodeMessage.MORE_THAN_ONE_CONTACT_SETTED_MAIN) {
      return {
        statusCode: 409,
        body: JSON.stringify(
          {
            message:
              MESSAGE_BY_CODE[
                ErrorCodeMessage.MORE_THAN_ONE_CONTACT_SETTED_MAIN
              ],
          },
          null,
          2,
        ),
      };
    }

    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Internal server error!',
        },
        null,
        2,
      ),
    };
  }
}

export default HandlerResponseException;
