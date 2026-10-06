# find

The `find` command is a remarkably powerful and flexible command-line utility in Unix, Linux, and other Unix-like operating systems. It is used to search for files and directories within a file system hierarchy based on a wide variety of user-defined criteria.

# What find Is

Unlike the `ls` command, which simply lists the immediate contents of a directory, `find` is designed to crawl deeply through directory trees. You give it a starting path, and it will recursively evaluate every single file and folder inside that path against a set of expressions or "tests."

Because `find` does not rely on a pre-built database (unlike the `locate` command), it reads the live file system. This means its results are always 100% accurate and up-to-date, though searching the entire root directory (`/`) can take a bit of time.

Interestingly, `find` is not part of the standard GNU Coreutils package like `ls` or `cp`; it belongs to a separate package called **GNU Findutils**.

# Common Options (Tests)

The `find` command uses a unique syntax: `find [starting_path] [expressions]`. The expressions act as filters to narrow down your search.

## `-name` and `-iname`

This is the most common test, used to search for files by their exact name. 
* `-name` is completely case-sensitive.
* `-iname` is case-insensitive, meaning it will find "File.txt", "file.TXT", and "FILE.txt" interchangeably.

## `-type`

If you only want to find files and ignore folders (or vice versa), you use the type flag.
* `-type f` limits the search strictly to standard files.
* `-type d` limits the search strictly to directories.

## `-size`

You can search for files based on how much disk space they consume. You can look for an exact size, or use `+` (greater than) and `-` (less than) modifiers.
* `M` stands for Megabytes, `G` stands for Gigabytes, and `k` stands for Kilobytes.

## `-mtime` (Modification Time)

This test allows you to find files based on when their contents were last modified, measured in 24-hour periods (days).
* `-mtime -7` finds files modified *within* the last 7 days.
* `-mtime +30` finds files modified *more than* 30 days ago.

## `-exec` (Execute)

This is the most powerful feature of `find`. Instead of just printing the names of the files it finds, `-exec` allows you to pass those files directly into another command (like `rm` or `chmod`) to manipulate them immediately.

# Practical Examples

Here are the most common ways you will use `find` to locate and manage data in the terminal.

## Finding a File by Name

To search for a specific file starting from your current working directory (`.`).

* **Command:** `find . -name "config.json"`
* **Result:** Recursively searches the current folder and all subfolders for a file exactly named `config.json`.

## Using Wildcards

You can use wildcards (wrapped in quotes to prevent the shell from expanding them) to find all files of a specific extension.

* **Command:** `find /var/log -type f -name "*.log"`
* **Result:** Looks inside `/var/log` for standard files (`-type f`) that end in `.log`.

## Finding Large Files

If your hard drive is full, you can use `find` to track down massive files anywhere on the system.

* **Command:** `find / -type f -size +1G`
* **Result:** Searches the entire root directory (`/`) for files larger than 1 Gigabyte.

## Finding Old Files

You can search for files that haven't been touched in a long time.

* **Command:** `find /home/user/Downloads -type f -mtime +90`
* **Result:** Finds all files in the Downloads folder that were modified more than 90 days ago.

## Executing Commands on Found Files

You can chain `find` with commands like `rm` to perform massive, automated cleanups. The `{}` acts as a placeholder for the found file's name, and `\;` tells the command where the execution ends.

* **Command:** `find . -name "*.bak" -type f -exec rm -v {} \;`
* **Result:** Finds every `.bak` file in the current directory tree and instantly deletes it, printing a verbose confirmation for each deletion.

# Summary

The `find` command is an absolute necessity for system administrators and power users. While its syntax is slightly more complex than basic file manipulation tools, mastering its tests (like size, type, and time) and actions (like `-exec`) grants you unparalleled control over querying and managing a Linux file system.

# Tags

* linux
* bash
* gnu
* command-line
* findutils
* terminal
* file-system
* searching
* find

# Hyperlinks

| Word in Document | Official Source |
| :--- | :--- |
| find | https://www.gnu.org/software/findutils/manual/html_node/find_html/index.html |
| GNU Findutils | https://www.gnu.org/software/findutils/ |
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ |
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/find.html |
| locate | https://www.gnu.org/software/findutils/manual/html_node/find_html/locate-Options.html |

# Mouse Over

| Word in Document | Mouse Over Information |
| :--- | :--- |
| arguments | Extra data, paths, or expressions provided to a command when it is run to dictate how it operates. |
| case-insensitive | A search method that treats uppercase and lowercase letters as identical (e.g., 'a' equals 'A'). |
| case-sensitive | A search method where uppercase and lowercase letters are treated as completely distinct characters. |
| chmod | Change Mode; a standard command used to change the access permissions of files and directories. |
| command-line | A text-based interface used to interact with a computer OS by typing commands. |
| cp | Copy; a command used to duplicate files and directories. |
| databases | Structured collections of data. The `locate` command uses a pre-built database of files for fast, but potentially outdated, searching. |
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. |
| execute | To run a program or script. In `find`, the `-exec` flag runs a secondary command on the search results. |
| expressions | The criteria, tests, and actions passed to the `find` command to filter and manipulate the search results. |
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. |
| flags | Options (usually preceded by a hyphen, like `-name`) passed to a command to modify its default behavior. |
| Gigabytes | A unit of digital information storage, equal to 1,024 Megabytes. |
| GNU | GNU's Not Unix; a massive collection of free software, including the core utilities that make up most Linux systems. |
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. |
| GNU Findutils | A specific package of GNU utilities dedicated strictly to searching for files (includes `find`, `locate`, and `xargs`). |
| Kilobytes | A unit of digital information storage, equal to 1,024 bytes. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| locate | A command-line utility that searches a pre-built database to find files instantly, unlike the live search of `find`. |
| ls | List; a command used to display the immediate contents of a specified directory. |
| Megabytes | A unit of digital information storage, equal to 1,024 Kilobytes. |
| modification time | A timestamp associated with a file that records the exact date and time its actual contents were last altered. |
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. |
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories nested within it. |
| rm | Remove; a standard command used to permanently delete files or directories. |
| root directory | The absolute highest level directory in a Unix/Linux file system, represented by a single forward slash (`/`). |
| shell | A computer program (like Bash) that exposes an operating system's services to a human user or other programs. |
| subfolders | Another term for subdirectories; folders that are placed inside of another parent folder. |
| system administrators | IT professionals responsible for installing, maintaining, and configuring computer systems and networks. |
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. |
| tests | The specific filters in the `find` command (like `-name` or `-size`) used to match file attributes. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. |
| wildcards | Special characters (like `*`) used in the command line to represent one or more other characters in a filename. |
| working directory | The directory in the file system that your terminal process is currently operating within. |