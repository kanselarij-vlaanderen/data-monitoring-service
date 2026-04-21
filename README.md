# data-monitoring-service
A service for monitoring some of the data.

Several endpoints are available for creating the dashboard regarding the Kaleidos > Themis process.

## Tutorials

### Add the service to a stack

Add the following snippet to your `docker-compose.yml`:

``` yaml
data-monitoring:
  image: kanselarij/data-monitoring-service:latest
  environment:
    LOG_SPARQL_QUERIES: "false" # reduce polling log, query statements are not logged
    KALEIDOS_HOST_URL: "https://kaleidos.vlaanderen.be/" # how to know what server or host sent the email
    POLLING_CRON_PATTERN: "0 0/10 4-22 * * *" # how often we poll for issues
    EMAIL_FROM_ADDRESS: "noreply@kaleidos.vlaanderen.be"
    EMAIL_TO_ADDRESS_ON_FAILURE: "" # recipients of the emails. If left blank no emails will be created
    THEMIS_ENDPOINT_URL:  "https://themis.vlaanderen.be" # Base url for themis
```

### Add the service to the dispatcher
```elixir
get "/data-monitoring/*path", @json_service do
  Proxy.forward conn, path, "http://data-monitoring/"
end
```
