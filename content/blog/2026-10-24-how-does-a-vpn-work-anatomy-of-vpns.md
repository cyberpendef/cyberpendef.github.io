---
title: How Does a VPN Work - Anatomy of VPNs
date: 2026-10-24T15:37:00.000+05:30
description: Understand VPN encryption, protocols, and how a VPN works in practice.
category: Security Guidance
tags:
  - Cloud
  - VPN
  - privacy
accent_color: "#fff200"
featured: false
draft: false
---
## How Does A VPN Work?

A VPN works by routing a device's internet connection through a private service rather than the user's regular internet service provider (ISP). The VPN acts as an intermediary between the user getting online and connecting to the internet by hiding their IP address.

Using a VPN creates a private, encrypted tunnel through which a user’s device can access the internet while hiding their personal information, location, and other data. All network traffic is sent through a secure connection via the VPN. This means that any data transmitted to the internet is redirected to the VPN rather than from the user’s computer. 

Businesses that need encrypted access across multiple sites can adopt [enterprise virtual private network solutions](https://www.fortinet.com/resources/cyberglossary/enterprise-vpn-solutions) to ensure secure, reliable communication between locations.

When the user connects to the web using their VPN, their computer submits information to websites through the encrypted connection created by the VPN. The VPN then forwards that request and sends a response from the requested website back to the connection.  

## How Does A VPN Work In Practice?

A VPN masks a user’s true location to the one they set their VPN to. This enables them to access content or websites typically restricted to that region. For example, a user in the U.S. can set their location to the United Kingdom and watch content from streaming websites aimed at British audiences. A U.S. citizen can also continue streaming their favorite shows even when they are away from the country on holiday.

Let us take a look at some of the common uses of VPNs.  

### 1. Protecting browsing history

ISPs and web browsers can track everything a user does while connected to the internet. They also keep a history of the websites users visit and tie that information to the IP address used, then often issue targeted advertisements related to that search information or even sell users’ browsing data. Keeping these details secret can be really important to people, especially if they are using a shared device or web browser.

A VPN enables users to keep search information—such as medical conditions, required surgery or treatment, travel plans, or even gift idea research—private and prevents their ISP and web browser from serving related ads.  

### 2. Securing IP address and location data

An IP address is the internet’s equivalent of the return address on a handwritten letter. Therefore, anyone that knows a user’s IP address can access the information they have searched for on the internet and where they were when they searched for it. Furthermore, a user’s search history can be viewed if they connect to a web browser on a public or work computer.

VPNs use IP addresses that do not belong to a user, which enables them to connect to and browse the web anonymously while maintaining their privacy online. Using a VPN also enables users to prevent their search history data from being collected, viewed, and sold.  

### 3. Hiding streaming location

Streaming services like Amazon Prime Video, Hulu, and Netflix offer different content to users located in different countries. Using a VPN enables a streaming customer to access the content intended for people living in different countries regardless of their actual location. 

It can also enable a user to access a streaming subscription they have in their home country while traveling. For example, a user on holiday in another country could use a VPN to set their location to the U.S. and stream their favorite sports team’s live game.  

### 4. Protecting devices

A VPN is also crucial to protecting users’ devices, such as computers, laptops, smartphones, and tablets, from being intercepted by cyber criminals. Bad actors often target devices that connect to the internet on specific networks, such as a public Wi-Fi network. A VPN helps a user mask their device’s location and protect the data on it from being seen by a potential hacker.  

### 5. Ensuring internet freedom

A VPN enables people to protect themselves from government surveillance by hiding their browsing history. As long as their VPN provider does not log browsing history, which some do, users can rest assured that their freedom on the internet is protected.

[![4 advantages of using a VPN: securing your network, hiding your private information, preventing data throttling, avoiding bandwidth throttling](https://www.fortinet.com/content/dam/fortinet/images/cyberglossary/vpn-advantages.png)

Click to See Larger Image

](https://www.fortinet.com/content/dam/fortinet/images/cyberglossary/vpn-advantages.png)

[

![](https://www.fortinet.com/content/dam/fortinet/images/general/ribbon-tn-zta-dummies.png)

Zero Trust Access for Dummies

You’ll learn all about zero-trust network access (ZTNA) technology and the strategy for securing users’ remote access.

Download Now



](https://global.fortinet.com/lp-en-eb-zta-for-dummies?utm_content=cg-access-control-ribbon)

[](https://www.fortinet.com/resources/cyberglossary/how-does-vpn-work#)

## VPN Encryption—All You Need To Know

"Do VPNs really work?" is a fair question, and anyone asking should know they do. VPNs use encryption to keep internet users secure and their data private. A VPN works based on encryption, which hides the true meaning of information. This ensures data cannot be read unless someone unlocks it with a password, known as an encryption key. This kind of end-to-end data protection is one of the core [benefits of using a VPN](https://www.fortinet.com/resources/cyberglossary/benefits-of-vpn), especially for users who prioritize online privacy and network security. When using a VPN, the encryption key protecting a user’s data and web activity is only known by their computer and VPN server. 

VPN services use various types of encryption processes, but encryption, in a nutshell, typically creates a secure tunnel in which the user’s data is encoded. Data is encrypted into unreadable code as it moves between the user's computer and the VPN server. The device connects to the local network the VPN is connected to, which masks the user’s IP address as belonging to a server from the VPN provider.   

[](https://www.fortinet.com/resources/cyberglossary/how-does-vpn-work#)

## VPN Protocols

All VPN services use VPN protocols to ensure they provide users with the fastest and most secure internet connection. VPN protocols use a combination of encryption and transmission standards to determine how a user’s data is transported between their device and the VPN server.  

### 1. Point-to-Point Tunneling Protocol (PPTP)

PPTP is one of the oldest protocols still active on the internet. Created by Microsoft, it uses the [Transmission Control Protocol (TCP)](https://www.fortinet.com/resources/cyberglossary/tcp-ip) control channel and Generic Routing Encapsulation (GRE) tunneling protocol. It relies on the Point-to-Point Protocol (PPP), which is a Layer 2 communications protocol directly between two routers, to implement security functionalities. While PPTP is largely outdated, enterprises comparing modern networking options often look at the [differences between SD-WAN and VPN](https://www.fortinet.com/resources/cyberglossary/sd-wan-vs-vpn) to understand how VPN technology compares with newer WAN solutions.

PPTP is fast and simple to deploy but only really applicable to people using older Windows operating systems. It also has several well-known security issues, so any VPN that only uses PPTP should be avoided.  

### 2. Layer 2 Tunneling Protocol (L2TP)

This protocol combines PPTP with the Layer 2 Forwarding (L2F) tunneling protocol. It strengthens the data tunnel provided by PPTP but does not provide users with encryption or privacy capabilities. As a result, the protocol is typically bundled with a security protocol such as Internet Protocol security (IPsec).  

### 3. Secure Socket Tunneling Protocol (SSTP)

SSTP is a VPN tunnel created by Microsoft and is a much more secure option. It transports PPP traffic through the secure sockets layer/transport layer security [(SSL/TLS) channel](https://www.fortinet.com/resources/cyberglossary/ssl-certificate), which provides encryption, key negotiation, and traffic integrity checking. As such, only the two parties that transmit the data are able to decode it. Using this over the TCP port 443 ensures that SSTP can travel through most firewalls and proxy servers.  

### 4. Internet Key Exchange Version 2 (IKEv2)

IKEv2 handles request and response actions to ensure traffic is secure and authenticated, usually using IPsec. It establishes the security attributes of the device and server, then authenticates them, and agrees which encryption methods to use. It supports 256-bit encryption and allows the use of popular ciphers such as Advanced Encryption Standard (AES), Camellia, and ChaCha20. IKEv2 is mostly used to secure mobile devices, in which it is particularly effective.  

### 5. OpenVPN

OpenVPN is widely considered the best open-source [VPN technology](https://www.fortinet.com/resources/cyberglossary/what-is-a-vpn) available. The free software uses pre-shared certificates, secret keys, and usernames and passwords to authenticate every device or server. It uses the open secure sockets layer (OpenSSL) encryption library and TLS, in addition to a custom protocol utilizing SSL/TLS for key exchange. OpenVPN offers the same protection as established protocols but on a wider scale.

[](https://www.fortinet.com/resources/cyberglossary/how-does-vpn-work#)

## Fortinet Products & Services

In today’s rapidly evolving cybersecurity environment, VPN alone may not be enough to secure sensitive data and keep your organization’s network safe. Whether users are in the office, at home, or on the road, they need consistent and secure access to applications in the cloud, data center, and SaaS platforms.

Fortinet helps organizations to secure and connect their work-from-anywhere employees and devices to critical applications and resources. [Fortinet Universal ZTNA](https://www.fortinet.com/solutions/enterprise-midsize-business/network-access/application-access "Fortinet ZTNA") is a robust security solution that offers businesses flexibility, granular access control, and ongoing verification. It enables policies to be enforced for users regardless of location. With granular access control, access is granted to specific applications only for that session, providing better security.

With the client-initiated model, the IT team has more visibility and control of the endpoint while providing users with a faster, easier experience. Universal ZTNA requires no additional licenses and is a free feature in FortiOS and [FortiClient](https://www.fortinet.com/products/endpoint-security/forticlient "FortiClient"), allowing customers to shift from VPN to ZTNA at their own pace. With Fortinet’s added flexibility, you don’t need to choose exclusively between VPN or ZTNA; you can adapt to the solution that’s right for you.

[![Fortinet Universal ZTNA diagram](https://www.fortinet.com/content/dam/fortinet/images/cyberglossary/fortinet-universal-ztna-diagram.png)

Click to See Larger Image

](https://www.fortinet.com/content/dam/fortinet/images/cyberglossary/fortinet-universal-ztna-diagram.png)

Because of continual movement between on-premises, home network, and public network environments, zero trust, endpoint, and network security must be connected through a centralized security and management framework. Solutions unified by a common set of APIs and integration points ensure users can seamlessly shift from one location to another, enjoying a consistent user experience that is appropriately protected with contextual security. Fortinet is the only vendor capable of delivering this unified approach, enabling proactive, integrated, and context-aware security that automatically adapts to where users are, what device they are using, and what resources they are accessing.

Using a broad portfolio of zero trust, endpoint, and network security solutions within the Fortinet Security Fabric, Fortinet can deliver security, services, and threat intelligence that can automatically follow users across distributed networks. The Security Fabric can also adjust enforcement to the perceived risk of every interaction—whether on the road, at home, or in the office to enable consistent enterprise-grade protection and enhance productivity end-to-end.

_[Learn more](https://www.fortinet.com/solutions/enterprise-midsize-business/network-access/application-access "Fortinet ZTNA") about how Fortinet ZTNA improves secure access to applications anywhere, for remote users._
