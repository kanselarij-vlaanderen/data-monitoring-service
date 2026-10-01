const EMAIL_GRAPH_URI = "http://mu.semte.ch/graphs/system/email";
const EMAIL_FAILBOX_URI = "http://themis.vlaanderen.be/id/mail-folders/3b9836fa-806a-413e-9492-889ac00cc412";

const THEMIS_ENDPOINT_URL = process.env.THEMIS_ENDPOINT_URL ?? "https://themis.vlaanderen.be"
const THEMIS_ENDPOINT_SPARQL = `${THEMIS_ENDPOINT_URL}/sparql`;
const THEMIS_ENDPOINT_DATASETS = `${THEMIS_ENDPOINT_URL}/datasets`;

export {
  EMAIL_GRAPH_URI,
  EMAIL_FAILBOX_URI,
  THEMIS_ENDPOINT_SPARQL,
  THEMIS_ENDPOINT_DATASETS
}
