import { sparqlEscapeUri, sparqlEscapeDateTime } from "mu";
import { querySudo as query } from "@lblod/mu-auth-sudo";

async function getExportJobForMeeting(meetingUri, date) {
  if (!meetingUri || !date) {
    return null;
  }
  const result = await query(`
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX adms: <http://www.w3.org/ns/adms#>

  SELECT ?id ?uri ?created ?status
  WHERE {
    GRAPH <http://mu.semte.ch/graphs/kaleidos-export> {
      ?uri a ext:PublicExportJob ;
           mu:uuid ?id ;
           dct:created ?created ;
           prov:used ${sparqlEscapeUri(meetingUri)} ;
           adms:status ?status .
      FILTER (?created > ${sparqlEscapeDateTime(date)})
    }
  } ORDER BY ASC(?created) LIMIT 1`);

  const bindings = result.results.bindings;
  if (bindings.length == 1) {
    return {
      data: {
        type: "public-export-jobs",
        id: bindings[0]["id"].value,
        attributes: {
          uri: bindings[0]["uri"].value,
          meeting: meetingUri,
          status: bindings[0]["status"].value,
          created: bindings[0]["created"].value,
        },
      },
    };
  } else {
    return null;
  }
}

export { getExportJobForMeeting };
