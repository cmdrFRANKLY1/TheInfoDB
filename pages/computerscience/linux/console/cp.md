# cp

The `cp` command stands for **Copy**. It is a fundamental command-line utility in Unix, Linux, and other Unix-like operating systems used to duplicate files and directories from one location to another within the file system.

# What cp Is

In a graphical user interface, copying a file is usually done by right-clicking or using keyboard shortcuts (like Ctrl+C and Ctrl+V). In the terminal, the `cp` command performs this same function. 

By default, `cp` takes at least two arguments: a **source** (the file you want to copy) and a **destination** (where you want the copy to go). If the destination is a directory, `cp` will place a copy of the source file inside that directory using its original name. If the destination is a file name, `cp` will create a duplicate file with that exact new name.

# Common Options

The `cp` command includes several powerful flags to help you manage complex directory structures, preserve file metadata, and prevent accidental data loss.

## `-r` or `-R` (Recursive)

By default, `cp` only copies standard files. If you try to copy a directory, the command will fail and throw an error. To copy a directory and absolutely everything inside it (all files and nested subdirectories), you must use the `-r` flag.

## `-i` (Interactive)

If you tell `cp` to copy a file to a destination where a file with the exact same name already exists, it will silently **overwrite** the existing file by default. The `-i` flag forces `cp` to become interactive, pausing to ask you for a "yes" or "no" confirmation before overwriting any existing files.

## `-v` (Verbose)

By default, a successful `cp` command operates completely silently. The `-v` flag makes the command verbose, meaning it will print a confirmation message to the terminal showing exactly what was copied to where.

## `-a` (Archive)

When you copy a file, the new duplicate gets a brand-new modification timestamp, and its ownership might change depending on who ran the command. The `-a` flag (which stands for archive) copies the files recursively *and* preserves all the original metadata, including exact timestamps, ownership, and file permissions.

# Practical Examples

Here are the most common ways you will use `cp` in the terminal to duplicate and back up your data.

## Basic File Duplication

This is the most common use case: creating a backup copy of a file in the same folder.

* **Command:** `cp config.json config.json.bak`
* **Result:** Creates a duplicate of `config.json` named `config.json.bak` in the current working directory.

## Copying a File to Another Directory

You can copy a file from your current location to an entirely different folder.

* **Command:** `cp report.pdf /home/user/Documents/`
* **Result:** Copies `report.pdf` into the `Documents` folder. The new file keeps the name `report.pdf`.

## Copying Multiple Files

You can pass multiple source files as arguments. The very last argument provided is always treated as the destination directory.

* **Command:** `cp script.js index.html style.css /var/www/html/`
* **Result:** Copies all three files simultaneously into the `/var/www/html/` directory.

## Copying an Entire Directory

To duplicate a folder and all of its contents, you must use the recursive flag.

* **Command:** `cp -r project_v1 project_v2`
* **Result:** Creates a new folder named `project_v2` and recursively copies every file and subdirectory from `project_v1` into it.

## Safe Copying

If you are moving files around and want to ensure you don't accidentally destroy existing data, combine the interactive and verbose flags.

* **Command:** `cp -iv new_notes.txt archive/notes.txt`
* **Result:** Attempts to copy the file. If `notes.txt` already exists in the archive folder, the terminal will prompt you (e.g., `cp: overwrite 'archive/notes.txt'?`). If you type `y`, it overwrites and prints a confirmation.

# Summary

The `cp` command is the absolute standard for data duplication in the Linux terminal. Whether you are quickly backing up a single configuration file or recursively cloning an enormous project directory using the `-r` flag, mastering `cp` is essential for safe and effective file system management.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* file-system
* copying
* cp

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| cp | https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cp.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data or filenames provided to a command when it is run to tell it what to operate on. | 
| backup | A copy of computer data taken and stored elsewhere so that it may be used to restore the original after a data loss event. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| cp | Copy; the core command used to duplicate files and directories in Unix-like systems. | 
| destination | The target location or filename where a duplicated file or directory will be placed. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. | 
| flags | Options (usually preceded by a hyphen, like `-r`) passed to a command to modify its default behavior. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| interactive | A command mode where the program pauses to prompt the user for input or confirmation before proceeding. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| metadata | Data that provides information about other data, such as a file's creation date, owner, or permissions. | 
| modification timestamp | A digital record associated with a file that indicates the exact date and time its contents were last altered. | 
| nested | An arrangement where items are placed inside other similar items (e.g., a subdirectory inside a directory). | 
| overwrite | To replace the existing data in a file with new data, permanently erasing the original contents. | 
| permissions | Access rights assigned to files and directories that dictate who can read, write, or execute them. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories within it. | 
| source | The original file or directory that you intend to duplicate. | 
| subdirectories | A directory that is contained within another parent directory. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. | 
| working directory | The directory in the file system that your terminal process is currently operating within. | 