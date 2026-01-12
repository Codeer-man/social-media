export default function getUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}
