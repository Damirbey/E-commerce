
export function getError(err) {
    const message =
      err.response && err.response.data ? err.response.data.message : err.message;
    return message;
}
  