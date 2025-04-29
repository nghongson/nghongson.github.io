# The Twelve Factors
The twelve-factor app is a methodology for building software-as-a-service apps that:

- Use declarative formats for setup automation, to minimize time and cost for new developers joining the project;
- Have a clean contract with the underlying operating system, offering maximum portability between execution environments;
- Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration;
- Minimize divergence between development and production, enabling continuous deployment for maximum agility;
- And can scale up without significant changes to tooling, architecture, or development practices.


The twelve-factor methodology can be applied to apps written in any programming language, and which use any combination of backing services (database, queue, memory cache, etc).


##########
* I. Codebase  
One codebase tracked in revision control, many deploys
(git repository)
* II. Dependencies  
Explicitly declare and isolate dependencies
(composer, npm ...)
* III. Config  
Store config in the environment
(env, .env, env.php)
* IV. Backing services  
Treat backing services as attached resources
(mysql, s3 ...)
* V. Build, release, run  
Strictly separate build and run stages
(deploys)
* VI. Processes  
Execute the app as one or more stateless processes
* VII. Port binding  
Export services via port binding
(ports : 80, 443, 3000)
* VIII. Concurrency  
Scale out via the process model
* IX. Disposability  
Maximize robustness with fast startup and graceful shutdown
* X. Dev/prod parity  
Keep development, staging, and production as similar as possible
* XI. Logs  
Treat logs as event streams
(logging error, warning, debug, ...)
* XII. Admin processes  
Run admin/management tasks as one-off processes


