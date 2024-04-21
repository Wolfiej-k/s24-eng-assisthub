# AssistHub

## API Documentation

All API queries are of content-type `application/json`.

#### Client type
> | field      |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name | required | `string` | Client name
> | email | required | `string` | Client email address
> | phone | required | `string` | Client phone number
> | zip | required | `string` | Client ZIP code
> | profile | required | `string` | Client profile URL

#### Coach type
> | field      |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | name | required | `string` | Coach name
> | email | required | `string` | Coach email address

#### Case type
> | field      |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | client | required | `Client` | Client associated with case
> | coaches | required | `Coach[]` | Coaches assigned to case
> | data | required | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | required | `Date` | Date case was opened
> | endTime | optional | `Date` | Date case was closed, `null` if still open
> | notes | optional | `string` | Free-form notes about case

#### Creating and updating cases

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
Always returns `200` status with array of `Case` documents. Header `"X-Total-Count"` set to total number of documents.
</details>

<details>
<summary><code>GET</code> <code>/cases/:id</code>: read one case</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `200` with `Case` document if found, and status `404` with body `{ error: "Not found" }` otherwise.
</details>

<details>
<summary><code>POST</code> <code>/cases/</code>: create one case</summary>

##### Request
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | client | required | `Client` | Client associated with case
> | coaches | required | `string[]` | IDs of coaches to assign to case
> | data | required | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | optional | `Date` | Date case was opened, defaults to present
> | endTime | optional | `Date` | Date case was closed
> | notes | optional | `string` | Free-form notes about case

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If there is an issue, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
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
> | coaches | optional | `string[]` | IDs of coaches to assign to case
> | data | optional | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | optional | `Date` | Date case was opened
> | endTime | optional | `Date` | Date case was closed
> | notes | optional | `string` | Free-form notes about case

Any field not supplied defaults to the current entry in the database.

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If the case cannot be found, returns status `404` with body `{error: "Not found"}`. If there is an issue, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
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
> | coaches | required | `string[]` | IDs of coaches to assign to case
> | data | required | `Record<string, string>` | Case metadata, e.g., client form responses
> | startTime | optional | `Date` | Date case was opened, defaults to present
> | endTime | optional | `Date` | Date case was closed
> | notes | optional | `string` | Free-form notes about case

Replaces document entirely with supplied data. When possible, `PATCH` is recommended.

##### Response
Returns status `201` with `Case` document (with populated `coaches`) if case is saved successfully. If the case cannot be found, returns status `404` with body `{error: "Not found"}`. If there is an issue, such as malformed input, returns staus `400` with body `{ error: "Validation failed" }`.
</details>

<details>
<summary><code>DELETE</code> <code>/cases/:id</code>: delete one case</summary>

##### Parameters
> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id | required | `string` | ID of case to query

##### Response
Returns status `204` with empty body if removed, and status `404` with body `{ error: "Not found" }` otherwise.
</details>