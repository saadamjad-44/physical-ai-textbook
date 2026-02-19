import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

---
sidebar_position: 2
---

# 2. Jetson Orin Nano Setup

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>

The NVIDIA Jetson Orin Nano/NX acts as the "Brain" of your robot. It runs the neural networks for perception (vision) and high-level decision making.

## 1. Flashing JetPack

We use **JetPack 6.0 (or latest)** which is based on Ubuntu 22.04, ensuring compatibility with your workstation.

### Requirements
- Host PC with Ubuntu 22.04 (your workstation).
- USB-C cable.
- NVMe SSD installed on the Jetson Carrier board.

### Steps
1. Install **SDK Manager** on your workstation from the [NVIDIA Developer site](https://developer.nvidia.com/drive/sdk-manager).
2. Connect the Jetson in **Recovery Mode** (Force Recovery button + Power button).
3. Open SDK Manager, log in, and select your target device (e.g., Jetson Orin Nano).
4. Select **JetPack 6.0**.
5. Follow the on-screen instructions to flash the OS and install SDK components (CUDA, TensorRT, etc.).

## 2. Network Configuration (Headless)

Robots often don't have monitors attached. We set up Wi-Fi for remote access.

### Connect via Serial Console (First Boot)
1. Connect the Jetson to your PC via USB.
2. Open a terminal on your PC:
   ```bash
   sudo screen /dev/ttyACM0 115200
   ```
3. Complete the initial Ubuntu setup (username, password, hostname).

### Setup Wi-Fi
Once logged in via serial or SSH:
```bash
sudo nmcli dev wifi connect "YOUR_SSID" password "YOUR_PASSWORD"
```

Check your IP address:
```bash
ip w
```
Now you can SSH from your workstation: `ssh user@<JETSON_IP>`

## 3. Post-Install Setup

### Install PyTorch
NVIDIA provides pre-built PyTorch wheels for Jetson. **Do not** use `pip install torch` directly.

```bash
# Example for JetPack 6.0
wget https://developer.download.nvidia.com/compute/redist/jp/v60/pytorch/torch-2.1.0a0+41361538.nv23.06-cp310-cp310-linux_aarch64.whl
pip3 install torch-2.1.0a0+41361538.nv23.06-cp310-cp310-linux_aarch64.whl
```

### Install ROS 2
Follow the [ROS 2 Installation Guide](../module-1-ros2/02-installation.md) but ensure you follow steps for **ARM64**.
