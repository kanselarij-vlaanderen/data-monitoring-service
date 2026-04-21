import { query, sparqlEscapeString } from "mu";

const getMeetingURI = async (meetingId) => {
  const queryString = `
  PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
  SELECT DISTINCT ?meeting WHERE {
    ?meeting a besluit:Vergaderactiviteit ;
      mu:uuid ${sparqlEscapeString(meetingId)} .
  }`;

  const queryResult = await query(queryString).catch((err) => {
    console.error(err);
  });
  if (queryResult.results.bindings.length) {
    return queryResult.results.bindings[0].meeting.value;
  }
  throw new Error(`Meeting with id ${meetingId} not found`);
};

export { getMeetingURI };
