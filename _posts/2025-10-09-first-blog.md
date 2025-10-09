---
title: Basics of Python for Hacking
date: 2025-10-09
categories:
  - Pentesting
  - Intro
tags:
  - Intro
author: Shaik Hidayatullah
---

# Lambda functions in python 
Using lambda functions in Python

In Python, `lambda` functions, also known as anonymous functions, are a concise way to create small, single-expression functions without a formal `def` statement. 

**Syntax**
The syntax for a lambda function is straightforward: 

```python
lambda arguments: expression
```

- `lambda`: This keyword signals the creation of a lambda function.
- `arguments`: These are the inputs the lambda function takes, similar to parameters in a regular function. You can have any number of arguments (even none).
- `:` : A colon separates the arguments from the expression.
- `expression`: This is the operation the lambda function performs. It's limited to a single expression whose result is automatically returned without a `return` statement. 

Example

Let's illustrate with an example to add two numbers: 

```python
add_numbers = lambda x, y: x + y
print(add_numbers(5, 3)) 
# Output: 8
```


In this example, `lambda x, y: x + y` creates an anonymous function assigned to `add_numbers`, which takes two arguments and returns their sum. 

Common use cases with higher-order functions

Lambda functions are frequently used with higher-order functions like `map()`, `filter()`, and `sorted()`. 

1. `map()`

`map()` applies a function to each item in an iterable. 

```python
numbers = [1, 2, 3, 4, 5]
squared_numbers = list(map(lambda x: x * x, numbers))
print(squared_numbers)  
# Output: [1, 4, 9, 16, 25]
```

Here, a lambda squares each number. 

2. `filter()`

`filter()` creates an iterator of elements for which a function returns `True`. 

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  
# Output: [2, 4, 6, 8]
```

This example filters for even numbers. 

3. `sorted()`

`sorted()` returns a new sorted list, optionally using a lambda for custom sorting with the `key` argument. 
```python
data = [(1, 3), (2, 1), (4, 2)]
sorted_data = sorted(data, key=lambda x: x[1])
print(sorted_data)  
# Output: [(2, 1), (4, 2), (1, 3)]
```

The lambda here sorts based on the second element of each tuple. 

When to use lambda functions

Lambda functions are best for:

- Short, simple logic.
- Use with higher-order functions.
- Temporary functions.
- Improving readability in simple cases. 

When to avoid lambda functions

Avoid lambda functions for:

- Complex or multi-line logic.
- Reusable or named functions.
- When debugging or documentation is needed. 

In summary, lambda functions provide a concise way to create anonymous functions for simple tasks, especially with higher-order functions.

# zip, map, lambda functions in python
Sure! Here's a **detailed and beginner-friendly guide** on how to use `zip()`, `map()`, and `lambda()` in Python — powerful tools that are very useful for writing clean, efficient code, especially in automation and penetration testing scripts.

---

## 🔹 1. **`zip()` Function**

### ✅ **Purpose:**

`zip()` is used to combine two or more iterables (like lists or tuples) into a single iterator of **tuples**, where each tuple contains one element from each iterable.

### ✅ **Syntax:**

```python
zip(iterable1, iterable2, ...)
```

### ✅ **Example:**

```python
names = ['Alice', 'Bob', 'Charlie']
scores = [85, 90, 78]

zipped = zip(names, scores)
print(list(zipped))
# Output: [('Alice', 85), ('Bob', 90), ('Charlie', 78)]
```

### ✅ **Unzipping:**

```python
zipped = [('Alice', 85), ('Bob', 90), ('Charlie', 78)]
names, scores = zip(*zipped)
print(names)  # ('Alice', 'Bob', 'Charlie')
print(scores) # (85, 90, 78)
```

### ✅ **Real-life Use Case in Pentesting:**

```python
usernames = ['admin', 'user', 'guest']
passwords = ['admin123', 'user123', 'guest123']

for username, password in zip(usernames, passwords):
    print(f"Trying login with {username}:{password}")
```

📚 Docs: [https://docs.python.org/3/library/functions.html#zip](https://docs.python.org/3/library/functions.html#zip)

---

## 🔹 2. **`map()` Function**

### ✅ **Purpose:**

`map()` applies a function to **each item** in an iterable and returns a `map` object (an iterator).

### ✅ **Syntax:**

```python
map(function, iterable)
```

### ✅ **Example 1: Using a Named Function**

```python
def square(x):
    return x * x

numbers = [1, 2, 3, 4]
squares = map(square, numbers)
print(list(squares))  # Output: [1, 4, 9, 16]
```

### ✅ **Example 2: With Multiple Iterables**

```python
def add(x, y):
    return x + y

a = [1, 2, 3]
b = [4, 5, 6]

result = map(add, a, b)
print(list(result))  # Output: [5, 7, 9]
```

### ✅ **Real-life Use Case in Pentesting:**

Convert a list of IPs to their integer representation:

```python
import ipaddress

ips = ['192.168.1.1', '10.0.0.1']
ip_objects = map(ipaddress.IPv4Address, ips)

for ip in ip_objects:
    print(int(ip))  # Outputs integer representation
```

📚 Docs: [https://docs.python.org/3/library/functions.html#map](https://docs.python.org/3/library/functions.html#map)

---

## 🔹 3. **`lambda` Function**

### ✅ **Purpose:**

`lambda` creates **anonymous (unnamed) functions** in a single line.

### ✅ **Syntax:**

```python
lambda arguments: expression
```

### ✅ **Example 1: Basic Usage**

```python
square = lambda x: x * x
print(square(5))  # Output: 25
```

### ✅ **Example 2: With `map()`**

```python
numbers = [1, 2, 3, 4]
squares = map(lambda x: x ** 2, numbers)
print(list(squares))  # Output: [1, 4, 9, 16]
```

### ✅ **Example 3: With `filter()` (Bonus!)**

```python
even_numbers = list(filter(lambda x: x % 2 == 0, range(10)))
print(even_numbers)  # Output: [0, 2, 4, 6, 8]
```

### ✅ **Real-life Use Case in Pentesting:**

Extract domain names from URLs:

```python
urls = ['http://example.com/login', 'https://test.com/index']
domains = list(map(lambda url: url.split('/')[2], urls))
print(domains)  # Output: ['example.com', 'test.com']
```

📚 Docs: [https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions](https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions)

---

## 🔹 Combined Example (zip + map + lambda)

```python
a = [1, 2, 3]
b = [10, 20, 30]

# Multiply elements from both lists
result = map(lambda x: x[0] * x[1], zip(a, b))
print(list(result))  # Output: [10, 40, 90]
```

---

## ✅ Summary Table

|Function|Purpose|Common Use|
|---|---|---|
|`zip()`|Combine iterables into tuples|Pairing usernames/passwords|
|`map()`|Apply a function to each item|Data transformation|
|`lambda`|Create quick anonymous functions|Used with `map`, `filter`, etc.|

---

Would you like a cheat sheet of these functions in PDF format for offline use?