## Deployment
### Prerequisites
- Docker & Docker Compose Plugin

### Steps
- Grab the `docker-compose.yml` file from the root of the repository.
- Create a `.env` file based on `.env-example` in the same directory as `docker-compose.yml`.
- Run `docker compose up -d`.
- Wait for application to start. You should be able to access it on `http://localhost:80`.

You don't need to clone this entire repository in order to deploy this application, but you'll need adjust the paths in `.env` to appropriate directories.

> [!WARNING]
> If you are running deploying the app on Linux or WSL, then you'll need to run `db/fix-data-permissions.sh` script. This is due to used database image running with uid and gid `54321`, and expects it for its data directory.

> [!WARNING]
> By default, when the application is started for first time, then admin user with username `admin` and password `adminpass` is created. You should change password of this user as soon as possible.

## Development
We recommend using IntelliJ Idea Ultimate Edition for development with project folder opened as project.

#### Prerequisites
- Java 21
- Node 22 + NPM
- Deno 2
- Docker & Docker Compose Plugin

### Preparation
- Clone this repository.
- Run `npm install` in the `ui` folder.
- Run `deno install` in the `formatter` folder.

### Launching individual components
- Development database may be launched by running `docker-compose up -d` in the `db/dev` directory.
- API may be launched from your development environment or via Gradle using `./gradlew bootRun` in `api` directory. The API is listening on port `8080`.
- UI may be launched by running `npx nx s` in the `ui` directory. The UI server is listening on port `4200` and is reverse proxying requests to the API.
- Formatter may be launched by running `deno task dev` in the `formatter` directory.

> [!WARNING]
> If you are running deploying the app on Linux or WSL, then you'll need to run `db/fix-data-permissions.sh` script. This is due to used database image running with uid and gid `54321`, and expects it for its data directory.

> [!NOTE]
> You may need to adjust a path in `api/src/main/resources/application.properties` if your working directory is not the root of this repository when launching the API.

> [!NOTE]
> You NEED to adjust the formatter URL in `api/src/main/resources/application.properties` if you want to use the formatter service. If this URL is not specified, then the fallback trimming formatter is used.
