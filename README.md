# Pdf my HTML

### Setup Instructions

Copy .env-sample to .env

`cp .env-sample .env`

### Usage

```bash
# Check health
curl 'http://localhost:8081/health-check'

# Create cache
curl -X POST 'http://localhost:8000/cache'\
    -H 'Content-Type: application/json'\
    -d '{"url": "https://reliefweb.int/report/world/drowning-and-dehydration-are-main-causes-migrant-deaths-horn-africa"}'

# Get cache
curl 'http://localhost:8081/cache?url=https://reliefweb.int/report/world/drowning-and-dehydration-are-main-causes-migrant-deaths-horn-africa'

# Get cache file
curl 'http://localhost:8081/cache-file?hash=<hash>'
```
