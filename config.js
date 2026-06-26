const ADMIN_ROLE = 'http://themis.vlaanderen.be/id/gebruikersrol/9a969b13-e80b-424f-8a82-a402bcb42bc5';

const THEMIS_ENDPOINT_URL = process.env.THEMIS_ENDPOINT_URL ?? "https://themis.vlaanderen.be"
const THEMIS_ENDPOINT_SPARQL = `${THEMIS_ENDPOINT_URL}/sparql`;
const THEMIS_ENDPOINT_DATASETS = `${THEMIS_ENDPOINT_URL}/datasets`;

export {
  ADMIN_ROLE,
  THEMIS_ENDPOINT_SPARQL,
  THEMIS_ENDPOINT_DATASETS
}
