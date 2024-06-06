# SOLID in Nodejs
Thank [SamehEtman - SOLID Principles](https://github.com/SamehEtman/SOLID-Principles-JS/blob/master/ReadMe.md)
## Single Responsibility Principle
Every module, class or function should have only one reason to change.
### Problem statement
Say we need to make class Journal and we need to have the ability to add or remove journals to it , then we need a way or a method to write and read the content of this journal to the hard disk.
### Abstraction
1. Make a journal class
2. Make addEntry and removeEntry methods
3. Write and Read from the hard disk
### Bad Approach 
This looks like a small problem we will start by making a class Journal To make the basic features of adding and removing journals
```
class Journal
{
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count; // count of journals
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join('\n');
  }

}
Journal.count = 0;
```

So far so good let's move to the second feature where we add a read and write method to the hard disk Note : Reading and Writing to streams are only applicable on NodeJs

We will require the fs module and add the methods of writing and reading the journal entries
```
onst fs = require('fs');

class Journal {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }
  removeEntry(index) {
    delete this.entries[index];
  }
  toString() {
    return Object.values(this.entries).join('\n');
  }
  
  save(filename)
  {
    fs.writeFileSync(filename, this.toString());
  }
  load(path)
  {
    // code to read from a path
  }
  
}
Journal.count = 0;
```
Huh that seemed easy but what if we needed to add another method of loading data such as loading form an api what if we wanted to add some preprocessing to the data before saving as you can see this class Journal is experiencing an Anti pattern know as Class Explosion which is a bad thing.

### Better Approach 
what we are trying to make it here is to prevent our Journal class from having multible responsiblities and make the code more flexible to use First , we will remove the save part from out Journal class making it only responsible for entries managment. Then , we make a new Class to handle the writing to the disk part we will call it WritingManager
```
class Journal {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join('\n');
  }
}
Journal.count = 0;

class WritingManager {

  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}
```

