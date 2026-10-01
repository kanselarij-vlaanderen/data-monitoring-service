import { sparqlEscapeUri } from "mu";
import { querySudo as query } from "@lblod/mu-auth-sudo";
import { EMAIL_GRAPH_URI, EMAIL_FAILBOX_URI } from "../config";

/**
 * Finds the e-mails the deliver-email-service moved to the failbox after its retries failed.
 *
 * Only the uuid of each e-mail is returned: e-mails can contain sensitive information,
 * so nothing else (subject, addresses, content) may leave this service.
 *
 * @returns {Promise<Array<string>>} uuids of the failed e-mails
 */
async function getFailedEmailIds() {
  const result = await query(`
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX nmo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#>

SELECT DISTINCT ?id
WHERE {
  GRAPH ${sparqlEscapeUri(EMAIL_GRAPH_URI)} {
    ?email a nmo:Email ;
      mu:uuid ?id ;
      nmo:isPartOf ${sparqlEscapeUri(EMAIL_FAILBOX_URI)} .
  }
}
ORDER BY ?id`);

  return result.results.bindings.map((binding) => binding.id.value);
}

export { getFailedEmailIds };
