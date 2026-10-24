---
title: How to Build A Drone at Home DIY
date: 2026-10-24T12:22:00.000+05:30
description: This article describes and explains how to build a Custom Drone DIY
  at Home with cheap electronics components
category: IT Support
tags:
  - IoT
  - Embedded Systems
accent_color: "#ff0900"
featured: false
draft: false
---
In recent years, drone applications have been well-liked and used in many fields, such as aerial technology, plant protection, transportation, security, and so on. With the increase of application scenarios, the performance and function requirements of the brain control of drones are strictly requested. I started the Starry Pilot project in 2016. The design concept of flight control is a lightweight, powerful flight control, mainly for scientific research and UAV industry applications, making UAV development technology more popular, but also easier to apply drone technology to various industries.

![](https://miro.medium.com/v2/resize:fit:440/0*0HB_FKsFHVCpWH6Z)

![](https://miro.medium.com/v2/resize:fit:504/0*eA5LKIybM-w0UAcg)

![](https://miro.medium.com/v2/resize:fit:861/1*Dk7sQ6F7ggOcj05nYo1DPQ.png)

Outdoor Height Keeping Flying.

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*WcMM-OT3VJ0k9Ky0KD_Ztw.png)

Gazebo HITL simulating

![](https://miro.medium.com/v2/resize:fit:693/0*-3IlR2xFy5uvu-Z8)

Msh shell system

## Integrated Development Environment(IDE)

- Main Control：STM32F427 + STM32F100
- IDE: Keil MDK5.23
- RT-Thread Open-Source Embedded Real-Time Operating System: V2.1.0

## Hardware Design

The hardware uses the open source project [Pixhawk](https://pixhawk.org/modules/pixhawk), as shown in the following image. Pixhawk is also the most widely used and supported open source flight control hardware in the world.

![](https://miro.medium.com/v2/resize:fit:260/0*RZFQsVk1pARH0ssH)

## Main Features are as follows：

- 168MHz / 256 MIPS Cortex M4F
- 14 PWM/Servo output
- Extended bus interface (I2C, CAN, UART)
- Redundant power input
- External safety switch
- Multi-color LED
- External microSD card slot

## Sensor：

- ST Micro L3GD20 16-bit gyroscope
- ST Micro LSM303D 16-bit accelerometer/magnetometer
- Invensense MPU 6000 three-axis accelerometer/gyroscope
- MEAS MS5611 air pressure meter

## Interface：

- 5x UART, 2x CAN, I2C, SPI
- DSM/DSM2/DSM-X satellite compatible input
- PPWM, S-BUS
- 3.3 & 6.6V ADC Inputs
- microUSB

In addition to the Pixhawk, the entire system also has a number of external electronic devices, such as brushless motor, GPS, electronic speed control, radio modem, RC receiver, Lidar-Lite lidar and so on. The overall system framework is shown below:

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/0*kYGY5NAFAmSro2ZP)

## Software Design

The software is designed in a hierarchical structure, as shown as follows, from the bottom to the top are the Driver layer, RTOS (RT-Thread and Fatfs), HAL hardware virtual layer, Framework layer and application layer.

![](https://miro.medium.com/v2/resize:fit:640/0*-2dSygHWB03grTyx)

## 1. Driver Layer

The Driver layer enables the driver of all hardware devices on board Pixhawk, such as sensor devices (gyroscopes, accelerometers, magnetometers, air pressure meters, etc.), bus devices (UART, I2C, SPI, etc.), USB, motor driver, SD card driver, GPS driver, LED, and some on-board devices. Each driver registers with RT-Thread in the form of Device and provides its own init(), read(), write, ioctrl() functions for upper-level calls. Here we are taking the driver of the hmc5883 magnetometer to illustrate the general design steps of the driver.

[](https://medium.com/plans?source=promotion_paragraph---post_body_banner_read_deeper--c1d179c30a0e-----------------------------------------)

- Device Initialization Function

The following is the initialization function of hmc5883. First, the Functions of the device functionality are assigned a function pointer, init(), read() and ioctrl() are defined. A driver device named hmc5883 is then registered with RT-Thread, and the upper layer can obtain the driver device by looking for the device name. Next is to set up the corresponding bus device for hmc5883. hmc5883 uses i2c communication, so the corresponding i2c device is found in the initialization.

![](https://miro.medium.com/v2/resize:fit:693/0*SX6-icIH1CH0dBNa)

**- init()**

The Init() function does some initialization for chips, including register configuration.

![](https://miro.medium.com/v2/resize:fit:635/0*RgP-h1AVzYJxbcDR)

**- read()**

The read() function enables the reading of device data, such as raw magnetic field data and reading the magnetic field data after calibration.

![](https://miro.medium.com/v2/resize:fit:668/0*-O4MITtW7GB7rZlQ)

**- ioctrl()**

The Ioctrl() function mainly implements the configuration functionalities of some devices, such as setting the range of magnetic field measurement, sampling frequency, etc.

![](https://miro.medium.com/v2/resize:fit:605/0*5G-5q43KitNZKjrj)

## 2. RTOS Layer

In this project, I’m using RT-Thread opensource embedded operating system, it is powerful by providing basic thread scheduling, memory management, synchronization and other basic functions, as well as providing msh shell system, device drive system, making the overall architecture of the system more clear and with more complete functions.

## 3. HAL Layer

The HAL layer is primarily a further encapsulation of the underlying driver device, abstracting the specific device into the same category of devices. Taking serial devices as an example, different hardware platforms, the bottom driver of the serial port will be different, through the HAL layer, the serial device is encapsulated as a unified interface, so that when the system is ported to different platforms, the upper layer code does not need to make any changes, only need to replace the corresponding underlying driver. This greatly reduces the complexity of system migration.

## 4. Framework Layer

The Framework layer implements the main functions of drone devices, such as attitude estimation, location estimation, controller, communication, log management, and so on. It is the core of the whole system, most of the functional modules are implemented at this layer.

## 5. Application Layer

The application layer is the division of the various large functions of drone into a small function. Each function is a separate thread in the system, each thread is responsible for performing its own tasks, and communicates with other threads through the IPC. The Vehicle thread has the highest priority and has an execution cycle of 1ms. It is responsible for all functions related to drone flight, such as status estimation and motor control.

## Startup Process

Move to the system startup process. The startup process follows the original structure provided by the RT-Thread. First making the initialization of RTOS in rtthread_*startup(), and then into the rt_application_init(). In this function, an initial thread of init is established, in which the drone modules are initialized. Once the initialization is complete, individual threads are established and awakened according to the definition of the Application layer, and the init threads are eventually destroyed themselves to avoid unnecessary memory consumption.

## Features

- RT-Thread OpenSource RTOS, Fatfs file system, System components, such as IPC, Msh shell system, file manager, parameter system, log system, etc.
- Completely support with Pixhawk hardware
- ADRC control & PID control
- Support with Mavlink(QGround Control)
- Support with Gazebo hardware-in-the-loop (HITL) simulation
- RT-Thread OpenSource RTOS, Fatfs file system, complete system functional support (e.g. cross-process communication, file management, parameter systems, etc.)
- Based on Pixhawk hardware platform development, perfect support for Pixhawk hardware
- ADRC control and PID (serial) control
- Support for Mavlink Protocol (QGC Ground Station)
- Supports Gazebo hardware in-loop (HITL) simulation
- Msh instruction system, providing rich and scalable system instructions
- Log system for easy access to flight log information and provides the appropriate log viewing tools.
