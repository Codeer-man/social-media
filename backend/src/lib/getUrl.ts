export function getUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

export function frontendUrl() {
  return process.env.FRONTEND_URL;
}
