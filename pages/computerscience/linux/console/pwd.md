# pwd

The `pwd` command stands for **Print Working Directory**. It is a fundamental command-line utility found in Unix and GNU/Linux operating systems used to output the absolute path of the current directory you are navigating in the terminal.

# What pwd Is

When working in a command-line interface, there is no graphical window to show you what folder you are currently inside. The terminal keeps track of your current location in the file system, known as your "working directory." 

If you ever lose track of where you are, running the `pwd` command will print the full, absolute path from the root directory down to your current location.

## Shell Built-in vs. Executable

In most modern systems, there are actually two versions of `pwd`:
1. **Shell Built-in:** Modern shells like Bash have their own internal version of `pwd`. This is the one that executes by default because it is faster. It relies on the `$PWD` environment variable.
2. **Standalone Executable:** There is also a dedicated binary program, usually located at `/bin/pwd`, provided by the GNU Coreutils package.

# Common Options

The `pwd` command is very simple and doesn't require any arguments to run. However, it does support two primary flags that deal with symbolic links (symlinks).

## `-L` (Logical Path)

This is the default behavior in most shells. If you used a symbolic link to navigate into your current directory, `pwd -L` will print the path containing the symlink, exactly as you typed it to get there.

## `-P` (Physical Path)

If you want to know the true, underlying location of the folder on the hard drive, you use the `-P` flag. `pwd -P` resolves all symbolic links and prints the actual physical path to the directory.

# Practical Examples

Here are some common ways you will see the `pwd` command used in the terminal.

## Basic Usage

Simply typing the command with no options returns your current logical path.

* **Command:** `pwd`
* **Output:** `/home/user/Documents/Projects`

## Resolving Symbolic Links

Imagine you have a directory at `/var/www/html` and you create a symbolic link to it in your home folder called `website`. You navigate into it using `cd ~/website`.

* **Command:** `pwd` (or `pwd -L`)
* **Output:** `/home/user/website` (This is the logical path)
* **Command:** `pwd -P`
* **Output:** `/var/www/html` (This is the physical path where the files actually live)

## Using the Executable Specifically

If you want to bypass the shell's built-in version of `pwd` and use the system binary, you can call it by its absolute path.

* **Command:** `/bin/pwd`
* **Output:** `/home/user/Documents`

# Summary

The `pwd` command is one of the most basic but essential tools in a Linux user's toolkit. It serves as your "You Are Here" marker on the map of the file system, ensuring you always know your exact context before running scripts, deleting files, or navigating elsewhere.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* file-system
* paths

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| pwd | https://www.gnu.org/software/coreutils/manual/html_node/pwd-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| Bash | https://www.gnu.org/software/bash/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pwd.html | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| absolute path | The complete, exact path to a file or directory, starting from the root directory (`/`). | 
| arguments | Extra data or filenames provided to a command when it is run to change how it operates. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| binary | A compiled, executable computer program (often synonymous with "executable"). | 
| built-in | A command that is built directly into the shell itself, rather than being an external program. | 
| cd | Change Directory; a command used to navigate between different folders in the file system. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| directory | Another word for a folder; a location in the file system used for storing files and other directories. | 
| environment variable | A dynamic, named value stored in the shell that can affect the way running processes behave. | 
| executable | A file that contains code which the computer can run as a program (e.g., `/bin/pwd`). | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-P`) passed to a command to modify its default behavior. | 
| GNU | GNU's Not Unix; a massive collection of free software, including the core utilities for Linux. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| hard drive | The primary hardware component of a computer used for persistent data storage. | 
| Linux | An open-source, Unix-like operating system kernel. | 
| logical path | The file path as the user sees it, which may include symbolic links. | 
| OS | Operating System; the software that manages computer hardware and provides common services for programs. | 
| physical path | The true, underlying path on the storage disk, with all symbolic links resolved. | 
| root directory | The highest level directory in a Unix/Linux file system, represented by a single forward slash (`/`). | 
| scripts | Text files containing a sequence of commands intended to be executed by the shell. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| symbolic link | A special type of file that points to another file or folder, similar to a shortcut in Windows. | 
| symlink | Shorthand term for a symbolic link. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| working directory | The directory in the file system that the terminal process is currently operating within. | 