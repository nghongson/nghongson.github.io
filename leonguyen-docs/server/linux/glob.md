# Globbing in Linux
Globbing involves expanding a wildcard pattern such as * or ? into a list of pathnames that match a pattern.  
We use globbing with various commands such as rm, find, grep, ls, cat, cp to achieve a more desired result while executing these commands.  
Globbing is very useful in cases where we have scripts that interact with user input. A user's input might be vague and so we have to have measures that handle such cases. For example, if we expect the input to be a Yes, YES, Y we can use the asterisk glob to handle this.
## Asterisks (*).
`*` is used to match any number of characters(zero or more)  
```
ls he*
```
## Question mark (?).
`?` is used to match exactly one character.  
```
ls hel?o
```
## Exclamation(!).
! is used to exclude characters from the list that is specified within the square brackets. 
```
ls hello[!3]

It will display the directories starting with hello, ending with any character but not 3
```
## Caret(^).
`^` is used to define the starting character.
```
grep '^[P-R]' list.txt
grep '[^A-C]' list.txt
```
## Dollar sign($).
`$` is used to define the ending character
```
grep '[A-C]$' list.txt
grep '[A-C$]' list.txt
```
## Square brackets ([]).
Square brackets[] are used to match the characters inside [],
```
ls hello[1-4]
```
## Curly brackets {}.
`{}` can be used to match filenames with more than one globbing patterns. Each pattern is separated by `,` in curly bracket without any space.
```
ls -l {?????.sh,*st.txt}
```
## Pipes(|).
`|` sign is also used for applying more than one condition on globbing pattern. Each pattern is separated by `|` symbol in the command.
```
ls a*+(.bash|.sh)
```
