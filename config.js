
const KALEIDOS_HOST_URL = process.env.KALEIDOS_HOST_URL ?? 'https://kaleidos.vlaanderen.be/';
const POLLING_CRON_PATTERN = process.env.POLLING_CRON_PATTERN || '0 0/10 4-22 * * *'; // every 10 min between 4 and 22

const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS ?? 'noreply@kaleidos.vlaanderen.be';
const EMAIL_TO_ADDRESS_ON_FAILURE = process.env.EMAIL_TO_ADDRESS_ON_FAILURE ?? '';
const RESOURCE_BASE_URI  = 'http://themis.vlaanderen.be';
const EMAIL_GRAPH_URI = "http://mu.semte.ch/graphs/system/email";
const EMAIL_OUTBOX_URI = "http://themis.vlaanderen.be/id/mail-folders/4296e6af-7d4f-423d-ba89-ed4cbbb33ae7";

export {
  KALEIDOS_HOST_URL,
  POLLING_CRON_PATTERN,
  EMAIL_FROM_ADDRESS,
  EMAIL_TO_ADDRESS_ON_FAILURE,
  RESOURCE_BASE_URI,
  EMAIL_GRAPH_URI,
  EMAIL_OUTBOX_URI
}