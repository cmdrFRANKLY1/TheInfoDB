# awk

The `awk` command is a powerful pattern scanning and text processing language built into Unix, Linux, and other Unix-like operating systems. It is named after its creators—Alfred Aho, Peter Weinberger, and Brian Kernighan—and is widely considered an essential tool for parsing structured, column-based data streams.

# What awk Is

While tools like `grep` are designed to find lines matching a specific pattern, and `cut` or `head` deal with slicing data, `awk` operates as a complete, lightweight programming language dedicated entirely to text extraction and manipulation.

When processing a file or a piped stream, `awk` automatically breaks each line down into individual **fields** based on a delimiter (which defaults to any whitespace, like spaces or tabs). You can then write concise rules to perform calculations, filter rows, or print specific columns.

# Core Concepts and Syntax

The basic syntax of an `awk` command follows a pattern-action structure: `awk 'pattern { action }' filename`. 

If a pattern matches a line, the specified block of code inside the curly braces is executed. If you omit the pattern, the action runs on *every single line* of the input data.

## Built-In Variables

`awk` provides several built-in variables that give you immediate insight into the text structure:

* `$0`: Represents the entire current line of text.

* `$1`, `$2`, `$3` ...: Represents individual fields (columns) within the current line.

* `NR`: The "Number of Record" (tracks the current line number).

* `NF`: The "Number of Fields" (tracks how many columns are in the current line).

* `FS`: The "Field Separator" (defaults to whitespace, but can be customized with `-F`).

# Common Options

While much of `awk`'s configuration happens inside its script blocks, it supports several useful command-line flags.

## `-F` (Field Separator)

By default, `awk` splits columns by any whitespace. The `-F` flag allows you to define a custom separator, such as a comma for CSV files or a colon for system files like `/etc/passwd`.

## `-v` (Assign Variable)

The `-v` flag allows you to assign a value to an `awk` variable before the script begins executing, making it easy to pass external shell variables into your text processor.

# Practical Examples

Here are the most common ways you will use `awk` in the terminal to extract and process data.

## Printing Specific Columns

This is the most common use case: extracting particular columns from a structured text file or command output.

* **Command:** `awk '{print $1, $3}' access.log`

* **Result:** Reads `access.log` and prints only the first and third columns of every line.

## Using a Custom Field Separator

When working with system files like `/etc/passwd`, fields are delimited by colons (`:`).

* **Command:** `awk -F: '{print $1}' /etc/passwd`

* **Result:** Sets the field separator to a colon (`-F:`) and prints only the first column (`$1`), which is the username of every account on the system.

## Conditional Filtering

You can apply conditional statements to filter rows based on numerical or string values in specific columns.

* **Command:** `awk '$5 > 100 {print $1, $5}' storage_report.txt`

* **Result:** Scans the fifth column of the file and prints the first and fifth columns only for lines where the value in column 5 is greater than 100.

## Using Line Numbers (`NR`)

You can combine built-in variables to perform targeted extractions.

* **Command:** `awk 'NR >= 2 && NR <= 10 {print $0}' data.csv`

* **Result:** Prints all lines from row 2 through row 10, effectively skipping a header row and truncating the output.

# Summary

The `awk` command is an absolute powerhouse for data manipulation in the Linux command line. Whether you are extracting IP addresses from web logs, filtering columns in a CSV file, or writing custom text-processing logic, mastering `awk` saves hours of manual data entry and scripting effort.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* text-processing
* awk
* data-extraction
* scripting

# Hyperlinks

| Word in Document | Official Source Hyperlink |
| ----- | ----- |
| awk | https://www.gnu.org/software/gawk/manual/gawk.html |
| GNU | https://www.gnu.org/ |
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/awk.html |
| Linux | https://www.kernel.org/ |

# Mouse Over Information

| Word in Document | Mouse Over Information |
| ----- | ----- |
| action | The block of code enclosed in curly braces that `awk` executes when a pattern matches a line. |
| arguments | Extra data, filenames, or scripts provided to a command when it is run to tell it what to operate on. |
| awk | A powerful programming language and command-line utility used for text processing and data extraction. |
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. |
| columns | Vertical data divisions in a structured text file or table, referenced in `awk` as fields (e.g., $1, $2). |
| command-line | A text-based interface used to interact with a computer operating system by typing commands. |
| CSV file | Comma-Separated Values; a plain text file format used to store tabular data. |
| delimiter | A character or sequence of characters used to specify the boundary between separate regions in data. |
| fields | The individual columns or data tokens extracted from a text line by `awk` (represented by $1, $2, etc.). |
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. |
| flags | Options (usually preceded by a hyphen, like `-F`) passed to a command to modify its default behavior. |
| GNU | GNU's Not Unix; a massive collection of free software, including utilities like `awk`. |
| grep | Global Regular Expression Print; a command used to search text for lines matching a specific pattern. |
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. |
| NF | Number of Fields; a built-in `awk` variable that tracks the total number of columns in the current record. |
| NR | Number of Record; a built-in `awk` variable that tracks the current line number being processed. |
| pattern | A condition or regular expression used by `awk` to determine whether to execute an action block. |
| pipe | A feature in Unix/Linux represented by the `|` character, used to pass the output of one command as input to another. |
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. |
| record | In `awk`, a single line of input data being evaluated (referenced as `$0`). |
| regular expression | A sequence of characters that specifies a search pattern, used extensively in text processing. |
| script | A text file containing a sequence of commands intended to be executed automatically by a program or shell. |
| shell | A computer program that exposes an operating system's services to a human user or other programs. |
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. |
| text-processing | The automated manipulation of electronic text by computer commands or scripts. |
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. |
| whitespace | Any character or series of characters that represent horizontal or vertical space (spaces, tabs, newlines). |
