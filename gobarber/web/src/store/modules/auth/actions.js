export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    paylod: { token, user },
  };
}

export default function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}
