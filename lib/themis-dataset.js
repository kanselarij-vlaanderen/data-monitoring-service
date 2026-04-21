import { THEMIS_ENDPOINT_DATASETS } from "../config";

async function getThemisDatasetForMeeting(meetingUri, date) {
  if (!meetingUri || !date) {
    return null;
  }
  const endpoint = new URL(THEMIS_ENDPOINT_DATASETS);
  const params = new URLSearchParams(
    Object.entries({
      "page[size]": 1,
      "page[number]": 0,
      "filter[:gt:release-date]": date.toISOString(),
      "filter[subject]": `${meetingUri}`,
      "filter[type]":
        "http://themis.vlaanderen.be/id/concept/dataset-type/9119805f-9ee6-4ef1-9ef7-ad8dccc2bf2d",
      sort: "release-date",
      "filter[distributions][format]": "text/turtle",
    }),
  );
  endpoint.search = params.toString();

  const result = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/vnd.api+json",
    },
  });
  if (result) {
    const json = await result.json();
    if (json.data[0]) {
      return {
        data: {
          type: "datasets",
          id: json.data[0]["id"],
          attributes: {
            uri: json.data[0]["attributes"]["uri"],
            meeting: json.data[0]["attributes"]["subject"],
            "release-date": json.data[0]["attributes"]["release-date"],
          },
        },
      };
    }
  }
  return null;
}

export { getThemisDatasetForMeeting };
