import PersonalizeButton from '@site/src/components/PersonalizeButton';
import TranslateButton from '@site/src/components/TranslateButton';

---
sidebar_position: 2
---

# 2. Omniverse & Isaac Sim Installation

<div style={{display: 'flex', alignItems: 'center'}}>
  <PersonalizeButton />
  <TranslateButton />
</div>

NVIDIA Isaac Sim is a photorealistic, physically accurate virtual environment for developing, testing, and managing AI-based robots.

## 1. Prerequisites

- **OS**: Ubuntu 22.04 LTS
- **GPU**: NVIDIA RTX series (RTX 4070 Ti recommended)
- **Driver**: NVIDIA Driver 535+
- **RAM**: 32 GB minimum

## 2. Install Omniverse Launcher

1. Download the [AppImage](https://www.nvidia.com/en-us/omniverse/download/).
2. Make it executable:
   ```bash
   chmod +x omniverse-launcher-linux.AppImage
   ./omniverse-launcher-linux.AppImage
   ```
3. Log in with your NVIDIA account.

## 3. Install Nucleus

Nucleus is the database and collaboration engine for Omniverse.
1. In the Launcher, go to the **Nucleus** tab.
2. Click **Add Local Nucleus Service**.
3. Create an admin account.

## 4. Install Isaac Sim

1. Go to the **Exchange** tab.
2. Search for "Isaac Sim".
3. Click **Install**.

## 5. Running Isaac Sim

Go to the **Library** tab and click **Launch** on Isaac Sim.
Select "ROS 2 Humble" from the selector if prompted/available, or ensure your local environment has ROS 2 sourced before launching.
