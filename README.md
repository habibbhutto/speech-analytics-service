# Speech Analytics Service

Speech Analytics is a backend service that provides endpoints to get the analysis of political speeches. At 
this point of time, it's a simple service with one endpoint `GET /api/evaluation`, moving forward it could be
extended with other features as the need arises.

Assumptions:
1. The data in remote CSV files is assumed to be final, there would be no new data added to a given file by any external actor.
2. Given assumption #1, it is assumed that the service doesn't need to re-sync the CSV data.
3. GET /api/evaluation is supposed to evaluate data of given URLs only.
4. The CSV files may contain large amount of data.

Design decisions:
1. Based on assumption #4, the system leverages a SQL database to store and query the large data.
1. The system streams down the CSV data to an SQL table.
2. The table is queried using SQL queries generating evaluation efficiently.
3. Given assumption #2, If the CSV file URL has already been downloaded in past, it doesn't need to redownload the data, it saves time and computation resources.
4. Based on assumption #3, it filters the data for given URLs so that it evaluates only given URLs.

If the assumptions #1 and #2 change in the future, then current design can easily be extended to support caching/re-sync kind of mechanism by leveraging the `updated` field in the SQL table. 

For demo [click here](https://drive.google.com/file/d/1txFcSgZVDOYLmSfF-VAykOetD404cznT/view?usp=drive_link). For more details please visit [this document](https://docs.google.com/document/d/1bgzhiYDDLzpp0YVitLYvNOZWKBM9WWE9WT--sp3cYZI/edit?usp=drive_link).

## Dependencies
* nodejs V18
* npm or pnpm latest version
* postgresql
* docker latest with `docker compose` plugin configured  

## Features
* Provides an endpoint `GET /api/evaluation` to retrieve basic statistics of political speeches, it requires one or more Url(s) to remote CSV data in the `url` query parameter.
* Downloads and stores the remote data in an SQL database for improved efficiency.
* Provides swagger docs of the endpoint.

## Future improvements
* adding retry mechanism to download of remote CSV data
* Terraform or some sort of automation to provision infra
* K8s deployement template
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

#### API Docs
Click [http://localhost:8080/](http://localhost:8080/) to open up swagger docs.

#### Curl command
Execute the following command to call the endpoint using `curl`.

```
curl http://localhost:8080/api/evaluate?url=[your url here]
```
or

```
curl http://localhost:8080/api/evaluate?url=[your url here]&url=[your url here]
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

Run the **tests** by executing the following command
```
pnpm run tests
```
Or if you prefer `npm`
```
npm run tests
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

#### Step 1. Spin the postgresql instance
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

Running the app watching for changes
```
pnpm run start:dev
```