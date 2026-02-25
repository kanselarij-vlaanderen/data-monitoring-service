import { querySudo } from '@lblod/mu-auth-sudo';

async function countPiecesWithoutType() {
  const query = `
  PREFIX dossier: <https://data.vlaanderen.be/ns/dossier#>

  SELECT (COUNT(?piece) as ?pieces) 
  FROM <http://mu.semte.ch/graphs/organizations/kanselarij>
  WHERE {
    ?documentContainer a dossier:Serie .
        ?documentContainer dossier:Collectie.bestaatUit ?piece  .
    FILTER NOT EXISTS { ?piece a ?type . }
  }
  `
  const queryResult = await querySudo(query);
  return queryResult.results?.bindings[0]?.pieces?.value | 0;
}

async function countPiecesWithoutId() {
  const query = `
  PREFIX dossier: <https://data.vlaanderen.be/ns/dossier#>
  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>

  SELECT (COUNT(?piece) as ?pieces) 
  FROM <http://mu.semte.ch/graphs/organizations/kanselarij>
  WHERE {
    ?documentContainer a dossier:Serie .
        ?documentContainer dossier:Collectie.bestaatUit ?piece  .
    FILTER NOT EXISTS { ?piece mu:uuid ?id . }
  }
  `
  const queryResult = await querySudo(query);
  return queryResult.results?.bindings[0]?.pieces?.value | 0;
}

export {
  countPiecesWithoutType,
  countPiecesWithoutId,
}