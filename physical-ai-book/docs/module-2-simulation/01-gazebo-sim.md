import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

# Module 2: The Digital twin (Gazebo & Unity)

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>

## Why Simulation?

Simulation allows us to test robot controllers in a safe, controlled environment before deploying them to real hardware. This is especially important for humanoid robots, where falls can be expensive.

## Gazebo

Gazebo is a 3D dynamic simulator with the ability to accurately and efficiently simulate populations of robots in complex indoor and outdoor environments.

### Core Components:
- **Physics Engine**: Handles gravity, collisions, and rigid body dynamics.
- **Sensors**: Simulates LiDAR, Depth Cameras, and IMUs.
- **Plugins**: Allows you to control the simulation programmatically.

## URDF and SDF
- **URDF (Unified Robot Description Format)**: An XML format for representing a robot model.
- **SDF (Simulation Description Format)**: An XML format that describes objects and environments for simulation and visualization.

## Bipedal Simulation
Simulating a walking humanoid requires balancing multiple joints and forces. Gazebo's physics engine helps us understand the dynamics of balance.
