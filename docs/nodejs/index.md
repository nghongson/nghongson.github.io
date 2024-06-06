# NodeJS

# NodeJs

NodeJS is a single-threaded and asynchronous runtime environment used to run server-side applications with JavaScript as its primary language.

## Node Architecture

![Pasted%20image%2020240606141214.png](https://nghongson.github.io/media/Pasted%20image%2020240606141214.png)

Node.js architecture is made up of six elements, which are:
1, Requests
2, Node.js Server
3, Event Queue
4, Event Loop
5, Thread Pool
6, External Resources
![](https://nghongson.github.io/media/Pasted%20image%2020240606141808.png)

### Single Threaded Event Loop Architecture in Node.js

![](https://nghongson.github.io/media/Pasted%20image%2020240606143817.png)

### Event-driven architecture

The NodeJS is a single-threaded environment which means that it runs one action at a time and runs its operations smoothly with the use of events and event emitters.

Events are actions that instruct the runtime what needs to be completed at a given time period with particular data. The event emitters are response objects that can be subscribed to and acted upon to perform certain operations.

Event emitters, like the WebSocket, create a connection and emit events based on certain predetermined events that accept a callback. The Node system adds events to a queue (batch) where events and processes are added that are resolved in an order and eventually removed from this queue.

This structure creates a robust system and enables it to perform one task at a time with an amazing speed.

### Callbacks

## Benefits of Node Architecture

1. Handling multiple concurrent clients requests fast and easy
2. No multiple threads are required
3. Fewer resources and memory are required

## Nodejs Worker threads

# Reference

[Nodejs Architecture](https://radixweb.com/nodejs-architecture)
[Understanding the NodeJS Architecture](https://www.turing.com/kb/understanding-the-nodejs-architecture)
