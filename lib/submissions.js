import { sparqlEscapeDateTime, sparqlEscapeUri } from "mu";
import { querySudo as query } from "@lblod/mu-auth-sudo";

const SUBMISSIONS_GRAPH = "http://mu.semte.ch/graphs/system/submissions";
const SUBMISSION_STATUS_CONCEPT =
  "http://themis.vlaanderen.be/id/indieningstatus/0732c914-3daf-454b-8117-1486ccd3b6e2";
// A submission gets its status ("Ingediend", ...) a few seconds before the
// agenda-submission-service links it to a meeting. Only submissions that were
// last modified longer ago than this grace period are reported.
const SUBMISSION_GRACE_PERIOD_MINUTES = 15;

/**
 * Finds submissions (subm:Indiening) that have a status other than "Concept"
 * but are not linked to an existing meeting (subm:ingediendVoorVergadering).
 *
 * Only concept submissions may exist without a meeting. All other statuses are
 * set by the frontend right before the agenda-submission-service links the
 * submission to a meeting, so a submission is only reported when it was last
 * modified more than SUBMISSION_GRACE_PERIOD_MINUTES ago.
 *
 * Both a missing link and a link to a meeting that no longer exists (for ex the
 * meeting was deleted) are reported.
 *
 * @returns {Promise<Array>} submissions
 */
async function getSubmissionsWithoutMeeting() {
  const modifiedBefore = new Date(Date.now() - SUBMISSION_GRACE_PERIOD_MINUTES * 60 * 1000);
  const result = await query(`
PREFIX subm: <http://mu.semte.ch/vocabularies/ext/submissions/>
PREFIX adms: <http://www.w3.org/ns/adms#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?id ?statusLabel ?created
WHERE {
  GRAPH ${sparqlEscapeUri(SUBMISSIONS_GRAPH)} {
    ?submission a subm:Indiening ;
      mu:uuid ?id .
    OPTIONAL { ?submission dct:created ?created . }
    OPTIONAL { ?submission ext:modified ?modified . }
    OPTIONAL { ?submission adms:status ?status . }
    OPTIONAL { ?submission subm:ingediendVoorVergadering ?meeting . }
  }
  OPTIONAL { GRAPH ?statusGraph { ?status skos:prefLabel ?statusLabel . } }
  FILTER (!BOUND(?status) || ?status != ${sparqlEscapeUri(SUBMISSION_STATUS_CONCEPT)})
  FILTER (!BOUND(?meeting) || NOT EXISTS { GRAPH ?meetingGraph { ?meeting a besluit:Vergaderactiviteit . } })
  FILTER (COALESCE(?modified, ?created, "1970-01-01T00:00:00Z"^^xsd:dateTime) < ${sparqlEscapeDateTime(modifiedBefore)})
}
ORDER BY ?created ?id`);

  return result.results.bindings.map((binding) => ({
    id: binding.id.value,
    statusLabel: binding.statusLabel?.value ?? "(geen status)",
  }));
}

export { getSubmissionsWithoutMeeting };
