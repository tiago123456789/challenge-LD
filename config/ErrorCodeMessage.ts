enum ErrorCodeMessage {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NEED_SET_ONE_CONTACT_MAIN = 'NEED_SET_ONE_CONTACT_MAIN',
  MORE_THAN_ONE_CONTACT_SETTED_MAIN = 'MORE_THAN_ONE_CONTACT_SETTED_MAIN',
}

export const MESSAGE_BY_CODE = {
  USER_NOT_FOUND: 'User not found',
  NEED_SET_ONE_CONTACT_MAIN:
    'You need to have at least a contact as the main contact',
  MORE_THAN_ONE_CONTACT_SETTED_MAIN:
    'You had more than 1 contact as the main contact',
};

export default ErrorCodeMessage;
