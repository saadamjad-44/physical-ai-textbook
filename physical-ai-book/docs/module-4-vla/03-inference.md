---
sidebar_position: 3
---

# 3. Inference on Edge

Running VLAs on the Jetson Orin requires optimization, as these models are large (7B+ parameters).

## 1. Quantization

We must quantize models to 4-bit or 8-bit to fit in the Orin's VRAM (8GB/16GB).

```python
from transformers import AutoModelForVision2Seq, BitsAndBytesConfig

# Load in 4-bit
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16
)

model = AutoModelForVision2Seq.from_pretrained(
    "openvla/openvla-7b",
    quantization_config=bnb_config
)
```

## 2. Validation Loop

A typical inference loop:

1. **Capture Image**: Get RGB frame from RealSense.
2. **Text Prompt**: "Place the apple in the bowl".
3. **Inference**: Model generates a token.
4. **Detokenize**: Convert token to continuous action [x, y, z...].
5. **Execute**: Send action to Unitree SDK.

## 3. Optimizing via TensorRT-LLM

For real-time performance (>10Hz), convert the model to TensorRT engine. NVIDIA provides the `TensorRT-LLM` library to accelerate LLM inference on Jetson.
