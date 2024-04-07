## AssistHub

To be filled out.

API DOCUMENTATION

    GET: There are two GET methods: one to retrieve a specific case, and one to retrieve several cases. 

    GET (one case):
        For the specific case, the function simply takes in the case id in the form of a query string like /api/cases/{id}?{params} and returns the case with the matching id.

        If the case is successfully returned, it will return a 200 status. If there is an issue attaining the case with the input id, it will return a 404 status with a "Not found" error.

    GET (several cases):
        To retrieve several cases, the function takes in a JSON object with several attributes: _sort, _order, _start, _end
            _sort takes the value of the name of one of the case fields (ex. client.name), indicating which field is to be sorted by
            _order is either 'asc' or 'desc' indicating the order the sorted list should be outputted in 
            _start and _end are some indices, indicating which indices of the sorted array we display

        If the case can be saved, it will return a 200 status.

    POST:
        The POST method allows users to create new cases. This function takes in a JSON object with attributes corresponding to the CaseModel object: client, coaches, data, startTime, endTime, and notes, and autogenerates an id and start time. 
        
        If the case can successfully be saved, it will return a 201 status, and if there is an issue it will return a 400 status with a "Validation failed" error.

    DELETE:
        The DELETE method takes in a case id in the form of a query string like /api/cases/{id}?{params}, and deletes that case from the database.

        If the case is successfully deleted, it will return a 204 staus. Otherwise, it will return a 404 status with a "Not Found" error.

    PATCH:
        The PATCH method takes in a case id in the form of a query string like /api/cases/{id}?{params} as well as a JSON object with attributes corresponding to the CaseModel object: client, coaches, data, startTime, endTime, and notes, and alters the case with the given id according to the case information inputted. 
        
        If it successfully saves the case, it will return a status 201. If it cannot save the case, it will return a 400 status with a "Validation failed" error. If the case inputted is not valid, or the id cannot be found, it will return a 404 status with a "Not Found" error.