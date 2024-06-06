# NodeJS

# NodeJs

NodeJS is a single-threaded and asynchronous runtime environment used to run server-side applications with JavaScript as its primary language.

## Node Architecture

![Pasted%20image%2020240606141214.png](https://nghongson.github.io/media/Pasted%20image%2020240606141214.png)

### Node.js adheres to two fundamentals of its architecture
1. Non-blocking I/O operations
2. Asynchronous paradigm
### Node.js architecture is made up of six elements:
![](https://nghongson.github.io/media/Pasted%20image%2020240606141808.png)
##### 1, Requests
The incoming requests can be blocking (complex) or non-blocking (simple), depending upon the specific tasks users want to perform in a web application.
##### 2, Node.js Server
Node.js server is the foundation of the architecture. As a server-side platform, the Node.js server not only accepts requests from users but also processes these requests and sends those responses to corresponding users.
##### 3, Event Queue
Event Queue in the Node.js server stores the incoming client requests and passes them one-by-one into Event Loop.
##### 4, Event Loop
This is an infinite loop – that never ends. It continues to receive requests from the event queue, process them, and return the corresponding response to the clients.
This event loop has six phases that are repeated until no code is left to execute. The six phases of the event loop are:
- Timers
- I/O Callbacks
- Waiting / Preparation
- I/O Polling
- setImmediate() callbacks
- Close events
##### 5, Thread Pool
The Thread Pool in Node.js backend architecture contains the threads for carrying out tasks required to process client requests.
##### 6, External Resources
These External Resources are used for blocking client requests. They generally handle multiple blocking requests, like data storage, computation, etc.

### Single Threaded Event Loop Architecture in Node.js
![](https://nghongson.github.io/media/Pasted%20image%2020240606143817.png)

#### Event-driven architecture

The NodeJS is a single-threaded environment which means that it runs one action at a time and runs its operations smoothly with the use of events and event emitters.

Events are actions that instruct the runtime what needs to be completed at a given time period with particular data. The event emitters are response objects that can be subscribed to and acted upon to perform certain operations.

Event emitters, like the WebSocket, create a connection and emit events based on certain predetermined events that accept a callback. The Node system adds events to a queue (batch) where events and processes are added that are resolved in an order and eventually removed from this queue.

This structure creates a robust system and enables it to perform one task at a time with an amazing speed.

#### Callbacks


## Benefits of Node Architecture

1. Handling multiple concurrent clients requests fast and easy
2. No multiple threads are required
3. Fewer resources and memory are required

## Nodejs Worker threads

# Reference

[Nodejs Architecture](https://radixweb.com/nodejs-architecture)
[Understanding the NodeJS Architecture](https://www.turing.com/kb/understanding-the-nodejs-architecture)
