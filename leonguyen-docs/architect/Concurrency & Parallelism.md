# Concurrency & Parallelism

![[Pasted image 20240610005214.png]]

## Concurrency
Concurrency means multiple computations are happening at the same time. Concurrency is everywhere in modern programming, whether we like it or not:

Multiple computers in a network
Multiple applications running on one computer
Multiple processors in a computer (today, often multiple processor cores on a single chip)
In fact, concurrency is essential in modern programming:

Web sites must handle multiple simultaneous users.
Mobile apps need to do some of their processing on servers (“in the cloud”).
Graphical user interfaces almost always require background work that does not interrupt the user. For example, Eclipse compiles your Java code while you’re still editing it.

## Parallelism
multithreaded process in a shared-memory multiprocessor environment, each thread in the process can run concurrently on a separate processor, resulting in parallel execution, which is true simultaneous execution.