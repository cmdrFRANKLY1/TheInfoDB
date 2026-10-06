# ps

The `ps` command stands for **Process Status**. It is a standard command-line utility in Unix, Linux, and other Unix-like operating systems used to provide a snapshot of the currently running processes on the system.

# What ps Is

When you need to know what programs are actively running on your computer, the `ps` command is one of the primary tools available. 

Unlike real-time system monitors like `top` or `htop`, which give you a continuously updating interactive view, `ps` takes a single static snapshot of the system state at the exact moment it is executed and prints it to standard output. 

By default, running `ps` without any arguments will list processes associated with your current terminal session. However, by combining specific options (often adopted from Unix-style, BSD-style, and GNU-style flag conventions), you can query every process running across the entire system.

# Common Options

The `ps` command features a unique mixture of option styles. The most common combination used by developers and system administrators is `ps aux`.

## `-e` or `-A` (All Processes)

The `-e` (or `-A`) flag tells `ps` to select every process running on the system, regardless of which user owns them or what terminal they are attached to.

## `-f` (Full Format Listing)

The `-f` flag produces a full-format listing. This adds detailed columns showing the UID (user ID), PPID (parent process ID), start time, and the exact command arguments used to launch the process.

## `a` (BSD Style: All Users with TTY)

When used without a hyphen (BSD style), the `a` option lists processes for all users that are associated with a terminal (TTY).

## `u` (BSD Style: User-Oriented Format)

The `u` option displays a user-oriented format, providing detailed information such as CPU usage percentage (`%CPU`), memory usage percentage (`%MEM`), and the specific user running the process.

## `x` (BSD Style: Processes Without TTY)

The `x` option tells `ps` to include processes that are not attached to any terminal window (such as background daemons and system services). Combining `a`, `u`, and `x` (`ps aux`) gives you a comprehensive view of everything running.

# Practical Examples

Here are the most common ways you will use `ps` in the terminal to inspect system processes.

## Basic Process Listing

This is the default usage, showing processes running in your current shell session.

* **Command:** `ps`

* **Result:** Returns a short list showing your shell's Process ID (PID), terminal type (TTY), cumulative CPU time, and command name.

## Viewing All System Processes (Full Format)

Using standard Unix syntax to see every process running on the machine in detail.

* **Command:** `ps -ef`

* **Result:** Outputs a comprehensive table of all processes, detailing the user, PID, PPID, execution time, and command path for every application.

## The Classic Comprehensive View (`ps aux`)

Combining BSD-style flags to inspect CPU and memory consumption across all user and system processes.

* **Command:** `ps aux`

* **Result:** Displays a wide table showing the process owner, PID, CPU percentage, memory percentage, virtual memory size, resident set size, TTY, process state, start time, CPU time, and the full command string.

## Filtering Results with grep

Because `ps` can output massive amounts of text, it is routinely paired with a pipe (`|`) and `grep` to isolate specific programs.

* **Command:** `ps aux | grep "nginx"`

* **Result:** Takes the process snapshot, feeds it into `grep`, and returns only the lines corresponding to the "nginx" web server.

## Viewing Process Hierarchies

You can view processes in a visual tree format to see parent-child relationships.

* **Command:** `ps f` (or `ps axjf`)

* **Result:** Displays an ASCII-art process tree, making it easy to see which background processes spawned others.

# Summary

The `ps` command is a foundational diagnostic tool for system administration and software troubleshooting. Whether you are performing a quick check on your active shell session with basic `ps`, inspecting background services with `ps -ef`, or auditing resource utilization with `ps aux`, mastering `ps` is essential for controlling your Linux environment.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* process-management
* sysadmin
* ps

# Hyperlinks

| Word in Document | Official Source Hyperlink |
| ----- | ----- |
| ps | https://man7.org/linux/man-pages/man1/ps.1.html |
| GNU | https://www.gnu.org/ |
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ps.html |
| Linux | https://www.kernel.org/ |

# Mouse Over Information

| Word in Document | Mouse Over Information |
| ----- | ----- |
| %CPU | The percentage of the computer's central processing unit resources currently being utilized by the process. |
| %MEM | The percentage of the computer's physical RAM memory currently being consumed by the process. |
| arguments | Extra data, parameters, or flags passed to a command when it is executed to dictate its behavior. |
| ASCII-art | A graphic design technique that uses computers for presentation and consists of pictures pieced from printable characters. |
| background processes | Computer programs that execute quietly behind the scenes without requiring direct user interaction or a terminal window. |
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. |
| command-line | A text-based interface used to interact with a computer operating system by typing commands. |
| daemon | A background computer program that runs continuously as a service rather than being under direct user control. |
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. |
| flags | Options (usually preceded by a hyphen or combined in BSD style) passed to a command to modify its default behavior. |
| GNU | GNU's Not Unix; a massive collection of free software, including core system utilities. |
| grep | Global Regular Expression Print; a command used to search text for lines matching a specific pattern. |
| htop | An interactive and visually appealing process viewer and system monitor, often preferred over 'top'. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| parent process | A computer process that has created one or more child processes to execute sub-tasks. |
| PID | Process ID; a unique numerical identifier assigned by the operating system to every running process. |
| pipe | A feature in Unix/Linux represented by the `|` character, used to pass the output of one command as input to another. |
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining operating system compatibility. |
| PPID | Parent Process ID; the numerical identifier of the process that launched the current process. |
| process | An instance of a computer program that is currently being executed by the operating system. |
| RAM | Random Access Memory; the physical hardware that provides high-speed, short-term data storage for the CPU. |
| shell | A computer program that exposes an operating system's services to a human user or other programs. |
| snapshot | A static, non-updating view or record of system states captured at a single, specific point in time. |
| standard output | Often abbreviated as `stdout`; the default data stream where a program writes its normal output data (the terminal screen). |
| sysadmin | System administrator; an IT professional responsible for maintaining, configuring, and troubleshooting computer systems. |
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. |
| top | A command-line utility that provides a dynamic, real-time view of running processes and system resource usage. |
| TTY | Teletypewriter; the technical term representing the terminal device or console session connected to a process. |
| UID | User ID; a unique numerical value assigned by the operating system to identify a specific user account. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
