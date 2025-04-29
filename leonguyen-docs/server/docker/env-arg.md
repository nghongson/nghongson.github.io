# ENV vs ARG
ENV is for future running containers. ARG for building your Docker image.
```
ARG VAR_A 5
ENV VAR_B 6
RUN echo $VAR_A
RUN echo $VAR_B
```
