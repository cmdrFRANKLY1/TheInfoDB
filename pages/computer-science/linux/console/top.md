# top

The `top` command stands for **Table of Processes** (though widely accepted as just "top"). It is a standard performance-monitoring system utility found in Unix, Linux, and other Unix-like operating systems used to provide a dynamic, real-time view of a running system.

# What top Is

While commands like `ps` give you a static, single-shot snapshot of processes at the exact moment they are executed, `top` opens an interactive, continuously updating dashboard. 

It displays critical system summary information at the top—including CPU load, memory utilization, swap usage, and uptime—followed by an ordered, real-time table of active processes sorted by resource consumption. It is an indispensable tool for diagnosing system bottlenecks, identifying runaway processes, and tracking down what is consuming your CPU or RAM.

# Interactive Command-Line Interface

Unlike standard utilities that run and immediately exit back to your prompt, `top` remains open as an interactive program. You can press specific single-letter keys while `top` is running to change how data is displayed:

* **`q`:** Quit the program and return to the normal terminal prompt.
* **`h` or `?`:** Open the interactive help menu.
* **`k`:** Kill a process (prompts you to enter the Process ID and the signal number).
* **`r`:** Renice a process (change its priority level).
* **`M`:** Sort the process table dynamically by memory usage (`%MEM`).
* **`P`:** Sort the process table dynamically by CPU usage (`%CPU`) (this is the default).
* **`T`:** Sort by cumulative execution time (`TIME+`).
* **`1` (Number One):** Toggle between viewing cumulative stats for all CPU cores combined versus individual core breakdowns.
* **`c`:** Toggle the command column between showing just the program name or the full command-line path with arguments.
* **`spacebar`:** Immediately force a manual refresh of the screen data.

# Reading the top Dashboard

The screen is split into two primary sections: the system summary header at the top and the process table below.

## The System Summary Header

* **Line 1 (Uptime & Users):** Shows the current system time, how long the machine has been running (`up`), how many user sessions are active, and the system **load averages** over the last 1, 5, and 15 minutes.
* **Line 2 (Tasks):** Shows the total count of processes and breaks them down into running, sleeping, stopped, and zombie states.
* **Lines 3 & 4 (CPU States):** Shows the percentage of CPU time spent by user applications (`us`), system kernel operations (`sy`), nice-priority processes (`ni`), idle time (`id`), waiting for I/O (`wa`), and hardware/software interrupts.
* **Lines 5 & 6 (Memory & Swap):** Details total, used, free, and buffered/cached physical RAM and swap space.

## The Process Table Columns

The lower half of the screen lists individual processes in columns:

* **`PID`:** Process ID unique identifier.
* **`USER`:** The user account that owns and launched the process.
* **`PR` & `NI`:** Process priority and nice values (scheduling weight).
* **`VIRT`, `RES`, `SHR`:** Virtual, Resident (physical RAM), and Shared memory sizes.
* **`S`:** Process status (e.g., `R` for running, `D` for uninterruptible sleep, `S` for sleeping).
* **`%CPU` & `%MEM`:** Current percentage of CPU and physical memory being consumed.
* **`TIME+`:** Total cumulative CPU time the process has used since it started.
* **`COMMAND`:** The name or command-line string used to execute the process.

# Common Options

While `top` is primarily interactive, it supports command-line flags to customize its startup behavior.

## `-d` (Delay / Refresh Interval)

By default, `top` refreshes its data every 3.0 seconds. The `-d` flag lets you specify a custom delay interval in seconds.

* **Command:** `top -d 1`
* **Result:** Forces `top` to update its screen metrics every 1 second instead of every 3 seconds.

## `-u` (Filter by User)

If you only want to see processes belonging to a specific user account, you can pass the username.

* **Command:** `top -u www-data`
* **Result:** Restricts the process table to display only applications and services owned by the "www-data" user.

## `-p` (Monitor Specific PIDs)

You can tell `top` to track only specific processes by passing their Process IDs.

* **Command:** `top -p 1234,5678`
* **Result:** Monitors only processes with PIDs 1234 and 5678 in real-time.

# Practical Examples

Here are the most common ways you will use `top` in the terminal for system administration.

## Launching the Default Monitor

This is the standard way to inspect overall machine health.

* **Command:** `top`
* **Result:** Opens the live interactive performance monitor dashboard.

## Monitoring with a Faster Refresh Rate

Useful when troubleshooting a sudden spike in CPU usage.

* **Command:** `top -d 0.5`
* **Result:** Refreshes process data twice every second.

## Batch Mode for Scripting

If you want to capture output to a file or pipe it into another tool rather than drawing an interactive screen, you use batch mode (`-b`), often combined with iteration limits (`-n`).

* **Command:** `top -b -n 1 > system_snapshot.txt`
* **Result:** Captures a single non-interactive snapshot of the current `top` screen and writes it into a text file.

# Summary

The `top` command is an essential real-time diagnostic utility for any Linux system administrator or developer. Whether you are hunting down a resource-heavy script using interactive sorting keys (`P` or `M`), tracking system load averages, or monitoring memory constraints, `top` provides immediate visibility into system performance.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* sysadmin
* monitoring
* performance
* top

# Hyperlinks

| Word in Document | Official Source Hyperlink |
| :--- | :--- |
| top | https://gitlab.com/procps-ng/procps |
| GNU | https://www.gnu.org/ |
| Linux | https://www.kernel.org/ |
| procps | https://gitlab.com/procps-ng/procps |

# Mouse Over Information

| Word in Document | Mouse Over Information |
| :--- | :--- |
| arguments | Extra data, flags, or parameters passed to a command when executed to dictate its behavior. |
| batch mode | A non-interactive execution mode where commands output plain text data instead of rendering a live visual screen. |
| bottlenecks | Points of congestion in a system where hardware or software limitations slow down overall performance. |
| command-line | A text-based interface used to interact with a computer operating system by typing commands. |
| CPU | Central Processing Unit; the primary hardware chip that executes instructions and performs calculations. |
| daemon | A background computer program that runs continuously as a service rather than under direct user control. |
| delay interval | The specified time period a program waits between automatic data refreshes on the screen. |
| flags | Options (usually preceded by a hyphen, like `-d`) passed to a command to modify its default behavior. |
| GNU | GNU's Not Unix; a massive collection of free software, including core system utilities. |
| interactive | A program environment that remains open and accepts continuous keyboard input from the user. |
| kernel | The core component of an operating system that manages system resources and hardware communication. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| load averages | A measurement of the system workload representing the number of runnable or waiting processes over time. |
| memory | Short-term digital storage (RAM) used by the computer to actively hold and process data for programs. |
| nice | A command and metric used to control a process's priority level relative to other tasks on the system. |
| PID | Process ID; a unique numerical identifier assigned by the operating system to every running process. |
| process | An instance of a computer program that is currently being executed by the operating system. |
| RAM | Random Access Memory; the physical hardware providing high-speed, short-term data storage for the CPU. |
| real-time | The actual time during which something takes place, allowing events to be viewed instantly as they happen. |
| script | A text file containing a sequence of commands intended to be executed automatically by a shell. |
| shell | A computer program that exposes an operating system's services to a human user or other programs. |
| snapshot | A static, non-updating view or record of system states captured at a single, specific point in time. |
| swap space | A dedicated space on the storage drive used as virtual memory when physical RAM is full. |
| sysadmin | System administrator; an IT professional responsible for maintaining, configuring, and troubleshooting systems. |
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. |
| top | A command-line utility that provides a dynamic, real-time view of running processes and system resource usage. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
| uptime | A metric indicating how long a computer system has been continuously running without a reboot. |
| zombie process | A terminated process that still has an entry in the process table because its parent hasn't read its exit status. |
