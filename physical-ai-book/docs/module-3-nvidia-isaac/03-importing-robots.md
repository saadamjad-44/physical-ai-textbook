---
sidebar_position: 3
---

# 3. Importing Robots (URDF to USD)

Isaac Sim uses USD (Universal Scene Description) format. We need to convert our ROS URDF models to USD.

## 1. The URDF Importer Extension

1. Launch Isaac Sim.
2. Go to **Isaac Utils -> Workflows -> URDF Importer**.
3. In the "Import Options":
   - **Input File**: Select your `.urdf` or `.xacro` file.
   - **Merge Fixed Joints**: Uncheck if you want to preserve fixed joints (e.g. for sensors).
   - **Fix Base Link**: Check this if it's a manipulator; uncheck for mobile robots.
   - **Stage Instance Path**: `/World/my_robot`.

4. Click **Import**.

## 2. Configuring Physics

Once imported, you might need to tune the physics API properties.
- Select the Articulation Root (usually the base link).
- Look at the **Physics** tab in the Property panel.
- Ensure **Solver Position Iterations** is high enough (e.g. 8-12) for stable simulation.

## 3. Saving the Asset

Right-click the robot in current stage -> **Save As...** -> Save as `.usd` file in your Nucleus server (e.g., `omniverse://localhost/Projects/MyRobot/robot.usd`).
