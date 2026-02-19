import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

---
sidebar_position: 2
---

# 2. URDF & Xacro Robot Modeling

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>
 (URDF & Xacro)

The Unified Robot Description Format (URDF) is an XML format used to describe the robot's physical structure (links) and joints.

## 1. Basic URDF Structure

A simple robot with one link:

```xml
<?xml version="1.0"?>
<robot name="my_robot">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.6 0.3 0.3"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.6 0.3 0.3"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>
</robot>
```

## 2. Xacro (XML Macros)

Writing raw URDF can be verbose. Xacro allows us to use variables and macros.

### Example: A Wheel Macro

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="my_robot">

  <xacro:property name="wheel_radius" value="0.1" />
  <xacro:property name="wheel_width" value="0.05" />

  <xacro:macro name="wheel" params="prefix reflect">
    <link name="${prefix}_wheel">
      <visual>
        <geometry>
          <cylinder radius="${wheel_radius}" length="${wheel_width}"/>
        </geometry>
      </visual>
      <!-- Collision & Inertial blocks ... -->
    </link>

    <joint name="${prefix}_wheel_joint" type="continuous">
      <parent link="base_link"/>
      <child link="${prefix}_wheel"/>
      <origin xyz="0.2 ${reflect*0.15} 0" rpy="0 0 0"/>
      <axis xyz="0 1 0"/>
    </joint>
  </xacro:macro>

  <xacro:wheel prefix="left" reflect="1" />
  <xacro:wheel prefix="right" reflect="-1" />

</robot>
```

## 3. Visualizing in RViz

To see your robot:

```bash
ros2 launch urdf_tutorial display.launch.py model:=src/my_pkg/urdf/my_robot.xacro
```
