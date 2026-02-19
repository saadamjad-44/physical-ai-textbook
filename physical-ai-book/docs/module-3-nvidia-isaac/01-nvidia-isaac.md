import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

# 1. NVIDIA Isaac Sim™

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>

Isaac Sim is a robotics simulation application and synthetic data generation tool. It leverages NVIDIA Omniverse™ to provide photorealistic, physically accurate, and high-performance simulations.

## Isaac ROS

Isaac ROS is a collection of hardware-accelerated packages that make it easier for ROS developers to build high-performance solutions on NVIDIA hardware.

### Key Features:
- **VSLAM (Visual SLAM)**: Real-time visual odometry and mapping.
- **NVIDIA Isaac Manipulator**: Accelerated libraries for robotic arms.
- **Nav2 Integration**: Accelerated path planning for navigation.

## Sim-to-Real Transfer
The goal of using Isaac Sim is often Sim-to-Real transfer—training an AI model in simulation and then deploying it to a physical robot with minimal adjustments.
