# data-monitoring-service
A service to monitor known data issues and notify via e-mail

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
```
