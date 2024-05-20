## API Documentation

All API queries are of content-type `application/json`. In order to authorize a request, either set the `"Secret"` header to the admin secret (as specified in an environmental variable) or supply an Auth0-issued JWT in the `"Authorization"` header. In the following, we assume this has been done; otherwise, all routes return status `401` with body `{ error: "Unauthorized" }`. Lastly, unspecified errors (such as attempting to update a record in parallel with another requester) trigger status `500` with body `{ error: "Internal server error" }`; see log for more details.

#### Client schema
> | field      | data type               | description                                                           |
> |------------|-------------------|-----------------------------------------------------------------------|
> | name | `string` | Client name
> | email | `string` | Client email address
> | phone | `string` | Client phone number
> | zip | `string` | Client ZIP code
> | profile | `string` | Client profile URL

#### Coach schema
> | field      |data type               | description                                                           |
> |------------|-------------------|-----------------------------------------------------------------------|
> | name | `string` | Coach name
> | email | `string` | Coach email address
> | admin | `boolean` | Coach has admin privileges, i.e., may access all routes

#### Case schema
> | field      |data type               | description                                                           |
> |------------|-------------------|-----------------------------------------------------------------------|
> | client | `Client` | Client associated with case
> | coaches | `Coach[]` | Coaches assigned to case
> | benefits | `string[]` | Benefits associated with case
> | data | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | `Date` | Date case was opened
> | endTime | `Date?` | Date case was closed, `undefined` if still open
> | notes | `string` | Free-form notes about case
> | files | `{ name: string, data: string }[]` | Files associated with case, where `name` is the filename and `data` is its base64 encoding

#### Creating and updating cases

See [source](/backend/src/api/cases.ts).

<details>
<summary><code>GET</code> <code>/cases/</code>: read all or many cases</summary>

##### Queries
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | _sort | optional | `string` | Name of the case field (e.g., "client.name") to sort by |
> | _order | optional | `"asc"` or `"desc"` | Sort in ascending or descending order
> | _start | optional | `number` | Starting index of result in sorted order
> | _end | optional | `number` | Ending index of result in sorted order, inclusive

##### Response
Always returns `200` status with array of `Case` documents that *the sender is assigned to*. Only admin-authorized requests (i.e., admin secret or account with admin privileges) see the entire list. Header `"X-Total-Count"` set to total number of documents.
</details>

<details>
<summary><code>GET</code> <code>/cases/:id</code>: read one case</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `200` with `Case` document if found and authorized. If the requester is not admin and not assigned to the case, returns status `403` with body `{ error: "Forbidden }`. If the case cannot be found, returns status `404` with body `{ error: "Not found" }`.
</details>

<details>
<summary><code>POST</code> <code>/cases/</code>: create one case</summary>

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | client | required | `Client` | Client associated with case
> | coaches | optional | `string[]` | IDs of coaches assigned to case, default `[]`
> | benefits | optional | `string[]` | Benefits associated with case, default `[]`
> | data | optional | `Record<string, string>` | Case metadata, e.g., client form responses, default `{}`
> | startTime | optional | `Date` | Date case was opened, default present
> | endTime | optional | `Date` | Date case was closed
> | notes | optional | `string` | Free-form notes about case, default `"`
> | files | optional | `{ name: string, data: string }[]` | Files associated with case, where `name` is the filename and `data` is its base64 encoding, default `[]`

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>PATCH</code> <code>/cases/:id</code>: update one case (field-by-field)</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to update

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | client | optional | `Client` | Client associated with case
> | coaches | optional | `string[]` | IDs of coaches assigned to case
> | benefits | optional | `string[]` | Benefits associated with case
> | data | optional | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | optional | `Date` | Date case was opened
> | endTime | optional | `Date` | Date case was closed
> | notes | optional | `string` | Free-form notes about case

Any field not supplied defaults to the current entry in the database.

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If the requester is not admin and not assigned to the case, returns status `403` with body `{ error: "Forbidden }`. If the case cannot be found, returns status `404` with body `{ error: "Not found" }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>PUT</code> <code>/cases/:id</code>: update one case (entire)</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to update

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | client | required | `Client` | Client associated with case
> | coaches | optional | `string[]` | IDs of coaches assigned to case, default `[]`
> | benefits | optional | `string[]` | Benefits associated with case, default `[]`
> | data | optional | `Record<string, string>` | Case metadata, e.g., client form responses, default `{}`
> | startTime | optional | `Date` | Date case was opened, default present
> | endTime | optional | `Date?` | Date case was closed
> | notes | optional | `string` | Free-form notes about case, default `"`

Replaces document entirely with supplied data. When possible, `PATCH` is recommended.

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If the requester is not admin and not assigned to the case, returns status `403` with body `{ error: "Forbidden }`. If the case cannot be found, returns status `404` with body `{ error: "Not found" }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>DELETE</code> <code>/cases/:id</code>: delete one case</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `204` with empty body if removed. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If the case cannot be found, returns status `404` with body `{ error: "Not found" }`. 
</details>



#### Creating and updating coaches

See [source](/backend/src/api/coaches.ts). All coach mutations are pushed-forward to the Auth0 database via the [management API](https://auth0.com/docs/api/management/v2). If these requests fail, returns status `500` with body `{ error: "Internal server error" }`; any changes to internal storage are undone.

<details>
<summary><code>GET</code> <code>/coaches/</code>: read all or many coaches</summary>

##### Response
Returns status `200` and array of `Coach` documents if authorized. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`.
</details>

<details>
<summary><code>GET</code> <code>/coaches/:id</code>: read one coach</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `200` with `Coach` document if found authorized. If the requester is not admin and does not have ID equal to `id`, returns status `403` with body `{ error: "Forbidden }`. If the case cannot be found, returns status `404` with body `{ error: "Not found" }`.
</details>

<details>
<summary><code>POST</code> <code>/coaches/</code>: create one coach</summary>

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name | required | `string` | Coach name
> | email | required | `string` | Coach email address
> | admin | optional | `boolean` | Coach has admin privileges, i.e., may access all routes, default `false`

##### Response
Returns status `201` with `Coach` document if coach is saved successfully. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>PATCH</code> <code>/coaches/:id</code>: update one coach (field-by-field)</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of coach to update

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name | optional | `string` | Coach name
> | email | optional | `string` | Coach email address
> | admin | optional | `boolean` | Coach has admin privileges

Any field not supplied defaults to the current entry in the database.

##### Response
Returns status `201` with `Coach` document if coach is saved successfully. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If the coach cannot be found, returns status `404` with body `{ error: "Not found" }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>PUT</code> <code>/coaches/:id</code>: update one coach (entire)</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of coach to update

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name | required | `string` | Coach name
> | email | required | `string` | Coach email address
> | admin | optional | `boolean` | Coach has admin privileges, default `false`

Replaces document entirely with supplied data. When possible, `PATCH` is recommended.

##### Response
Returns status `201` with `Coach` document if coach is saved successfully. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If the coach cannot be found, returns status `404` with body `{ error: "Not found" }`. If there is an issue with saving, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>DELETE</code> <code>/coaches/:id</code>: delete one coach</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `204` with empty body if removed. If the requester is not admin, returns status `403` with body `{ error: "Forbidden }`. If the coach cannot be found, returns status `404` with body `{ error: "Not found" }`. 
</details>