# sed

The `sed` command stands for **Stream Editor**. It is a powerful and standard text-processing utility in Unix, Linux, and other Unix-like operating systems used to perform basic text transformations on an input stream (a file or text piped from another command).

# What sed Is

While an interactive text editor requires you to open a file, scroll around, and manually change text, `sed` works non-interactively and automatically. It reads text line by line from an input source, applies a set of instructions or scripts to it, and outputs the modified result to the standard output.

Because it can process massive files instantaneously and be scripted easily into automation pipelines, `sed` is the ultimate tool for batch-editing text, global find-and-replace operations, and stripping unwanted lines from logs.

# Common Options

While much of `sed`'s power comes from its instruction syntax, several critical command-line flags control how it handles files and streams.

## `-e` (Expression)

The `-e` flag allows you to explicitly pass multiple editing scripts or commands to be executed on the input stream sequentially. 

## `-f` (File)

Instead of typing long script arguments directly into the terminal, the `-f` flag tells `sed` to read its instructions from a dedicated text file containing a list of editing commands.

## `-i` (In-Place Editing)

By default, `sed` prints its modified results to the standard output screen, leaving the original source file completely untouched. The `-i` flag forces `sed` to overwrite the original file *in-place* with the modified changes. *(Warning: Always make backups or use `-i.bak` to create a safety copy before modifying vital configuration files!)*

## `-n` (Quiet / Silent)

By default, `sed` automatically prints every line of text it processes after executing its script. The `-n` flag suppresses this automatic printing, allowing you to use specific print commands (like `p`) to output only the lines you explicitly choose.

# The Substitute Command (`s`)

The single most common use case for `sed` is the substitute command, structured as `s/regexp/replacement/flags`. 

* **`s`**: Tells `sed` to substitute.
* **`regexp`**: The pattern or string you want to find.
* **`replacement`**: What you want to replace it with.
* **`flags`**: Modifiers that change how the substitution behaves (such as `g` for global).

## The Global Flag (`g`)

By default, `sed` only replaces the **first** occurrence of a pattern on any given line. If you want it to replace every single match across the entire line, you must append the global (`g`) flag to the end of the substitution block.

# Practical Examples

Here are the most common ways you will use `sed` in the terminal to manipulate text streams.

## Basic Substitution (Printing to Screen)

This searches for the first occurrence of a word on each line and replaces it, printing the result to the terminal.

* **Command:** `sed 's/localhost/127.0.0.1/' config.txt`

* **Result:** Replaces the first instance of "localhost" with "127.0.0.1" on every line of `config.txt` and prints the output.

## Global Substitution

To replace every single occurrence on a line, use the global flag.

* **Command:** `sed 's/old_name/new_name/g' script.js`

* **Result:** Replaces every instance of "old_name" with "new_name" across all lines of the file.

## In-Place Editing with a Backup

Safely modifying a file while keeping an automatic backup of the original version.

* **Command:** `sed -i.bak 's/DEBUG=true/DEBUG=false/g' .env`

* **Result:** Updates the `.env` file in-place, changing all instances of `DEBUG=true` to `DEBUG=false`, while saving a pristine original copy named `.env.bak`.

## Deleting Specific Lines

You can use line numbers to filter out lines you don't want to see.

* **Command:** `sed '3d' document.txt`

* **Result:** Prints the entire contents of `document.txt` to the screen *except* for the 3rd line.

## Deleting Line Ranges

You can target a block of lines for deletion.

* **Command:** `sed '1,10d' large_log.txt`

* **Result:** Deletes lines 1 through 10 from the output stream.

# Summary

The `sed` command is an indispensable stream-editing tool for Linux developers and system administrators. Whether you are running a quick global search-and-replace across a codebase using `s/.../.../g`, safely updating configurations with `-i`, or filtering text streams inside a pipeline, mastering `sed` saves immense amounts of time.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* text-processing
* stream-editor
* sed
* find-and-replace

# Hyperlinks

| Word in Document | Official Source Hyperlink |
| ----- | ----- |
| sed | https://www.gnu.org/software/sed/manual/sed.html |
| GNU | https://www.gnu.org/ |
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html |
| Linux | https://www.kernel.org/ |

# Mouse Over Information

| Word in Document | Mouse Over Information |
| ----- | ----- |
| automation | The technique of making an apparatus, a process, or a system operate automatically without human intervention. |
| backup | A copy of computer data taken and stored elsewhere so that it may be used to restore the original after a data loss event. |
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. |
| batch-editing | The automated modification of multiple files or text datasets in a single execution step. |
| codebase | The complete collection of source code used to build a particular software program or application. |
| command-line | A text-based interface used to interact with a computer OS by typing commands. |
| configuration file | A local file used to configure the parameters, options, and initial settings for a computer program. |
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. |
| flags | Options (usually preceded by a hyphen, like `-i`) passed to a command to modify its default behavior. |
| GNU | GNU's Not Unix; a massive collection of free software, including utilities like `sed`. |
| in-place | A modification method where changes are written directly back into the original source file rather than a new file. |
| input stream | A sequence of data characters or bytes read by a program from a keyboard, file, or pipe. |
| interactive | A program environment that remains open and accepts continuous keyboard input from the user. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| log file | A file that records events that occur in an operating system or software execution, vital for debugging. |
| non-interactively | Operating automatically from start to finish without pausing to prompt the user for keyboard input. |
| output stream | The destination channel where a program writes its generated text or data results. |
| pipe | A feature in Unix/Linux represented by the `|` character, used to pass the output of one command as input to another. |
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. |
| prompt | A message displayed by the terminal indicating that the shell is ready to accept a new command. |
| regular expression | A sequence of characters that specifies a search pattern, used extensively in text processing. |
| script | A text file containing a sequence of commands intended to be executed automatically by a program or shell. |
| sed | Stream Editor; a powerful text processing tool used for filtering, transforming, and finding/replacing text. |
| shell | A computer program that exposes an operating system's services to a human user or other programs. |
| standard output | Often abbreviated as `stdout`; the default data stream where a program writes its normal output data. |
| substitute | To replace one element, string, or pattern with another. |
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. |
| text-processing | The automated manipulation of electronic text by computer commands or scripts. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
