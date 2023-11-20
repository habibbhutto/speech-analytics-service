# Speech Analysis Service

A backend service provides endpoints to get the analysis of presidents' speeches. At 
this point of time, it's a simple service with one endpoint, moving forward it could be
extended with other features as the needs arise.

## Dependencies
* nodejs V18
* npm or pnpm latest version
* postgresql
* docker latest with `docker compose` plugin configured  

## Features
* Provides an endpoint to retrieve basic statistics of presidents' speeches 
* Provides swagger docs of the endpoint 
* Cache the evaluated URLs for a preconfigured time duration
* Refresh the cache by passing the refresh=true in query parameters 

## Future improvements
* Terraform or some sort of automation to provision infra
* K8s deployement template
* Redis for centralized cache
* Application monitoring 
* Better application logging tools

## Running the app

### Step 1. Clone the repository 

```
git clone [https://github.com/habibbhutto/speech-analysis-svc.git]
```
### Step 2. Spin up the app

```
docker compose up
```

### Step 3. Call the endpoint to get the evaluation 

Open the following link into your browser

```
http://localhost:8080/api/evaluate?url=[your url here]
```

## Contributing
The `pnpm` package manager helps to bring docker image size down significantly.

To install `pnpm` run the following command.

```
npm install -g pnpm
```

### Developing and testing
You would need to run the tests in local development environment to test your changes.

Follow these steps to run the tests in local development environment.

#### Step 1.  Spin up the postrgresql instance using docker compose
```
docker compose -f docker-compose-db.yaml
```
#### Step 2. Running the tests  

Run the **unit tests** by executing the following command
```
pnpm run tests
```
Or if you prefer `npm`
```
npm run tests
```

Run the **e2e tests** by executing the following command
```
pnpm run tests:e2e
```
Or if you prefer `npm`
```
npm run tests:e2e
```

### Developing the app with live changes

You would need to run the app in dev mode to speed up testing with live changes.

The docker compose file `docker-compose-dev.yaml` is configured for that purpose. It provides instant local development environment.

#### Step 1. Spin up the app and its dependencies
```
docker compose -f docker-compose-dev.yaml up
```

#### Step 2. Now, you can make your changes
As soon as you save your changes the app would restart automatically.

### Developing the app using local nodejs environment
You would need to run postgresql instance using docker.

#### Step 1. Sping the postgresql instance
```
docker compose -f docker-compose-db.yaml
```

#### Step 2. Now, you can run one of the following commands as per your need

Running the tests
```
pnpm run tests
```

Running the tests watching for changes
```
pnpm run tests:watch
```

Running the e2e tests
```
pnpm run tests:e2e
```

Running the e2e tests watching for changes
```
pnpm run tests:e2e:watch
```

Running the app watching for changes
```
pnpm run start:dev
```

Running the worker watching for changes
```
pnpm run start:worker:dev
```