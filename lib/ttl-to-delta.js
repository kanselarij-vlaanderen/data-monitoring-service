import { sparqlEscapeUri, sparqlEscapeDateTime } from "mu";
import { querySudo as query } from "@lblod/mu-auth-sudo";

async function getTtlToDeltaTaskForMeeting(meetingUri, date) {
  if (!meetingUri || !date) {
    return null;
  }
  const result = await query(`
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX adms: <http://www.w3.org/ns/adms#>

  SELECT ?id ?uri ?created ?status
  WHERE {
    GRAPH <http://mu.semte.ch/graphs/themis-public> {
      ?uri a ext:TtlToDeltaTask ;
           mu:uuid ?id ;
           dct:subject ${sparqlEscapeUri(meetingUri)} ;
           adms:status ?status ;
           dct:created ?created .
          FILTER (?created > ${sparqlEscapeDateTime(date)})
    }
  } ORDER BY ASC(?created) LIMIT 1`);

  const bindings = result.results.bindings;
  if (bindings.length == 1) {
    return {
      data: {
        type: "ttl-to-delta-tasks",
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

export { getTtlToDeltaTaskForMeeting };
