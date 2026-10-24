---
title: What is AI Jailbreaking
date: 2026-10-24T15:33:00.000+05:30
description: "This blog post explains what is AI jailbreaking and its Fundamentals "
category: AI Security
tags:
  - AI
  - LLM
  - AI Security
  - Red Team
accent_color: "#c500ff"
featured: false
draft: false
---


Imagine a PhD-level intelligence, spanning all fields of life, going rogue. This is not a distant future — it’s already here. Technologies like ChatGPT, trained on massive amounts of data, possess immense capabilities that can act as a catalyst for both good and bad in the world. Despite the best efforts of companies like OpenAI, Google, and Anthropic, these Large Language Models (LLMs) remain vulnerable to jailbreaking — a phenomenon where their safeguards are bypassed, allowing them to produce responses that promotes illegal or harmful activities, creating real-world risks.**.**

## What is Jailbreaking?

- Jailbreaking manipulates the AI (like ChatGPT) to produce responses it’s been trained to refuse, bypassing built-in safety mechanisms.
- Harmful prompts are injected into “imaginary” or “fictional” scenarios, tricking the model into compliance.

For a clear and simple video explanation of this article, check out this video.

## Jailbreak Example

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*5blLeOjIEg9WNlNj4pEQYw.png)

## Taxonomy of jailbreak prompts

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*oLXAaEmNBB4Pqvsi03iTYQ.png)

A structured approach to viewing jailbreak prompts is introduced in Table 1. To learn find examples of the patterns, you may visit: [Jailbreaking in GenAI: Techniques and Ethical Implications](https://learnprompting.org/docs/prompt_hacking/jailbreaking) . Please refer to the video for a detailed walk-through of the examples.

## Taxonomy of jailbreak prompt patterns

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*ZcsOyOvHWiSORJGRWD8REQ.png)

**The authors collect 78 jailbreak prompts from the web. This is done manually and verified by 3 authors. Based on the proposed taxonomy, these 78 jailbreak prompts are segmented.**

[](https://medium.com/plans?source=promotion_paragraph---post_body_banner_read_deeper--324029e49e27-----------------------------------------)

Pretending remains the dominant strategy, followed by attention shifting and privilege escalation. There’s a lot of overlap between different patterns.

## Summarising OpenAI’s Usage Policies

The research distills OpenAI’s guidelines into 8 disallowed usage scenarios

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*ud0mBKHbdAJJxDzKuX8ziA.png)

## Legal Investigation:

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*ppbWZFvxNjt_Xs2ZXM51fQ.png)

The 8 disallowed usage scenarios are significant because they carry real-world consequences, with most of them being governed by laws in the U.S. Constitution.

## Quantify Model Security Over Time

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:875/1*mM7wZZft6vk94ODdngqnaA.png)

- Earlier jailbreak strategies, like _Do Anything Now (DAN) v5.0_, had fewer successful breaks (93 cases).
- Newer versions (e.g., v9.0) achieved 200 successful breaks, highlighting the dynamic nature of jailbreaking.

> With that we’re done with the foundations of this research paper!!!

### **We’ll explore the results of this study in part 2 of Day 1 LLM Security. Stay tuned!**

If you enjoyed this post, please give it a thumbs up and share it with your community. If you have ideas or requests for future topics, feel free to comment below or reach out to me on LinkedIn. I truly appreciate you taking the time to read this — thank you! Until next time, take care!
