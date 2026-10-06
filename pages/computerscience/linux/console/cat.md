# cat

The `cat` command stands for **concatenate**. It is one of the most frequently used command-line utilities in Unix, Linux, and other Unix-like operating systems. While it is primarily used to read files sequentially and write them to standard output, its namesake comes from its ability to link multiple files together.

# What cat Is

If you want to quickly read the contents of a text file in your terminal without opening a dedicated text editor (like `nano` or `vim`), `cat` is usually the go-to tool. 

However, its true power lies in how it interacts with the shell's standard streams. By taking one or more files as input and pushing their contents to standard output (stdout), `cat` allows users to easily redirect that text into new files or pipe it into other text-processing commands (like `grep` or `awk`).

*Note: Because `cat` dumps the entire contents of a file to the screen all at once, it is best used for smaller files. For massive log files, pager programs like `less` or `tail` are much more efficient.*

# Common Options

By default, `cat` simply outputs raw text. However, it includes several flags to help format the output, which is especially useful when reviewing code or configuration files.

## `-n` (Number Lines)

The `-n` flag tells `cat` to number all output lines, starting from 1. This includes completely blank lines.

## `-b` (Number Non-Empty Lines)

If you want to number the lines but want the command to ignore and skip over blank lines, you use the `-b` flag instead. (Note: Using `-b` automatically overrides `-n`).

## `-E` (Show Ends)

Sometimes, text files have hidden trailing spaces at the ends of lines that can break scripts. The `-E` flag displays a `$` character at the exact end of every line, making hidden whitespace instantly visible.

## `-s` (Squeeze Blank)

If a file contains massive gaps of multiple blank lines, the `-s` flag will "squeeze" them, replacing multiple adjacent blank lines with a single blank line to make the output more readable.

# Practical Examples

Here are the most common ways you will use `cat` in the terminal to view and manipulate text.

## Viewing a Single File

This is the most basic and common usage.

* **Command:** `cat sysctl.conf`
* **Result:** Prints the entire contents of `sysctl.conf` to the terminal screen.

## Concatenating Multiple Files

You can pass multiple files as arguments. `cat` will read them in the exact order you list them and print them sequentially.

* **Command:** `cat file1.txt file2.txt file3.txt`
* **Result:** Prints the contents of `file1.txt`, immediately followed by `file2.txt`, and then `file3.txt`.

## Redirecting Output to a New File

Using the shell's `>` (redirect) operator, you can capture the output of `cat` and save it to a brand-new file.

* **Command:** `cat part1.md part2.md > full_document.md`
* **Result:** Combines the contents of both parts and saves them into a new file named `full_document.md`. (If `full_document.md` already existed, it is completely overwritten).

## Appending to an Existing File

Using the shell's `>>` (append) operator, you can add text to the very bottom of an existing file without deleting its current contents.

* **Command:** `cat new_entry.log >> master.log`
* **Result:** Takes the contents of `new_entry.log` and attaches them to the end of `master.log`.

## Creating a Quick File

You can use `cat` to quickly type out a file directly in the terminal without opening an editor.

* **Command:** `cat > notes.txt`
* **Result:** The terminal will wait for you to type. You can type multiple lines of text. When you are finished, press `Ctrl+D` (which sends an EOF or End-Of-File signal) to save the text into `notes.txt`.

# Summary

The `cat` command is a foundational text-processing tool in the Linux ecosystem. Whether you are quickly glancing at a configuration file, combining downloaded file chunks, or piping raw text into a larger automated script, `cat` provides a simple, universal way to move data from the hard drive onto the standard output stream.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* text-processing
* file-system
* cat

# Hyperlinks

| Word in Document | Official Source Hyperlink |
| :--- | :--- |
| cat | https://www.gnu.org/software/coreutils/manual/html_node/cat-invocation.html |
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ |
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cat.html |
| Linux | https://www.kernel.org/ |
| bash | https://www.gnu.org/software/bash/manual/ |

# Mouse Over Information

| Word in Document | Mouse Over Information |
| :--- | :--- |
| append | To add new data to the very end of an existing file without modifying or deleting the original contents. |
| arguments | Extra data or filenames provided to a command when it is run to tell it what to operate on. |
| awk | A powerful programming language and command-line utility used for text processing and data extraction. |
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. |
| command-line | A text-based interface used to interact with a computer OS by typing commands. |
| concatenate | To link things together in a chain or series. In computing, it means joining multiple files end-to-end. |
| configuration file | A local file used to configure the parameters, options, and initial settings for a computer program. |
| EOF | End-Of-File; a condition in a computer operating system where no more data can be read from a data source. |
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. |
| flags | Options (usually preceded by a hyphen, like `-n`) passed to a command to modify its default behavior. |
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. |
| grep | Global Regular Expression Print; a command used to search text for lines matching a specific pattern. |
| hard drive | The primary hardware component of a computer used for persistent data storage. |
| less | A command-line pager program used to view the contents of a text file one screen at a time. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| log files | Files that record either events that occur in an operating system or other software runs, or messages between different users of a communication software. |
| nano | A simple, user-friendly command-line text editor typically included in most Linux distributions. |
| overwrite | To replace the existing data in a file with new data, permanently erasing the original contents. |
| pager programs | Utilities (like `less` or `more`) that allow users to view text that is too long to fit on a single screen, one page at a time. |
| pipe | A feature in Unix/Linux represented by the `|` character, used to pass the output of one command directly as input to another. |
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. |
| redirect | A shell feature (using `<` or `>`) that changes the standard input or output destination of a command. |
| scripts | Text files containing a sequence of commands intended to be executed automatically by the shell. |
| sequentially | Processing or reading items strictly in order, one immediately after the other. |
| shell | A computer program that exposes an operating system's services to a human user or other programs. |
| standard output | Often abbreviated as `stdout`; the default data stream where a program writes its normal output data (usually the terminal screen). |
| standard streams | Preconnected input and output communication channels between a computer program and its environment (stdin, stdout, stderr). |
| stdout | Shorthand for standard output. |
| tail | A command that outputs the last part (default 10 lines) of a file; often used to monitor logs. |
| terminal | A program that provides a text-based window to interface with a shell. |
| text editor | A type of computer program that edits plain text files. |
| text-processing | The automated manipulation of electronic text by computer commands or scripts. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
| vim | Vi IMproved; a highly configurable, highly efficient command-line text editor built to enable efficient text editing. |
| whitespace | Any character or series of characters that represent horizontal or vertical space in typography (spaces, tabs, line breaks). |