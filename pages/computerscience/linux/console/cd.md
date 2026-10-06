# cd

The `cd` command stands for **Change Directory**. It is arguably the most frequently used command in any Unix-like operating system, allowing users to navigate through the file system by changing their current working directory.

# What cd Is

Unlike most command-line tools (like `ls` or `mkdir`), `cd` is almost always a **shell built-in** rather than a standalone executable binary. 

Because a child process cannot change the working directory of its parent process, `cd` must be executed directly by the shell itself (like Bash or Zsh). If `cd` were an external program, running it would only change the directory for that temporary program, leaving your main terminal exactly where it started.

# Absolute vs. Relative Paths

When using the `cd` command, you tell it where you want to go by providing a path. There are two ways to write this path:

## Absolute Paths

An absolute path specifies the exact location in the file system starting from the very top, known as the root directory (`/`). Absolute paths always begin with a forward slash.

* **Example:** `cd /var/www/html`

## Relative Paths

A relative path specifies a location relative to your *current* working directory. It does not start with a slash.

* **Example:** If you are currently in `/var/www`, you can just type `cd html` to enter the `html` subdirectory.

# Special Directory Symbols

The `cd` command relies heavily on a few standard shortcut symbols that make navigation much faster.

* `.` (Single Dot): Represents the current directory.
* `..` (Double Dot): Represents the parent directory (one level up).
* `~` (Tilde): Represents the current user's home directory.
* `-` (Hyphen): Represents the previous working directory you were in before the last `cd` command.

# Practical Examples

Here are the most common ways you will use `cd` in the terminal.

## Basic Navigation

Provide a path to move into a specific folder.

* **Command:** `cd /etc/ssh`
* **Result:** Changes your working directory to the absolute path `/etc/ssh`.

## Moving Up the Hierarchy

Use the double-dot symbol to move into the parent directory.

* **Command:** `cd ..`
* **Result:** Moves you one folder up. If you were in `/home/user/Downloads`, you are now in `/home/user`.

* **Command:** `cd ../..`
* **Result:** Moves you two folders up.

## Returning Home

If you get lost in the file system, you can easily jump back to your user's home directory.

* **Command:** `cd ~`
* **Result:** Jumps to your home directory (e.g., `/home/user`).

* **Command:** `cd`
* **Result:** Typing `cd` with absolutely no arguments defaults to taking you back to your home directory.

## Toggling Between Directories

If you are constantly switching back and forth between two distant folders, the hyphen is a massive time-saver.

* **Command:** `cd -`
* **Result:** Takes you back to whatever directory you were in immediately prior to your last `cd` command.

# Summary

The `cd` command is the steering wheel of the Linux command line. By mastering absolute and relative paths, along with the special navigation shortcuts, you can rapidly traverse complex file system hierarchies with just a few keystrokes.

# Tags

* linux
* bash
* command-line
* navigation
* file-system
* paths
* shell-builtin

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| :--- | :--- | 
| cd | https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html | 
| Unix | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cd.html | 
| Bash | https://www.gnu.org/software/bash/manual/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| :--- | :--- | 
| absolute path | The complete, exact path to a file or directory, starting from the root directory (`/`). | 
| arguments | Extra data or filenames provided to a command when it is run to change how it operates. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| binary | A compiled, executable computer program (often synonymous with "executable"). | 
| built-in | A command that is built directly into the shell itself, rather than being an external program. | 
| cd | Change Directory; a command used to navigate between different folders in the file system. | 
| child process | A computer process created by another process (the parent process). | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| directory | Another word for a folder; a location in the file system used for storing files and other directories. | 
| executable | A file that contains code which the computer can run as a program. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| home directory | A dedicated directory provided by the operating system for a specific user to store personal files. | 
| Linux | An open-source, Unix-like operating system kernel. | 
| ls | List; a command used to list the contents (files and folders) of a directory. | 
| mkdir | Make Directory; a command used to create new folders. | 
| parent directory | The directory that logically sits one level above the current directory in the file system hierarchy. | 
| parent process | A computer process that has created one or more child processes. | 
| relative path | A path that specifies a file or directory location relative to the current working directory. | 
| root directory | The highest level directory in a Unix/Linux file system, represented by a single forward slash (`/`). | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| working directory | The directory in the file system that the terminal process is currently operating within. | 
| Zsh | Z shell; an extended Bourne shell with a large number of improvements, often used as an alternative to Bash. | 