# Globbing in Linux
Globbing involves expanding a wildcard pattern such as * or ? into a list of pathnames that match a pattern.  
We use globbing with various commands such as rm, find, grep, ls, cat, cp to achieve a more desired result while executing these commands.  
Globbing is very useful in cases where we have scripts that interact with user input. A user's input might be vague and so we have to have measures that handle such cases. For example, if we expect the input to be a Yes, YES, Y we can use the asterisk glob to handle this.
## Asterisks (*).
`*` is used to match any number of characters(zero or more)  
`ls he*`
## Question mark (?).
`?` is used to match exactly one character.  
`ls hel?o`
## Square brackets ([]).
Square brackets[] are used to match the characters inside [],
`ls hello[1-4]`
## Caret(^).

## Exclamation(!).

## Dollar sign($).

## Curly brackets {}.

## Pipes(|).


