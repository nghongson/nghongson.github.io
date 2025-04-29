# Shell Input/Output Redirections

## Output Redirection:
- `>` replaced output file
- `>>` add lines to end of file in Linux
### Append text to end of file using echo command:
`echo 'text here' >> filename`
### Append command output to end of file:
`command-name >> filename`
```
date >> output.txt
ls>> files.txt
```
### Append text when using sudo:
tee command:
```
echo 'text' | sudo tee -a my_file.txt
echo '104.20.186.5 www.cyberciti.biz' | sudo tee -a /etc/hosts
```
the bash/sh to run command using sudo:
```
sudo sh -c 'echo my_text >> file1'
sudo -- bash -c 'echo "some data" >> /my/path/to/filename.txt'
```
## Input Redirection `<`
 - `<` replaced output file
 - `<<` add lines to end of file in Linux
### Append text to end of file using echo command
`filename << echo 'text here'`
## Pipes `|`

## stdout and stderr


[refer docs](https://linuxize.com/post/bash-write-to-file/)
[What does &> do in bash?](https://stackoverflow.com/questions/24793069/what-does-do-in-bash#answer-74001320)