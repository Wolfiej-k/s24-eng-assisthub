## AssistHub

To be filled out.

API DOCUMENTATION

    GET:
        There are two GET methods: one to retrieve a specific case, and one to retrieve an array of cases. 

        For the specific case, the function simply takes in the case id and returns the case.

        To retrieve several cases, the function takes in several parameters: _sort, _order, _start, _end.
            _sort takes the value of the name of one of the case fields (ex. client.name), indicating which field is to be sorted by
            _order is either 'asc' or 'desc' indicating the order the sorted list should be outputted in 
            _start and _end are some indices, indicating which indices of the sorted array we display

    POST:
        The POST method allows users to create new cases. They do so by creating a new CaseModel object, taking in all the information associated with a case model (including client, an array of coaches, data, and notes), and autogenerating an id and start time.

    DELETE:
        The DELETE method takes in a case id, and deletes that case from the database.

    PATCH:
        The PATCH method takes an id and a case body, and alters the case with that id according to the case inputted.