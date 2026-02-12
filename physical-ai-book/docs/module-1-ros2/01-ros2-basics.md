# Module 1: The Robotic Nervous System (ROS 2)

## What is ROS 2?

ROS 2 (Robot Operating System) is an open-source middleware suite for robot software development. It provides the services you would expect from an operating system, including hardware abstraction, low-level device control, implementation of commonly-used functionality, message-passing between processes, and package management.

## Core Concepts

### Nodes
A Node is a process that performs computation. Each node should be responsible for a single module (e.g., controlling motors, processing laser scans).

### Topics
Topics are a vital element of the ROS graph that act as a bus for nodes to exchange messages. They follow a publish-subscribe pattern.

### Services
Services are another method of communication in ROS. They follow a call-and-response pattern, where a client sends a request and a server sends a response.

### Actions
Actions are intended for long-running tasks. They have three parts: a goal, feedback, and a result.

## Why ROS 2 for Humanoids?
Humanoid robots have many degrees of freedom and sensors. ROS 2 allows us to manage this complexity through a distributed architecture.
