import { AlertConstants } from '../../constants';

export const AlertActions = {
  success,
  error,
  clear
};

function success(message: any) {
  return { type: AlertConstants.SUCCESS, message };
}

function error(message: any) {
  return { type: AlertConstants.ERROR, message };
}

function clear() {
  return { type: AlertConstants.CLEAR };
}
