# data-monitoring-service
A service that exposes known data issues in Kaleidos, so they can be monitored.

The service only answers questions about the data. It does not poll and does not send notifications
itself: the endpoints are called periodically by the Grafana dashboard, which handles the alerting.

All monitoring endpoints answer in the same way:

- `204` without a body when there is nothing to report;
- `200` when an issue is found, with one entry per affected resource. Each entry only contains the
  uuid of the resource and a message, never the content of the resource itself:

``` json
{
  "data": [
    {
      "type": "submissions",
      "id": "6AA2DA4534879D2E9D1938BD",
      "attributes": { "message": "Submission with uuid 6AA2DA4534879D2E9D1938BD has status \"Ingediend\" but is not linked to a meeting" }
    }
  ],
  "meta": { "count": 1 }
}
```

## Tutorials

### Add the service to a stack

Add the following snippet to your `docker-compose.yml`:

``` yaml
data-monitoring:
  image: kanselarij/data-monitoring-service:latest
  environment:
    LOG_SPARQL_QUERIES: "false" # the endpoints are polled, query statements are not logged
    THEMIS_ENDPOINT_URL:  "https://themis.vlaanderen.be" # Base url for themis
```

### Add the service to the dispatcher
```elixir
get "/data-monitoring/*path", @json_service do
  Proxy.forward conn, path, "http://data-monitoring/"
end
```

## Reference

### Configuration

| Environment variable | Default | Description |
|---|---|---|
| `THEMIS_ENDPOINT_URL` | `https://themis.vlaanderen.be` | Base URL of Themis (dashboard endpoints) |

### API

#### `GET /submissions/without-meeting`
A submission (`subm:Indiening`) may only exist without a meeting (`subm:ingediendVoorVergadering`)
while it has the status "Concept". Every other status is set by the frontend right before the
agenda-submission-service links the submission to a meeting. When that second step fails, or when
the meeting is deleted afterwards, the submission ends up in a state in which it cannot be opened
or followed up correctly.

The endpoint reports every submission that

- has a status other than "Concept" (or no status at all), and
- has no `subm:ingediendVoorVergadering`, or one that points to a meeting that no longer exists, and
- was last modified more than 15 minutes ago (to skip submissions that are being submitted at that
  very moment).

A submission is reported for as long as it is in that state. Fixing it is (for now) a manual
action: link it to the correct (design) agenda.

Message: `Submission with uuid <uuid> has status "<status>" but is not linked to a meeting`

#### `GET /emails/failed`
Reports the e-mails the deliver-email-service moved to the failbox after its retries failed.

Only the uuid is returned: e-mails can contain sensitive information, so no subject, address or
content is exposed. Every e-mail in the failbox is reported for as long as it stays there, so the
failbox has to be emptied before this endpoint is used for alerting (old failed e-mails would
otherwise keep triggering it).

Message: `Mail-delivery has failed for email with uuid <uuid>`

#### Dashboard endpoints (Kaleidos > Themis process)
Answer `200` with the first matching record created after `startDate`, `204` when there is none.

- `GET /meeting/:uuid/public-export-jobs?startDate=`
- `GET /meeting/:uuid/tto-to-delta-task?startDate=`
- `GET /meeting/:uuid/themis-sync-task?startDate=`
- `GET /meeting/:uuid/themis-release-task?startDate=`
- `GET /meeting/:uuid/themis-dataset?startDate=`
