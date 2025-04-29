# Setup docker

Install docker
```bash
sudo pacman -Sy docker
sudo systemctl start docker.service
sudo systemctl enable docker.service
sudo usermod -aG docker $USER
	
docker run hello-world

sudo pacman -Sy docker-compose

#add more lines /etc/sysctl.conf
vm.overcommit_memory=1
vm.max_map_count=262144
net.core.somaxconn=65535
sysctl --system //Reload sysctl vars

#live system
sysctl -w vm.overcommit_memory=1
sysctl -w vm.max_map_count=262144
sysctl -w net.core.somaxconn=65535

# docker network

sudo ip addr show docker0

Localhost :
172.17.0.1
localhost
host.docker.internal

```
