# System debugging
- For web debugging, `curl` and `curl -I` are handy, or their `wget` equivalents, or the more modern [`httpie`](https://github.com/jkbrzt/httpie).

- To know current cpu/disk status, the classic tools are `top` (or the better `htop`), `iostat`, and `iotop`. Use `iostat -mxz 15` for basic CPU and detailed per-partition disk stats and performance insight.

- For network connection details, use `netstat` and `ss`.

- For a quick overview of what's happening on a system, `dstat` is especially useful. For broadest overview with details, use [`glances`](https://github.com/nicolargo/glances).

- To know memory status, run and understand the output of `free` and `vmstat`. In particular, be aware the "cached" value is memory held by the Linux kernel as file cache, so effectively counts toward the "free" value.

- Java system debugging is a different kettle of fish, but a simple trick on Oracle's and some other JVMs is that you can run `kill -3 <pid>` and a full stack trace and heap summary (including generational garbage collection details, which can be highly informative) will be dumped to stderr/logs. The JDK's `jps`, `jstat`, `jstack`, `jmap` are useful. [SJK tools](https://github.com/aragozin/jvm-tools) are more advanced.

- Use [`mtr`](http://www.bitwizard.nl/mtr/) as a better traceroute, to identify network issues.

- For looking at why a disk is full, [`ncdu`](https://dev.yorhel.nl/ncdu) saves time over the usual commands like `du -sh *`.

- To find which socket or process is using bandwidth, try [`iftop`](http://www.ex-parrot.com/~pdw/iftop/) or [`nethogs`](https://github.com/raboof/nethogs).

- The `ab` tool (comes with Apache) is helpful for quick-and-dirty checking of web server performance. For more complex load testing, try `siege`.

- For more serious network debugging, [`wireshark`](https://wireshark.org/), [`tshark`](https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html), or [`ngrep`](http://ngrep.sourceforge.net/).

- Know about `strace` and `ltrace`. These can be helpful if a program is failing, hanging, or crashing, and you don't know why, or if you want to get a general idea of performance. Note the profiling option (`-c`), and the ability to attach to a running process (`-p`). Use trace child option (`-f`) to avoid missing important calls.

- Know about `ldd` to check shared libraries etc — but [never run it on untrusted files](http://www.catonmat.net/blog/ldd-arbitrary-code-execution/).

- Know how to connect to a running process with `gdb` and get its stack traces.

- Use `/proc`. It's amazingly helpful sometimes when debugging live problems. Examples: `/proc/cpuinfo`, `/proc/meminfo`, `/proc/cmdline`, `/proc/xxx/cwd`, `/proc/xxx/exe`, `/proc/xxx/fd/`, `/proc/xxx/smaps` (where `xxx` is the process id or pid).

- When debugging why something went wrong in the past, [`sar`](http://sebastien.godard.pagesperso-orange.fr/) can be very helpful. It shows historic statistics on CPU, memory, network, etc.

- For deeper systems and performance analyses, look at `stap` ([SystemTap](https://sourceware.org/systemtap/wiki)), [`perf`](https://en.wikipedia.org/wiki/Perf_%28Linux%29), and [`sysdig`](https://github.com/draios/sysdig).

- Check what OS you're on with `uname` or `uname -a` (general Unix/kernel info) or `lsb_release -a` (Linux distro info).

- Use `dmesg` whenever something's acting really funny (it could be hardware or driver issues).

- If you delete a file and it doesn't free up expected disk space as reported by `du`, check whether the file is in use by a process:
`lsof | grep deleted | grep "filename-of-my-big-file"`
