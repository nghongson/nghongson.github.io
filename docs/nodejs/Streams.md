# Understanding Streams in Node.js



## There are 4 types of streams in Node.js:
1. Writable: streams to which we can write data. For example, `fs.createWriteStream()` lets us write data to a file using streams.
2. Readable: streams from which data can be read. For example: `fs.createReadStream()` lets us read the contents of a file.
3. Duplex: streams that are both Readable and Writable. For example, `net.Socket`
4. Transform: streams that can modify or transform the data as it is written and read. For example, in the instance of file-compression, you can write compressed data and read decompressed data to and from a file.


## How to create a readable stream
```
const Stream = require('stream')
const readableStream = new Stream.Readable()
```

```
readableStream.push('ping!')
readableStream.push('pong!')
```

