import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

---
sidebar_position: 2
---

# 2. Installation (ROS 2 Humble)

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>
 **ROS 2 Humble Hawksbill** on Ubuntu 22.04 LTS. This is a Long Term Support (LTS) release, supported until May 2027.

## 1. Set Locale

Make sure you have a locale which supports UTF-8.

```bash
locale  # check for UTF-8

sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

## 2. Setup Sources

You will need to add the ROS 2 apt repository to your system.

```bash
sudo apt install software-properties-common
sudo add-apt-repository universe

sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

## 3. Install ROS 2 Packages

Update your apt repository caches after setting up the repositories.

```bash
sudo apt update
sudo apt upgrade
```

Desktop Install (Recommended): Includes ROS, RViz, demos, tutorials.

```bash
sudo apt install ros-humble-desktop
```

## 4. Environment Setup

Source the setup script.

```bash
source /opt/ros/humble/setup.bash
```

To automatically source this every time you open a new shell:

```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

## 5. Verify Installation

Open two terminals.

Terminal 1:
```bash
ros2 run demo_nodes_cpp talker
```

Terminal 2:
```bash
ros2 run demo_nodes_py listener
```

You should see the `talker` publishing messages and the `listener` receiving them.
