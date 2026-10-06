# touch

The `touch` command is a standard command-line utility used in Unix and GNU/Linux operating systems. While it was originally designed to update the access and modification timestamps of files, it is most widely used by modern users as a quick way to create new, empty files.

# What touch Is

In a Linux file system, every file has timestamps associated with it. The two most common are the **access time** (when the file was last read) and the **modification time** (when the file's contents were last changed). 

The original purpose of `touch` was simply to "touch" a file, instantly updating both of these timestamps to the current system time without actually opening or changing the data inside the file. 

However, `touch` has a secondary, built-in behavior: if you tell it to touch a file that does not currently exist, it will create a brand-new, empty file with that name. Because of this, it has become the standard command for quickly generating placeholder files.

# Common Options

While creating empty files requires no options, `touch` includes several flags that give system administrators precise control over file timestamps.

## `-c` (No Create)

By default, `touch` creates a new file if the target doesn't exist. The `-c` (or `--no-create`) flag tells the command to *only* update the timestamps of an existing file. If the file is missing, `touch` will simply do nothing and exit without throwing an error.

## `-a` (Access Time)

If you only want to update the time the file was last accessed (leaving the modification time exactly as it was), you use the `-a` flag. 

## `-m` (Modification Time)

Conversely, if you only want to update the time the file was last modified (leaving the access time alone), you use the `-m` flag.

## `-d` (Date)

Instead of using the current system time, the `-d` flag allows you to parse a human-readable date string (like "yesterday" or "2 hours ago") and apply that specific time to the file's timestamps.

# Practical Examples

Here are the most common ways you will use `touch` in the terminal, from basic file creation to advanced timestamp manipulation.

## Creating a Single Empty File

This is the most common use case for developers and everyday users.

* **Command:** `touch index.html`
* **Result:** Creates a new, empty file named `index.html` in the current working directory. If `index.html` already existed, it merely updates its timestamps to the present moment without deleting its contents.

## Creating Multiple Files

You can pass multiple arguments separated by spaces to create several empty files at once.

* **Command:** `touch script.js style.css readme.md`
* **Result:** Creates all three files instantly in the current directory.

## Updating Timestamps Without Creating Files

If you are running a script that relies on file timestamps (like a backup or build system) but you don't want to accidentally create a file if it was deleted, you use the no-create flag.

* **Command:** `touch -c config.json`
* **Result:** Updates the timestamps of `config.json` to the current time. If `config.json` was deleted earlier, nothing happens.

## Faking a Timestamp

You can use the date string flag to set a file's timestamp to a specific point in the past or future.

* **Command:** `touch -d "2010-01-01 12:00:00" old_record.txt`
* **Result:** Changes the access and modification times of `old_record.txt` to noon on January 1st, 2010.

# Summary

The `touch` command is a remarkably simple but dual-purpose tool. For developers, it is the absolute fastest way to generate empty boilerplate files. For system administrators, it provides precise control over file metadata, allowing scripts and backup utilities to manage timestamps accurately.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* file-system
* timestamps
* touch

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| touch | https://www.gnu.org/software/coreutils/manual/html_node/touch-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/touch.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| access time | A timestamp associated with a file that records the exact date and time the file was last read or opened. | 
| arguments | Extra data, such as filenames or text, provided to a command when it is run to tell it what to operate on. | 
| backup | A copy of computer data taken and stored elsewhere so that it may be used to restore the original after a data loss event. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| build system | Software tools that automate the process of compiling source code into executable files. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| empty file | A standard computer file that contains zero bytes of data; it has a name and metadata, but no content. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. | 
| flags | Options (usually preceded by a hyphen, like `-c`) passed to a command to modify its default behavior. | 
| GNU | GNU's Not Unix; a massive collection of free software, including the core utilities for Linux. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| metadata | Data that provides information about other data, such as a file's creation date, owner, or permissions. | 
| modification time | A timestamp associated with a file that records the exact date and time its actual contents were last modified. | 
| OS | Operating System; the software that manages computer hardware and provides common services for programs. | 
| parse | To analyze a string of text or symbols into logical syntactic components. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| scripts | Text files containing a sequence of commands intended to be executed automatically by the shell. | 
| system administrators | IT professionals responsible for installing, maintaining, and configuring computer systems and networks. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| timestamps | Digital records of the time at which a particular event occurred, such as the creation or modification of a file. | 
| touch | A standard command-line utility used to update file timestamps or create empty files. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| working directory | The directory in the file system that your terminal process is currently operating within. | 