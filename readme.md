# AssistHub $\times$ T4SG

## Structure

The [frontend](frontend) is a static [Refine](https://refine.dev/) application built on Vite. It is served independently using [nginx](https://nginx.org/en/), and requests data from the Node.js [backend](backend) via RESTful API routes. Lastly, a locally-hosted [MongoDB](https://www.mongodb.com/) database interfaces with the backend to store persistent data. All three of these components are containerized and production-ready:

```bash
> docker-compose build
> docker-compose up
```

Throughout, environment variables refers to a root `.env` file:
```env
ADMIN_SECRET=""
AUTH0_DOMAIN=""
AUTH0_AUDIENCE=""
AUTH0_APP_CLIENTID=""
AUTH0_API_CLIENTID=""
AUTH0_API_SECRET=""
```

To develop the frontend and backend, create `.env` files in the respective directories with the variables listed in [docker-compose.yml](docker-compose.yml) and `npm run dev`.

## Auth0 Setup

We use the [Auth0](https://auth0.com/) provider for authentication and authorization. Register an account (the free plan is generous, but they also have discounted plans for nonprofits), and create a production tenant. Choose a domain, such as `assisthub.auth0.com`, and save it in the `AUTH0_DOMAIN` env variable.

#### In Applications/Applications

Create a new single page web application. In "Basic Information", record the "Client ID" and save it to the env variable `AUTH0_APP_CLIENTID`. In "Application Properties", provide an image URL for the sign-in page logo. In "Application URIs", set "Allowed Callback URLs" and "Allowed Logout URLs" to your site domain (e.g., `http://localhost` for testing), and set "Application Login URI" to the same URI plus `/login` (note that this must be a live page; leave it blank when testing). Disable "Cross-Origin Authentication". Navigate to the "Connections" tab and disable social.

#### In Applications/APIs

Create a new API. Choose an arbitrary identifier, such as `https://assisthub/api/`, and save it to the env variable `AUTH0_AUDIENCE`. Ensure that "Signing Algorithm" is set to `RS256`.

Return to the list of APIs, and navigate to "Auth0 Management API". In "API Explorer", click the button to create a test application. Then, in `Applications/Applications`, navigate to "API Explorer Application". Save the "Client ID" and "Client Secret" to the env variables `AUTH0_API_CLIENTID` and `AUTH0_API_SECRET`, respectively.

#### In Authentication/Database

Navigate to the "Username-Password-Authentication" database and disable sign ups.

## Admin Setup

Set the env variable `ADMIN_SECRET` to a secure password for admin-authorized requests. Note that any individual with this code has complete access to all API routes; see the [API documentation](docs.md) for more information. Now **run the production app** with the Docker commands listed in [structure](readme.md#structure).

To create the first admin-level user, which can then add new coaches, use an HTTP API request. For example, in bash,
```bash
curl -XPOST -H 'Secret: [admin secret]' -H "Content-type: application/json" -d '{"name": [your name], "email": [your email], "admin": true}' '[domain]:5000/api/coaches'
```