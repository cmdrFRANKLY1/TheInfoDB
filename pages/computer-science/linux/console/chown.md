# chown

The `chown` command stands for **Change Owner**. It is a fundamental administrative utility in Unix, Linux, and other Unix-like operating systems used to change the user and/or group ownership of files, directories, and symbolic links.

# What chown Is

In a multi-user Linux environment, file security and access control depend entirely on permissions and ownership. Every file and directory is associated with a specific user owner and a group owner. 

While the `chmod` command modifies *how* users can access a file (read, write, execute), the `chown` command controls *who* owns the file in the first place. Because changing file ownership can have profound security implications, this command is restricted primarily to the superuser (`root`), though standard file owners can sometimes change a file's group ownership to a group they belong to.

# Common Options

The `chown` command supports several important command-line flags to manage file trees and control how changes are applied.

## `-R` (Recursive)

By default, `chown` only modifies the ownership of the exact target file or directory specified. If you need to change ownership across an entire directory tree (including all nested files and subdirectories), you must use the `-R` flag.

## `-v` (Verbose)

Because successful Linux commands operate silently, the `-v` flag makes `chown` verbose, printing a detailed confirmation message for every file or directory whose ownership is successfully modified.

## `-c` (Changes Only)

Similar to verbose mode, the `-c` flag reports modifications, but it *only* prints a message for files that actually underwent an ownership change, reducing noise in large automation scripts.

## `--reference=`

Instead of manually typing out a username or group, the `--reference=FILE` flag tells `chown` to copy the user and group ownership settings directly from an existing reference file.

# Syntax and Specification

The basic syntax for `chown` follows this structure: `chown [options] new_owner[:new_group] target`.

* **User Only:** `chown username file.txt` (Changes only the user owner, leaving the group unchanged).

* **User and Group:** `chown username:groupname file.txt` (Changes both the user and the group simultaneously).

* **Group Only:** `chown :groupname file.txt` (Preceding the name with a colon changes only the group owner).

# Practical Examples

Here are the most common ways you will use `chown` in the terminal to manage system files and web server environments.

## Changing the Owner of a Single File

This is the most basic use case, assigning ownership of a file to a different user account.

* **Command:** `sudo chown developer app.js`

* **Result:** Changes the user owner of `app.js` to "developer".

## Changing User and Group Simultaneously

Often, web applications require both a specific service user and group to function correctly.

* **Command:** `sudo chown www-data:www-data index.php`

* **Result:** Sets both the user owner and group owner of `index.php` to `www-data`.

## Recursively Changing Directory Ownership

When deploying applications to a web server directory, you must often update ownership for all nested files.

* **Command:** `sudo chown -R www-data:www-data /var/www/html/`

* **Result:** Recursively updates the user and group ownership of the web root folder and every file and subfolder inside it to `www-data`.

## Changing Group Ownership Only

If you only want to update the group assignment without altering the user owner.

* **Command:** `sudo chown :developers project.txt`

* **Result:** Changes the group ownership of `project.txt` to "developers".

# Summary

The `chown` command is an indispensable tool for Linux system administration and deployment security. Whether you are assigning web server file ownership using `chown www-data:www-data` or recursively securing a directory tree with `-R`, mastering `chown` ensures your system assets are controlled by the correct accounts.

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

* chown

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| chown | https://www.gnu.org/software/coreutils/manual/html_node/chown-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/chown.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data, such as usernames or file paths, provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| chown | Change Owner; a command used to change the user and group ownership of files and directories. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-R`) passed to a command to modify its default behavior. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| group | A collection of user accounts on a Linux system that share common access rights to files and directories. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| multi-user | An operating system architecture that allows multiple distinct user accounts to access the system concurrently. | 
| owner | The user account that created or currently owns a specific file or directory. | 
| permissions | Access rights assigned to files and directories that dictate who can read, write, or execute them. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories within it. | 
| root | The highest-level administrative user account in a Linux system, possessing complete system control. | 
| security | Measures taken to protect computer systems and networks from unauthorized access or damage. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| superuser | A special user account used for system administration, which has unrestricted access to the entire operating system. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| user account | An identity established on a computer system that allows a specific individual to log in and access resources. | 
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. | 
