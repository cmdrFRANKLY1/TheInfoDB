# chmod

The `chmod` command stands for **Change Mode**. It is a fundamental command-line utility in Unix, Linux, and other Unix-like operating systems used to change the access permissions of files and directories.

# What chmod Is

In a multi-user Linux environment, security and file integrity depend entirely on permissions. Every file and directory is owned by a specific user and group, and access is governed by three distinct permission types: **read** ($r$), **write** ($w$), and **execute** ($x$). These permissions apply separately to three categories of people: the file's **owner** (u), the members of the file's **group** (g), and **others** (o) on the system.

The `chmod` command is the primary tool used by system administrators and developers to modify these mode bits. It can be executed using two different syntax methodologies: symbolic notation (using letters and operators) and octal notation (using numbers).

# Permission Categories and Types

Before modifying permissions, it helps to understand how Linux structures access rights, typically displayed when running `ls -l`.

## The Three Permission Types

* **Read ($r$):** For files, this grants the right to open and read the contents. For directories, it allows listing the files inside.

* **Write ($w$):** For files, this grants the right to modify, edit, or delete contents. For directories, it allows creating, deleting, or renaming files within.

* **Execute ($x$):** For files, this grants the right to run the file as a program or script. For directories, it allows entering (traversing) the folder.

## The Three User Classes

* **User / Owner ($u$):** The individual user who created or owns the file.

* **Group ($g$):** A collection of user accounts that share access rights to the file.

* **Others ($o$):** Everyone else on the system who does not own the file and is not in the group.

* **All ($a$):** A shorthand combining user, group, and others.

# Notation Methods

`chmod` supports two distinct ways to specify permissions: symbolic and octal.

## 1. Symbolic Notation

Symbolic mode uses letters and operators to add, remove, or set specific permissions without altering the rest. The syntax follows `[who][operator][permission]`.

* **Operators:** 
  * `+` adds a permission.
  * `-` removes a permission.
  * `=` assigns an exact permission, overwriting previous settings.

* **Examples:**
  * `chmod u+x script.sh` (Adds execute permission for the user/owner)
  * `chmod go-w file.txt` (Removes write permission for group and others)

## 2. Octal Notation

Octal mode uses a three-digit (or four-digit) base-8 number to set permissions for the user, group, and others simultaneously. Each digit is a sum of the individual permission values:

* Read = $4$
* Write = $2$
* Execute = $1$
* No permission = $0$

By adding these values together, you get a unique number from $0$ to $7$ for each user class:

* $0$ = `---` (No permissions)
* $1$ = `--x` (Execute only)
* $2$ = `-w-` (Write only)
* $3$ = `-wx` (Write and execute)
* $4$ = `r--` (Read only)
* $5$ = `r-x` (Read and execute)
* $6$ = `rw-` (Read and write)
* $7$ = `rwx` (Read, write, and execute)

# Practical Examples

Here are the most common ways you will use `chmod` in the terminal to manage system security.

## Making a Script Executable

This is one of the most common tasks for developers writing shell scripts.

* **Command:** `chmod +x deploy.sh`

* **Result:** Adds execute permissions for all users (`u`, `g`, and `o`) so the script can be run directly from the terminal.

## Setting Strict Private Permissions for a File

When handling sensitive files like SSH private keys, you must ensure only the owner can read them.

* **Command:** `chmod 600 id_rsa`

* **Result:** Sets permissions to read and write for the owner (`6`), and absolutely no access for the group (`0`) or others (`0`).

## Securing a Directory and Its Contents

Configuring standard web server or application folder permissions.

* **Command:** `chmod 755 /var/www/html/`

* **Result:** Grants the owner full read, write, and execute rights (`7`), while giving group members and others read and execute access (`5`), allowing them to view and enter the directory without modifying files.

## Recursively Modifying Permissions

If you need to change permissions across an entire directory tree.

* **Command:** `chmod -R 644 /var/www/html/docs/`

* **Result:** Recursively applies read/write for the owner and read-only for everyone else across all files within the `docs` folder.

# Summary

The `chmod` command is an essential pillar of Linux security and file system management. Whether you are using symbolic arguments like `+x` to make a script runnable or octal codes like `755` to lock down a web directory, mastering `chmod` ensures your infrastructure remains secure and functional.

# Tags

* linux

* bash

* gnu

* command-line

* coreutils

* terminal

* sysadmin

* security

* permissions

* chmod

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| chmod | https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/chmod.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data, paths, or flags provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| chmod | Change Mode; a command used to change the access permissions of files and directories. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| execute | To run a program or script, or to enter/traverse a directory. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-R`) passed to a command to modify its default behavior. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| group | A collection of user accounts on a Linux system that share common access rights to files and directories. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| octal notation | A base-8 numbering system used in `chmod` to represent file permissions with three digits (e.g., 755). | 
| owner | The user account that created or currently owns a specific file or directory. | 
| permissions | Access rights assigned to files and directories that dictate who can read, write, or execute them. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| read | A file permission granting the ability to open, view, and read the contents of a file or directory. | 
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories within it. | 
| script | A text file containing a sequence of commands intended to be executed automatically by a shell. | 
| security | Measures taken to protect computer systems and networks from unauthorized access or damage. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| SSH | Secure Shell; a cryptographic network protocol used to log into remote machines securely. | 
| symbolic notation | A method of modifying file permissions using letters (`u`, `g`, `o`) and operators (`+`, `-`, `=`). | 
| sysadmin | System administrator; an IT professional responsible for maintaining, configuring, and troubleshooting systems. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| write | A file permission granting the ability to modify, edit, or delete the contents of a file or directory. | 
