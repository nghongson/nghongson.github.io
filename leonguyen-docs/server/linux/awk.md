# AWK command

Awk is a scripting language used for manipulating data and generating reports

## AWK Operations:

- (a) Scans a file line by line
- (b) Splits each input line into fields
- (c) Compares input line/fields to pattern
- (d) Performs action(s) on matched lines

## Useful For:

- (a) Transform data files
- (b) Produce formatted reports

## Programming Constructs:

(a) Format output lines
(b) Arithmetic and string operations
(c) Conditionals and loops

### Syntax:

`awk options 'selection _criteria {action }' input-file > output-file`

## Examples:

### 1, Default behavior of Awk:

`awk '{print}' employee.txt`
Output:

```
ajay manager account 45000
sunil clerk account 25000
varun manager sales 50000
amit manager account 47000
tarun peon sales 15000
deepak clerk sales 23000
sunil peon sales 13000
satvik director purchase 80000
```

### 2, Print the lines which match the given pattern.

`awk '/manager/ {print}' employee.txt`
Output:

```
ajay manager account 45000
varun manager sales 50000
amit manager account 47000
```

### 3, Splitting a Line Into Fields

`awk '{print $1,$4}' employee.txt `
Output:

```
ajay 45000
sunil 25000
varun 50000
amit 47000
tarun 15000
deepak 23000
sunil 13000
satvik 80000
```

### 4, To find/check for any string in any specific column:
` awk '{ if($3 == "B6") print $0;}' geeksforgeeks.txt`

[https://www.geeksforgeeks.org/awk-command-unixlinux-examples/](https://www.geeksforgeeks.org/awk-command-unixlinux-examples/)
