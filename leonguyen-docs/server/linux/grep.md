# `grep` command
The grep command in Unix/Linux is a powerful tool used for searching and manipulating text patterns within files
Syntax:
`grep [options] pattern [files]`
1, Display the File Names that Matches the Pattern
`grep -l "unix" *`
2, Show Line Number While Displaying the Output Using grep -n
`grep -n "unix" geekfile.txt`
3, Display the lines that are not matched with the specified search string pattern
`grep -v "unix" geekfile.txt`
4, Matching the Lines that Start with a String
`grep "^unix" geekfile.txt`
5, Matching the Lines that End with a String
`grep "os$" geekfile.txt`
6, Search Recursively for a Pattern in the Directory
`grep -iR geeks /home/geeks`

