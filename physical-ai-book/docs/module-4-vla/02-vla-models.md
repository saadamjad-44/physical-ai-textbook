```
import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

# 2. VLA Models: RT-2 and OpenVLA

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>

Vision-Language-Action (VLA) models are the cutting edge of physical AI. They enable robots to understand natural language and visual input to generate physical actions.

## 1. Google RT-2 (Robotics Transformer 2)

RT-2 is a VLA model that transfers knowledge from web-scale data (like standard VLM) to robotic control.
- **Input**: Image + Text ("Pick up the strawberry")
- **Output**: Robotic Actions (x, y, z, roll, pitch, yaw, gripper)

## 2. OpenVLA

OpenVLA is an open-source alternative built on top of LLaMA or Vicuna.
- Fine-tuned on the BridgeData V2 dataset.
- Available on Hugging Face.

## 3. Data Collection

To train/fine-tune these models, you need datasets containing:
1. **Video/Images**: From the robot's camera.
2. **Action Labels**: Determining what the robot did at that timestamp.
3. **Language Instruction**: Description of the task.

We use the **LeRobot** library or **Aloha** teleoperation system to collect this data.
