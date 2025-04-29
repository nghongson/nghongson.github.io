# File Processing

Basic process with file
```node
const fs = require("fs"); 
  
// Storing the JSON format data in myObject 
var data = fs.readFileSync("data.json"); 
var myObject = JSON.parse(data); 
  
// Defining new data to be added 
let newData = { 
  country: "England", 
}; 
  
// Adding the new data to our object 
myObject.push(newData); 
  
// Writing to our JSON file 
var newData2 = JSON.stringify(myObject); 
fs.writeFile("data2.json", newData2, (err) => { 
  // Error checking 
  if (err) throw err; 
  console.log("New data added"); 
}); 
```

Processing huge JSON files 
`stream-json`
[`stream-json`](https://github.com/uhop/stream-json) is a micro-library of node.js stream components with minimal dependencies for creating custom data processors oriented on processing huge JSON files while requiring a minimal memory footprint. It can parse JSON files far exceeding available memory. Even individual primitive data items (keys, strings, and numbers) can be streamed piece-wise. Streaming SAX-inspired event-based API is included as well.
