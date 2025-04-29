# Magento Development Workflow

## Reset password

```
SET @email='', @passwd='', @salt=MD5(RAND());
UPDATE customer_entity SET password_hash = CONCAT(SHA2(CONCAT(@salt, @passwd), 256), ':', @salt, ':1') WHERE email = @email;
```

## Unlock 2FA login:

```
$ G2FA_CODE="$(head -c 500 /dev/urandom | tr -dc 'a-zA-Z0-9$#&' | fold -w 15 | head -n 1 | base32)"
$ bin/magento security:tfa:google:set-secret admin ${G2FA_CODE}
```

## Linux Strace Command:

The “strace” is a Linux command-line utility that is a useful and powerful tool to capture, monitor, and troubleshoot the programs in a system. It records and intercepts the system calls, which is quite helpful when some program crashes and does not execute as expected.

```
strace -e trace=lstat -s 9500 -f $(pgrep php-fpm | paste -s | sed -e 's/\([0-9]\+\)/-p \1/g' -e 's/\t/ /g') 2>&1 | grep -i magezon

[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/PageBuilder/registration.php", {st_mode=S_IFREG|0660, st_size=652, ...}) = 0
[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/Builder/registration.php", {st_mode=S_IFREG|0660, st_size=644, ...}) = 0
[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/Core/registration.php", {st_mode=S_IFREG|0660, st_size=637, ...}) = 0
[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/PageBuilderIconBox/registration.php", {st_mode=S_IFREG|0660, st_size=665, ...}) = 0
[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/PageBuilderPreview/registration.php", {st_mode=S_IFREG|0660, st_size=664, ...}) = 0
[pid 3302010] lstat("/home/staging/public_html/app/code/Magezon/PageBuilderPageableContainer/registration.php", {st_mode=S_IFREG|0660, st_size=718, ...}) = 0

strace -c -f $(pgrep php-fpm | paste -s | sed -e 's/\([0-9]\+\)/-p \1/g' -e 's/\t/ /g')

strace: Process 2157695 attached
strace: Process 3302517 attached
strace: Process 3302529 attached
```

% time seconds usecs/call calls errors syscall

---

25.95 0.019418 2 9091 3162 access
3.95 0.002953 3 894 2 openat
3.91 0.002925 2 1328 5 read
3.84 0.002876 2 1198 60 lstat
3.35 0.002509 1 1275 fstat
3.26 0.002439 1 2107 poll
2.74 0.002052 1 1750 recvfrom
2.59 0.001939 2 840 sendto
