# Hardware info 

## CPU
```
sudo dmidecode -t processor;
cat /proc/cpuinfo
lshw -C cpu;
lscpu
```
## Mainboard
```
sudo dmidecode -t baseboard;
```
## GPU
```
lshw -C display
lspci | grep VGA
nvidia-smi
```
https://gist.github.com/neomatrix369/256913dcf77cdbb5855dd2d7f5d81b84
## RAM
```
sudo dmidecode -t memory
sudo dmidecode -t memory | grep -i size
lshw -C memory
lspci | grep "RAM Memory"

free -m
```
## Disks
```
lshw -short -C disk
lsblk
fdisk -l
df -m
lsusb
```
## Network
```
lshw -C network
ifconfig -a
```
## Bios
```
dmidecode -t bios
```
## Kernel
```
uname -a
```