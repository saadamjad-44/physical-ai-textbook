---
sidebar_position: 3
---

# 3. Creating a Workspace

In ROS 2, you work within a `colcon` workspace. This is a directory where you build your packages.

## 1. Create Directory Structure

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
```

The `src` folder is where your source code (packages) will live.

## 2. Clone a Package (Example)

Let's clone the ROS 2 examples repository to test our build system.

```bash
cd ~/ros2_ws/src
git clone -b humble https://github.com/ros2/examples.git
```

## 3. Build the Workspace

From the root of your workspace (`~/ros2_ws`):

```bash
cd ~/ros2_ws
colcon build --symlink-install
```

- `colcon build`: Compiles the code.
- `--symlink-install`: Allows you to change Python scripts and launch files without rebuilding every time.

## 4. Source the Overlay

After building, you must source the `setup.bash` file inside the `install` directory to make the packages available.

```bash
source install/setup.bash
```

Now you can run nodes from your workspace:

```bash
ros2 run examples_rclcpp_minimal_publisher member_function_publisher
```
