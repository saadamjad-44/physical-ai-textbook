---
sidebar_position: 3
---

# 3. Creating Gazebo Worlds

Gazebo is a 3D simulator that integrates with ROS 2. It allows us to create complex environments to test our robots.

## 1. Launching Gazebo

You can launch an empty world:

```bash
ros2 launch gazebo_ros gazebo.launch.py
```

## 2. Using the Building Editor

1. Open Gazebo.
2. Go to **Edit -> Building Editor**.
3. Draw walls, add windows and doors.
4. Save the model.

## 3. Creating a World File

A `.world` file specifies what models to load.

```xml
<?xml version="1.0" ?>
<sdf version="1.6">
  <world name="default">
    <!-- Sun -->
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Ground Plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Your Custom Building -->
    <include>
      <uri>model://my_building</uri>
      <pose>0 0 0 0 0 0</pose>
    </include>
  </world>
</sdf>
```

## 4. Launching with a Custom World

Create a launch file `world.launch.py`:

```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource

def generate_launch_description():
    pkg_gazebo_ros = get_package_share_directory('gazebo_ros')
    world_path = os.path.join(get_package_share_directory('my_pkg'), 'worlds', 'my_world.world')

    return LaunchDescription([
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(
                os.path.join(pkg_gazebo_ros, 'launch', 'gazebo.launch.py')
            ),
            launch_arguments={'world': world_path}.items(),
        ),
    ])
```
