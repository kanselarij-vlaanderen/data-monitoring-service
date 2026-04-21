import { sparqlEscapeUri, sparqlEscapeDateTime } from "mu";
import { THEMIS_ENDPOINT_SPARQL } from "../config";

async function getThemisReleaseTaskForMeeting(meetingUri, date) {
  if (!meetingUri || !date) {
    return null;
  }
  const query = `
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX adms: <http://www.w3.org/ns/adms#>
 
   SELECT ?id ?uri ?created ?status
   WHERE {
      ?uri a ext:ReleaseTask ;
          mu:uuid ?id ;
          dct:subject ${sparqlEscapeUri(meetingUri)} ;
          adms:status ?status ;
          dct:created ?created .
          FILTER (?created > ${sparqlEscapeDateTime(date)})
   } ORDER BY ASC(?created) LIMIT 1
  `;
  const encodedQuery = "query=" + encodeURI(query);
  const result = await fetch(THEMIS_ENDPOINT_SPARQL, {
    headers: {
      accept: "application/sparql-results+json,*/*;q=0.9",
      "accept-language": "en-US,en;q=0.9,nl;q=0.8",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: encodedQuery,
    method: "POST",
  });

  if (result) {
    const json = await result.json();
    if (json.results.bindings.length) {
      const resultBinding = json.results.bindings[0];
      return {
        data: {
          type: "release-tasks",
          id: resultBinding["id"]?.value,
          attributes: {
            uri: resultBinding["syncTask"]?.value,
            meeting: meetingUri,
            created: resultBinding["created"]?.value,
            status: resultBinding["status"]?.value,
          },
        },
      };
    }
    return null;
  }
}

export { getThemisReleaseTaskForMeeting };
