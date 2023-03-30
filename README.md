# chat-application
- This repository contains backend and frontend code for chat application. Frontend uses Angular and backend uses Spring Boot.

- In the chat application, user can start by providing the username. The application allows the users, connected to the same server, to communicate publicly and privately to other users. There is a public chatroom as well as one-on-one chatroom to communicate privately.

## Backend
- Spring Boot Maven Project
- **Dependency:** Spring WebSocket
- Stomp Endpoint: `http://localhost:9090/ws`
- Message Broker prefixes: `/user`, `/chatroom`
- APIs:
	- `/app/message/`: redirects the message to `/chatroom/public`
	- `/app/private-message`: redirects the message to `/user/{receiverName}/private`

### Building the project
To build the backend, run the command: `mvn clean install`

### Running the project
To run the Spring Boot application, run the command: `mvn spring-boot:run`

## Frontend
- Angular Project
- **Dependencies:** Angular Material, sockjs-client, stompjs
- Stomp Client is used to connect to web-socket endpoint, subscribe to message broker, and send messages.
- Each user listens to 2 message brokers:
	- `/chatroom/public`: to get public messages
	- `/user/{username}/private`: to get private messages
- Each user uses 2 backend APIs :
	- `/app/message/`: to send message to public chatroom
	- `app/private-message`: to send message to another user

### Running the project
To run the Angular application, run the command: `ng serve`
