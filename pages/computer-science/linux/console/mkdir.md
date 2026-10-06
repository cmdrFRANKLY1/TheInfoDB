# mkdir

The `mkdir` command stands for **Make Directory**. It is a fundamental command-line utility in Unix, Linux, and other Unix-like operating systems used to create new directories (folders) in the file system.

# What mkdir Is

Whenever you need to create a new place to store files, you use `mkdir`. By default, when you provide a name to `mkdir`, it will create a new, empty directory with that name inside your current working directory. 

If you try to create a directory that already exists, `mkdir` will return an error message and refuse to overwrite the existing folder, protecting your data.

# Common Options

While `mkdir` is incredibly simple, it includes a few powerful flags that make scripting and complex file system organization much easier.

## `-p` (Parents)

This is arguably the most important flag for `mkdir`. By default, `mkdir` cannot create a nested directory if the parent directories do not exist (e.g., `mkdir a/b/c` will fail if `a/b/` doesn't exist yet). 

The `-p` flag tells the command to create any missing parent directories along the path automatically. Additionally, if the directory already exists, `-p` prevents the command from throwing an error.

## `-v` (Verbose)

By default, successful Linux commands operate silently. The `-v` flag makes `mkdir` verbose, meaning it will print a confirmation message to the terminal for every single directory it successfully creates.

## `-m` (Mode)

The `-m` flag allows you to set the file permissions (the "mode") of the directory at the exact moment it is created, rather than having to run `chmod` afterward. You provide the permissions in a numeric format (like `755` or `700`).

# Practical Examples

Here are the most common ways you will use `mkdir` in the terminal to organize your files.

## Basic Usage

Typing the command followed by a single argument creates a single directory.

* **Command:** `mkdir Documents`
* **Result:** Creates a new folder named `Documents` in the current working directory.

## Creating Multiple Directories

You can pass multiple arguments separated by spaces to create several directories at once.

* **Command:** `mkdir Music Pictures Videos`
* **Result:** Creates three separate folders in your current location simultaneously.

## Creating Nested Paths

When you are setting up a complex project structure, you often need directories inside of directories.

* **Command:** `mkdir -p project/src/components`
* **Result:** Creates the `project` folder, the `src` folder inside it, and finally the `components` folder inside that. No errors are thrown, even if `project` already existed.

## Creating a Directory with Specific Permissions

If you want to create a private folder that only your user account can access, you can set the mode immediately.

* **Command:** `mkdir -m 700 private_keys`
* **Result:** Creates a folder named `private_keys` and sets its permissions so that only the owner can read, write, or execute (open) it.

## Combining Flags

Like most Linux utilities, you can combine options for maximum efficiency.

* **Command:** `mkdir -pv app/config app/logs`
* **Result:** Creates the `app` folder (if it doesn't exist) and the `config` and `logs` folders inside it, printing a confirmation message for each one created.

# Summary

The `mkdir` command is the primary way users and scripts build out the structural skeleton of a file system. By utilizing the `-p` flag, you can instantly generate deep, complex directory trees with a single command, making it an essential tool for developers and system administrators alike.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* file-system
* directories
* mkdir

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| mkdir | https://www.gnu.org/software/coreutils/manual/html_node/mkdir-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/mkdir.html | 
| chmod | https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data or filenames provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| chmod | Change Mode; a separate command used to change the access permissions of files and directories. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| directory tree | A visual or logical representation of directories stored inside other directories, branching out like a tree. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. | 
| flags | Options (usually preceded by a hyphen, like `-p`) passed to a command to modify its default behavior. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| mkdir | Make Directory; the core command used to create new folders in Unix-like systems. | 
| mode | Another term for permissions; dictates who can read, write, or execute a file or directory. | 
| nested | An arrangement where items are placed inside other similar items (e.g., a folder inside a folder). | 
| numeric format | A way of representing file permissions using a three-digit octal number (e.g., 755). | 
| parent directories | The directories that logically sit above the current or target directory in the file system hierarchy. | 
| permissions | Access rights assigned to files and directories that dictate who can read, write, or enter them. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| root directory | The highest level directory in a Unix/Linux file system, represented by a single forward slash (`/`). | 
| scripts | Text files containing a sequence of commands intended to be executed automatically by the shell. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| system administrators | IT professionals responsible for installing, maintaining, and configuring computer systems and networks. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. | 
| working directory | The directory in the file system that your terminal process is currently operating within. | 