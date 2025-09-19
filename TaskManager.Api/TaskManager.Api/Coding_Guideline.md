#Coding Guidelines for Task Manager

1. All async methods must use the Async suffix
   2.use DTOs (TaskCreatedto, TaskUpdateDto) for request/response instead of Ef entities
2. always validate input (i.e. null or empty string)
3. controller must delegate to service = no Db logic inside controller
4. handle error gracefully with proper HTTP status codes(400, 404, 500).
5. Define interfaces and services
