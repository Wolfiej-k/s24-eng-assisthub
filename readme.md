# AssistHub × T4SG

## Structure

The [frontend](frontend) is a static [Refine](https://refine.dev/) application built on Vite. It is served independently using [nginx](https://nginx.org/en/), and requests data from the Node.js [backend](backend) via RESTful API routes. Lastly, a locally-hosted [MongoDB](https://www.mongodb.com/) database interfaces with the backend to store persistent data. All three of these components are containerized and production-ready. After completing the [Auth0 Setup](#auth0) and [Admin Setup](#admin) steps below, simply run the two commands below in a terminal to build and run the app:

```bash
> docker-compose build
> docker-compose up
```

## Prerequisites
For Windows devices, make sure to have Windows Subsystem for Linux (wsl) and Docker installed.

## `.env` Setup
Throughout, environment variables refers to a root `.env` file. Create this `.env` file in the root folder.
```env
ADMIN_SECRET=""
AUTH0_DOMAIN=""
AUTH0_AUDIENCE=""
AUTH0_APP_CLIENTID=""
AUTH0_API_CLIENTID=""
AUTH0_API_SECRET=""
```

To develop the frontend and backend, create `.env` files in the respective directories with the variables listed in [docker-compose.yml](docker-compose.yml) and run `npm run dev` in the terminal.

## <a name="auth0"></a>Auth0 Setup

We use the [Auth0](https://auth0.com/) provider for authentication and authorization. 

1. Register an account (the free plan is generous, but they also have discounted plans for nonprofits)
2. By default, the tenant you have (listed in the top left) is a development tenant. Click on the arrow in the top left next to where it says development and select "Create Tenant" from the menu.
3. Click "Create Tenant" on the right of the page that appears. Select "Production" as the environment tag. Scroll down to the bottom and choose a Tenant Domain, such as `assisthub.auth0.com`. Save it in the `AUTH0_DOMAIN` env variable.
4. Click "Create" on the bottom right. After the page finishes loading, you should see a new entry in the table with the Tenant Domain you chose. Click into this tenant.

#### In Applications/Applications

1. Create an application, either by clicking "Create Application" on the homepage or going to "Applications -> Create Application" (button is on top right). Give it an informative name and select "Single Page Web Applications" as the application type. 
2. Go to the "Settings" tab. In the "Basic Information" section, record the "Client ID" and save it to the env variable `AUTH0_APP_CLIENTID`. 
3. In "Application Properties", provide an image URL for the sign-in page logo. 
4. In "Application URIs", set "Allowed Callback URLs" and "Allowed Logout URLs" to your site domain (e.g., `http://localhost` for testing), and set "Application Login URI" to the same URI plus `/login` (note that this must be a live page; leave it blank when testing). 
5. Disable "Cross-Origin Authentication"
6. Navigate to the "Connections" tab and disable social.

#### In Applications/APIs

1. Create a new API. Choose an arbitrary identifier, such as `https://assisthub/api/`, and save it to the env variable `AUTH0_AUDIENCE`. Ensure that "Signing Algorithm" is set to `RS256`.

2. Return to the list of APIs, and navigate to "Auth0 Management API". In "API Explorer", click the button to create a test application. Then, in `Applications/Applications`, navigate to "API Explorer Application". Save the "Client ID" and "Client Secret" to the env variables `AUTH0_API_CLIENTID` and `AUTH0_API_SECRET`, respectively.

#### In Authentication/Database

1. Navigate to the "Username-Password-Authentication" database and toggle disable sign ups on.

## <a name="admin"></a> Admin Setup

1. Set the env variable `ADMIN_SECRET` to a secure password for admin-authorized requests. Note that any individual with this code has complete access to all API routes; see the [API documentation](docs.md) for more information. 

2. Now **run the production app** with the Docker commands listed in [structure](readme.md#structure). Make sure that Docker is running before running the commands!

To create the first admin-level user, which can then add new coaches, use an HTTP API request. For example, in bash,
```bash
curl -XPOST -H 'Secret: [admin secret]' -H "Content-type: application/json" -d '{"name": [your name], "email": [your email], "admin": true}' '[domain]:5000/api/coaches'
```