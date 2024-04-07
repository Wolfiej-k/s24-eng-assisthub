## AssistHub

To be filled out.

API DOCUMENTATION


    GET -- There are two GET methods: one to retrieve a specific case, and one to retrieve several cases. 

    GET /cases/:id
        For the specific case, the function simply takes in the case id in the form of a query string (ex. /api/cases/{id}) and returns the case with the matching id.

        If the case is successfully returned, it will return a 200 status. If there is an issue attaining the case with the input id, it will return a 404 status with a "Not found" error.

    GET /cases
        To retrieve several cases, the function takes in a URL route with several parameters: _sort, _order, _start, _end (ex. /api/cases/{_sort}/{_order}/{_start}/{_end})
            _sort takes the value of the name of one of the case fields (ex. client.name), indicating which field is to be sorted by
            _order is either 'asc' or 'desc' indicating the order the sorted list should be outputted in 
            _start and _end are some indices, indicating which indices of the sorted array we display

        If the case can be found, it will return a 200 status.


    POST /cases
        The POST method allows users to create new cases. This function takes in a JSON object with attributes corresponding to the CaseModel object: client, coaches, data, startTime, endTime, and notes, and autogenerates an id and start time. 
        
        If the case can successfully be saved, it will return a 201 status, and if there is an issue it will return a 400 status with a "Validation failed" error.


    DELETE /cases/:id
        The DELETE method takes in a case id in the form of a query string like /api/cases/{id}, and deletes that case from the database.

        If the case is successfully deleted, it will return a 204 staus. Otherwise, it will return a 404 status with a "Not Found" error.


    PATCH and PUT -- There are two methods we use to update cases: PATCH and PUT. PUT takes an entire JSON object and overrides an entire case whereas PATCH just updates individual fields for a case.

    PATCH /cases/:id
        The PATCH method takes in a case id in the form of a query string like /api/cases/{id} as well as a JSON object with attributes corresponding to the CaseModel object: client, coaches, data, startTime, endTime, and notes, and alters the case with the given id according to the case information inputted. For the PATCH method, these fields are all optional, and the original case will only be overriden with the fields included in the JSON object.
        
        If it successfully saves the case, it will return a status 201. If it cannot save the case, it will return a 400 status with a "Validation failed" error. If the case inputted is not valid, or the id cannot be found, it will return a 404 status with a "Not Found" error.

    PUT /cases/:id
        The PATCH method takes in a case id in the form of a query string like /api/cases/{id} as well as a JSON object with attributes corresponding to the CaseModel object: client, coaches, data, startTime, endTime, and notes, and alters the case with the given id according to the case information inputted. For the PUT method, these fields are all required and the case with the given id will be overriden with all fields.
        
        If it successfully saves the case, it will return a status 201. If it cannot save the case, it will return a 400 status with a "Validation failed" error. If the case inputted is not valid, or the id cannot be found, it will return a 404 status with a "Not Found" error.