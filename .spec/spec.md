# Project Specification — Physical AI & Humanoid Robotics Textbook

## What We're Building

An AI-native textbook for teaching Physical AI & Humanoid Robotics. The textbook is built with Docusaurus and deployed to GitHub Pages. It includes:

1. **5 Modules, 18 Chapters** covering:
   - Hardware Requirements (workstation, Jetson, sensors)
   - ROS 2 Fundamentals (basics, installation, workspace, Python nodes)
   - Simulation (Gazebo, URDF/Xacro, worlds)
   - NVIDIA Isaac (intro, installation, importing robots, ROS 2 bridge)
   - Vision-Language-Action (VLA basics, models, inference)

2. **Integrated RAG Chatbot** using:
   - Google Gemini 1.5 Flash for generation
   - Qdrant Cloud for vector search
   - FastAPI backend
   - Text-selection based Q&A (user selects text → asks about it)

3. **Authentication** via better-auth:
   - Email/password signup and signin
   - User profile collection (software/hardware experience, education, goals)
   - Neon Serverless Postgres for storage

4. **Content Personalization**:
   - Per-chapter "Personalize for Me" button
   - Adapts content based on user's background
   - Uses Gemini to rewrite content

5. **Urdu Translation**:
   - Per-chapter translate button
   - Gemini-powered natural translation
   - RTL text display with Nastaliq font

## Why We're Building It

The future of AI extends into the physical world. This textbook bridges the gap between digital AI and embodied intelligence, making advanced robotics education accessible through AI-enhanced learning tools.
