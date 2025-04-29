 # Source package
 APT needs to be given a “list of package sources (repositories)”: the file /etc/apt/sources.list will list the different repositories that publish Debian packages.
 /etc/apt/sources.list
 /etc/apt/sources.list.d/*

 ```
deb url distribution component1 component2 component3 [..] componentX
deb-src url distribution component1 component2 component3 [..] componentX
```

```
# /etc/apt/sources.list
deb http://cdn-aws.deb.debian.org/debian bullseye main
deb-src http://cdn-aws.deb.debian.org/debian bullseye main
deb http://security.debian.org/debian-security bullseye-security main
deb-src http://security.debian.org/debian-security bullseye-security main
deb http://cdn-aws.deb.debian.org/debian bullseye-updates main
deb-src http://cdn-aws.deb.debian.org/debian bullseye-updates main
deb http://cdn-aws.deb.debian.org/debian bullseye-backports main
deb-src http://cdn-aws.deb.debian.org/debian bullseye-backports main
```

```
# /etc/apt/sources.list.d/docker.list
deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian   bullseye stable
```
List packages
```
apt list --installed
```

