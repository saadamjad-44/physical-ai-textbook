---
sidebar_position: 4
---

# 4. Writing Python Nodes

This tutorial shows how to create a simple Publisher and Subscriber in Python.

## 1. Create a Package

Navigate to your workspace `src` folder:
```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_py_pkg --dependencies rclpy example_interfaces
```

## 2. Simple Publisher

Create `~/ros2_ws/src/my_py_pkg/my_py_pkg/simple_publisher.py`:

```python
import rclpy
from rclpy.node import Node
from example_interfaces.msg import String

class SimplePublisher(Node):
    def __init__(self):
        super().__init__('simple_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(1.0, self.publish_news)
        self.get_logger().info("Simple Publisher has been started.")

    def publish_news(self):
        msg = String()
        msg.data = "Physical AI is the future!"
        self.publisher_.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = SimplePublisher()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 3. Simple Subscriber

Create `~/ros2_ws/src/my_py_pkg/my_py_pkg/simple_subscriber.py`:

```python
import rclpy
from rclpy.node import Node
from example_interfaces.msg import String

class SimpleSubscriber(Node):
    def __init__(self):
        super().__init__('simple_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.get_logger().info("Simple Subscriber has been started.")

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)
    node = SimpleSubscriber()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 4. Update `setup.py`

Modify `~/ros2_ws/src/my_py_pkg/setup.py` to add entry points:

```python
    entry_points={
        'console_scripts': [
            'simple_publisher = my_py_pkg.simple_publisher:main',
            'simple_subscriber = my_py_pkg.simple_subscriber:main',
        ],
    },
```

## 5. Build and Run

```bash
cd ~/ros2_ws
colcon build --packages-select my_py_pkg
source install/setup.bash

# Terminal 1
ros2 run my_py_pkg simple_publisher

# Terminal 2
ros2 run my_py_pkg simple_subscriber
```
