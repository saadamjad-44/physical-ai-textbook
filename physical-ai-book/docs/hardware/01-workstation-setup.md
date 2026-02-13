---
sidebar_position: 1
---

# 1. Digital Twin Workstation Setup

This guide details how to set up your primary development machine. This machine will run the heavy physics simulations (NVIDIA Isaac Sim) and train large models.

## 1. Operating System: Ubuntu 22.04 LTS

We strictly recommend **Ubuntu 22.04 LTS** as it is the most stable environment for ROS 2 Humble/Iron and NVIDIA Isaac Sim 2023.1+.

### Installation Steps
1. Download [Ubuntu 22.04.4 LTS ISO](https://ubuntu.com/download/desktop).
2. Create a bootable USB using [Rufus](https://rufus.ie/en/) (Windows) or `balenaEtcher`.
3. Boot from USB and select "Install Ubuntu".
4. **Partitioning**: If dual-booting with Windows, ensure you allocate at least **500 GB** to Ubuntu. Simulation assets can be very large.

## 2. NVIDIA Drivers & CUDA

Physical AI relies heavily on GPU acceleration.

### Install Drivers
Open a terminal and run:

```bash
sudo apt update
sudo apt install ubuntu-drivers-common
sudo ubuntu-drivers autoinstall
sudo reboot
```

Verify installation after reboot:
```bash
nvidia-smi
```
You should see your GPU listed (e.g., RTX 4070 Ti) and a Driver Version (ideally 535+).

### Install CUDA Toolkit
Follow the official [NVIDIA CUDA Downloads](https://developer.nvidia.com/cuda-downloads) or use the package manager:

```bash
sudo apt install nvidia-cuda-toolkit
nvcc --version
```

## 3. Docker & NVIDIA Container Toolkit

We use Docker to isolate environments for different projects preventing dependency hell.

### Install Docker Engine
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable non-root user
sudo usermod -aG docker $USER
newgrp docker
```

### Install NVIDIA Container Toolkit
This allows Docker containers to access your GPU.

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Verify Setup
Run a CUDA container to verify GPU access:
```bash
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```
