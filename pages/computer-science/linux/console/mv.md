# mv

The `mv` command stands for **Move**. It is a fundamental command-line utility in Unix, Linux, and other Unix-like operating systems used to move files and directories from one location to another, as well as to rename them.

# What mv Is

Unlike the `cp` command, which duplicates a file and leaves the original intact, the `mv` command alters the file's location in the file system. When a move is complete, the original file no longer exists in its starting location.

Interestingly, `mv` serves a dual purpose. Because moving a file from `file.txt` to `new_file.txt` within the exact same folder is conceptually the same as changing its name, `mv` is the standard tool used to rename files and directories in the Linux terminal.

# Common Options

By default, `mv` is a silent command that will quickly execute your instructions. However, it includes several helpful flags to prevent you from accidentally destroying data.

## `-i` (Interactive)

If you attempt to move or rename a file to a destination where a file with that name already exists, `mv` will silently **overwrite** the existing file by default, permanently erasing it. The `-i` flag makes the command interactive, pausing to ask for a "y" (yes) or "n" (no) confirmation before it overwrites any data.

## `-n` (No Clobber)

If you are writing a script or moving a massive batch of files and want to guarantee that you absolutely never overwrite existing data, use the `-n` flag. "Clobber" is a Unix term for overwriting; this flag ensures `mv` will simply skip any files that would cause a conflict.

## `-f` (Force)

The `-f` flag tells `mv` to forcefully move the files and overwrite any existing destinations without ever prompting the user. This overrides any interactive aliases your system might have set up by default.

## `-v` (Verbose)

Because `mv` operates silently on success, you might want visual confirmation when moving large amounts of data. The `-v` flag makes the command verbose, printing a detailed log to the terminal of exactly what was moved or renamed.

# Practical Examples

Here are the most common ways you will use `mv` in the terminal to organize your file system.

## Renaming a File

If the source and destination are in the same directory, `mv` acts as a rename command.

* **Command:** `mv old_report.txt new_report.txt`
* **Result:** The file `old_report.txt` is renamed to `new_report.txt` in the current working directory.

## Moving a File to Another Directory

You can move a file to a completely different folder while keeping its current name.

* **Command:** `mv invoice.pdf /home/user/Documents/`
* **Result:** Moves `invoice.pdf` into the `Documents` folder. 

## Moving and Renaming Simultaneously

You can change the file's name and its location in a single command by providing a new filename at the destination path.

* **Command:** `mv script.js /var/www/html/app.js`
* **Result:** Moves `script.js` into the `html` folder and renames it to `app.js`.

## Moving Multiple Files

You can pass multiple source files as arguments. The very last argument provided must be an existing directory.

* **Command:** `mv index.html style.css script.js frontend/`
* **Result:** Moves all three files simultaneously into the `frontend` directory.

## Renaming a Directory

Just like files, you can rename entire folders. 

* **Command:** `mv project_v1 project_v2`
* **Result:** If `project_v2` does not already exist, the folder `project_v1` is simply renamed to `project_v2`. (Note: If `project_v2` *does* exist as a directory, `project_v1` will be moved *inside* of it).

# Summary

The `mv` command is a vital tool for structural organization within the Linux command-line interface. Whether you are correcting a typo in a single filename or migrating hundreds of files across different storage drives, `mv` provides the speed and flexibility required to manage your data effectively.

# Tags

* linux
* bash
* gnu
* command-line
* coreutils
* terminal
* file-system
* moving
* renaming
* mv

# Hyperlinks

| Word in Document | Official Source | 
| ----- | ----- | 
| mv | https://www.gnu.org/software/coreutils/manual/html_node/mv-invocation.html | 
| cp | https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/mv.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| aliases | Custom shortcuts defined in the shell that replace a simple command with a more complex one (e.g., aliasing `mv` to `mv -i`). | 
| arguments | Extra data or filenames provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| clobber | A traditional Unix term for overwriting or wiping out an existing file's contents. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| cp | Copy; a separate core command used to duplicate files, leaving the original intact. | 
| destination | The target location, directory, or filename where a moved file will be placed. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. | 
| flags | Options (usually preceded by a hyphen, like `-i`) passed to a command to modify its default behavior. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| interactive | A command mode where the program pauses to prompt the user for input or confirmation before proceeding. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| mv | Move; the core command used to move files and directories, or to rename them. | 
| overwrite | To replace the existing data in a file with new data, permanently erasing the original contents. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| rename | To change the name of a file or directory without altering its actual contents. | 
| script | A text file containing a sequence of commands intended to be executed automatically by the shell. | 
| source | The original file or directory that you intend to move or rename. | 
| storage drives | Hardware devices (like HDDs or SSDs) used to persistently store file system data. | 
| terminal | A program that provides a text-based window to interface with a shell. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. | 
| working directory | The directory in the file system that your terminal process is currently operating within. | 