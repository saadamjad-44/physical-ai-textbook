---
sidebar_position: 3
---

# 3. Sensors & Actuators Setup

This guide covers setting up the "Eyes" (Intel RealSense) and "Legs" (Unitree Robot) of your system.

## 1. Intel RealSense Camera

We use the Intel RealSense D435i or D455 depth cameras.

### Installation on Jetson
1. **Install librealsense SDK**:
   ```bash
   sudo apt-get install librealsense2-utils librealsense2-dev librealsense2-dbg
   ```
   *Note: If apt packages are not found for your JetPack version, you may need to build from source.*

2. **Verify Installation**:
   Connect the camera and run:
   ```bash
   realsense-viewer
   ```
   You should see the depth and RGB streams.

3. **Install ROS 2 Wrapper**:
   ```bash
   sudo apt install ros-humble-realsense2-camera
   ```

## 2. Unitree Go2 (Quadruped)

The Unitree Go2 is our primary mobile platform.

### Connection
1. Power on the robot.
2. Connect your Jetson (or Workstation) to the robot's Ethernet port.
3. Configure your Ethernet interface to be in the same subnet (usually `192.168.123.x`).
   ```bash
   sudo ifconfig eth0 192.168.123.162 netmask 255.255.255.0
   ```

### Unitree SDK 2
We use the `unitree_sdk2` for low-level control.

1. Clone the SDK:
   ```bash
   git clone https://github.com/unitreerobotics/unitree_sdk2.git
   cd unitree_sdk2
   mkdir build && cd build
   cmake ..
   make
   ```
2. Run an example (Ensure the robot is in a safe mode/stand works):
   ```bash
   ./bin/example_position
   ```

### DDS Configuration
The Go2 uses CycloneDDS. You must configure your ROS 2 environment to communicate with it.
Create a `cyclonedds.xml` file to permit multicast on the correct interface.
