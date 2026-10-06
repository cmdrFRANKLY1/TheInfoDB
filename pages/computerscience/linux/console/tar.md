# tar

The `tar` command stands for **Tape Archive**. It is a standard and venerable command-line utility in Unix, Linux, and other Unix-like operating systems used to bundle multiple files and directories into a single archive file, commonly known as a **tarball**.

# What tar Is

When you need to back up a project directory, share a collection of files, or move data across a network, handling hundreds of individual files is cumbersome. 

The `tar` command solves this by taking multiple files and folders and combining them sequentially into one single file (an archive). While its original name dates back to the era of physical magnetic tape drives, today `tar` is universally used for archiving data on hard drives and solid-state storage.

Crucially, standard `tar` archives are strictly **uncompressed**—they just bundle things together. To save space, `tar` is almost always combined with compression utilities like gzip (`-z`) to create compressed archives (`.tar.gz` or `.tgz`).

# Common Flags and Modifiers

The `tar` command has a vast array of options. Unlike many modern utilities, `tar` historically allowed flags to be passed without hyphens, though standard hyphenated syntax is fully supported today.

## Mode Flags (Choose One)

* **`-c` (Create):** Creates a new archive from specified files or directories.

* **`-x` (Extract):** Extracts or unpacks the contents of an existing archive file.

* **`-t` (List):** Lists or displays the contents of an archive without actually extracting them.

## Modifier Flags

* **`-f` (File):** Specifies the filename of the archive you want to create or read. *(Note: The `-f` flag must almost always be placed last, right before the archive filename).*

* **`-v` (Verbose):** Makes the command verbose, printing a detailed list of every file as it is added to or extracted from the archive.

* **`-z` (Gzip Compression):** Filters the archive through gzip, compressing it when creating (`-czvf`) or decompressing it when extracting (`-xzvf`).

* **`-C` (Directory Change):** Changes the target directory before extracting or archiving files, allowing you to unpack contents directly into a specific folder.

# Practical Examples

Here are the most common ways you will use `tar` in the terminal to manage archives.

## Creating a Compressed Archive (Tarball)

This is the most common use case: bundling and compressing an entire directory.

* **Command:** `tar -czvf project_backup.tar.gz my_project/`

* **Result:** Recursively bundles and compresses the `my_project` folder into a single file named `project_backup.tar.gz`, verbosely listing every file as it is added.

## Extracting a Compressed Archive

To unpack a tarball into your current working directory.

* **Command:** `tar -xzvf project_backup.tar.gz`

* **Result:** Extracts all contents of the compressed archive into the current folder, showing a verbose file list.

## Extracting to a Specific Directory

If you want to unpack an archive into a different folder without navigating there first.

* **Command:** `tar -xzvf archive.tar.gz -C /var/www/html/`

* **Result:** Extracts the contents directly inside the `/var/www/html/` path.

## Listing Archive Contents Without Extracting

Useful when you want to inspect what is inside a tarball before unpacking it.

* **Command:** `tar -tzvf archive.tar.gz`

* **Result:** Prints a long-listing table of all files and folders contained within the archive.

## Creating an Uncompressed Archive

If you only want to bundle files without applying gzip compression.

* **Command:** `tar -cvf documents.tar docs/`

* **Result:** Creates an uncompressed archive named `documents.tar`.

# Summary

The `tar` command is an essential tool for system administration, software distribution, and backups in the Linux ecosystem. Whether you are creating compressed tarballs using `tar -czvf`, inspecting packages with `-tzvf`, or extracting files into specific directories with `-C`, mastering `tar` is vital for managing collections of files efficiently.

# Tags

* linux

* bash

* gnu

* command-line

* coreutils

* terminal

* archiving

* compression

* tarball

* tar

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| tar | https://www.gnu.org/software/tar/manual/tar.html | 
| GNU | https://www.gnu.org/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/tar.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| archiving | The process of collecting multiple files and directories into a single unified file for storage or transport. | 
| arguments | Extra data, filenames, or flags passed to a command when executed to dictate its behavior. | 
| backup | A copy of computer data taken and stored elsewhere so that it can be used to restore the original after a loss. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| command-line | A text-based interface used to interact with a computer OS by typing commands. | 
| compression | The process of encoding data using fewer bits than the original representation to save storage space. | 
| decompression | The process of reversing compression to restore an archive back to its original uncompressed file sizes. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other folders. | 
| extraction | The act of unpacking files and directories out of an archive file and restoring them to the file system. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve data. | 
| flags | Options (usually preceded by a hyphen, like `-z`) passed to a command to modify its default behavior. | 
| GNU | GNU's Not Unix; a massive collection of free software, including core system utilities. | 
| gzip | GNU zip; a popular software compression program used to shrink file sizes. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| magnetic tape | An older medium used for sequential data storage and physical backups. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories within it. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| storage space | The physical capacity of a drive available for holding files and applications. | 
| system administrators | IT professionals responsible for installing, maintaining, and configuring computer systems and networks. | 
| tar | Tape Archive; a command-line utility used to bundle multiple files and directories into a single archive. | 
| tarball | An informal name for a single archive file created by the `tar` command, often ending in `.tar` or `.tar.gz`. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| uncompressed | Data that has been archived or stored without applying any mathematical size-reduction algorithms. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| verbose | An option that forces a command to output detailed information about what it is doing, rather than operating silently. | 
| working directory | The directory in the file system that your terminal process is currently operating within. | 
