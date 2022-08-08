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

#live system
sysctl -w vm.overcommit_memory=1
sysctl -w vm.max_map_count=262144
sysctl -w net.core.somaxconn=65535


```
