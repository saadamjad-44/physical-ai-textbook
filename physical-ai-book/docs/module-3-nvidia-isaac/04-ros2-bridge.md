---
sidebar_position: 4
---

# 4. ROS 2 Bridge

The ROS 2 Bridge allows Isaac Sim to communicate with your ROS 2 ecosystem (RViz, your nodes, etc.).

## 1. Enable the Extension

1. Go to **Window -> Extensions**.
2. Search for `omni.isaac.ros2_bridge`.
3. Enable it.

## 2. Action Graph

The bridge is configured using OmniGraph (Action Graph).

1. **Window -> Visual Scripting -> Action Graph**.
2. Create a new Action Graph.
3. Search for and add the following nodes:
   - **On Playback Tick**: Triggers the graph every frame.
   - **ISAAC Read Simulation Time**: Gets the sim time.
   - **ROS 2 Context**: Initializes ROS 2.
   - **ROS 2 Publish Transform Tree**: Publishes TF.
   - **ROS 2 Publish Image**: Publishes camera data.

## 3. Connecting the Nodes

Connect the `Tick` output to the `Exec` input of the ROS 2 nodes.
Select the `ROS 2 Publish Image` node and in the Property panel, select the Camera prim from your stage.

## 4. Verification

Play the simulation.
Open a terminal:

```bash
ros2 topic list
```

You should see topics like `/rgb`, `/tf`, etc.
