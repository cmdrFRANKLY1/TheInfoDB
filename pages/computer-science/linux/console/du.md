# du

The `du` command stands for **Disk Usage**. It is a standard command-line utility in Unix, Linux, and other Unix-like operating systems used to estimate and summarize file and directory space consumption.

# What du Is

While the `df` command queries the operating system's file system tables to report instantaneous, volume-wide storage statistics, the `du` command actively crawls through directories to calculate the physical storage space occupied by specific files and folders.

When you need to figure out which directories are clogging up your hard drive, `du` is the primary tool for the job. By default, it recursively scans the current working directory and every nested subdirectory, printing a line-by-line itemization of block counts for each folder.

# Common Options

Because running a deep recursive scan of a massive directory can output an overwhelming amount of raw text, `du` includes several powerful flags to summarize and humanize its data.

## `-s` (Summary)

By default, `du` prints a separate line for every single file and subfolder in a directory tree. The `-s` (summary) flag suppresses this detailed itemization, outputting only a single, combined total size for the target directory as a whole.

## `-h` (Human-Readable)

Like many coreutils utilities, raw output is reported in 1024-byte blocks. The `-h` flag automatically converts these figures into easy-to-read units, scaling them to Kilobytes (K), Megabytes (M), Gigabytes (G), or Terabytes (T).

## `-a` (All Files)

By default, `du` only calculates and reports sizes for directories. The `-a` (all) flag forces the command to include individual non-directory files as well, giving you a complete accounting of every item in the tree.

## `-c` (Grand Total)

The `-c` flag appends a final "total" summary line at the very bottom of the output report, which is especially useful when calculating the combined size of multiple separate paths or files passed as arguments.

## `--max-depth=` (Depth Limit)

When scanning deep directory structures, you often don't want to see folders nested five levels down. The `--max-depth=N` flag allows you to restrict the report to a specific number of levels in the directory hierarchy.

# Practical Examples

Here are the most common ways you will use `du` in the terminal to investigate storage usage.

## Checking the Size of a Specific Directory

This is the standard way to inspect how much space a folder is consuming.

* **Command:** `du -sh /var/log/`

* **Result:** Outputs a single, human-readable summary line (e.g., `450M    /var/log/`) indicating the total size of the log directory.

## Listing Subfolder Sizes Sorted by Magnitude

Because `du` outputs sizes in the order directories are traversed, it is frequently piped into `sort` to find the largest space consumers.

* **Command:** `du -h --max-depth=1 /home/user/ | sort -hr`

* **Result:** Scans only the top-level contents of the home directory, displays them in human-readable formats, and sorts them from largest to smallest.

## Getting a Grand Total for Multiple Folders

You can check several directories at once and generate a cumulative sum.

* **Command:** `du -sch /var/log /var/tmp`

* **Result:** Prints individual human-readable sizes for both directories, followed by a final `total` row at the bottom.

## Finding Files Instead of Directories

Using the all-inclusive flag to spot large individual files within a directory tree.

* **Command:** `du -ah /etc/ | sort -hr | head -n 10`

* **Result:** Lists every file and folder in `/etc`, sorts them by size descending, and isolates the top 10 largest items.

# Summary

The `du` command is an indispensable diagnostic tool for tracking down storage bottlenecks and cleaning up file systems. Whether you are running a quick summary check with `du -sh`, limiting scan depths with `--max-depth`, or piping output into `sort` to locate bloated directories, mastering `du` ensures you maintain tight control over your storage capacity.

# Tags

* linux

* bash

* gnu

* command-line

* coreutils

* terminal

* disk-usage

* storage

* troubleshooting

* du

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| du | https://www.gnu.org/software/coreutils/manual/html_node/du-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/du.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data, paths, or flags provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| blocks | Fixed-size blocks of data storage (traditionally 1024 bytes in standard Unix commands). | 
| bottlenecks | Points of congestion in a system where hardware or software limitations slow down overall performance. | 
| command-line | A text-based interface used to interact with a computer operating system by typing commands. | 
| df | Disk Free; a core command used to display available and used storage space across mounted file systems. | 
| directories | The technical term for folders; organizational units in a file system used to store files and other directories. | 
| du | Disk Usage; a command used to estimate and display file space consumption for files and directories. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-h`) passed to a command to modify its default behavior. | 
| Gigabytes | A unit of digital information storage, equal to 1,024 Megabytes. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| hard drive | The primary non-volatile physical storage hardware component of a computer system. | 
| human-readable | Displaying measurements in easier-to-understand units like Megabytes or Gigabytes instead of raw bytes. | 
| Kilobytes | A unit of digital information storage, equal to 1,024 bytes. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| Megabytes | A unit of digital information storage, equal to 1,024 Kilobytes. | 
| nested | An arrangement where items are placed inside other similar items (e.g., a subdirectory inside a directory). | 
| pipe | A feature in Unix/Linux represented by the `|` character, used to pass the output of one command as input to another. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| recursive | An operation that applies to a directory and then seamlessly repeats itself for all subdirectories within it. | 
| sort | A command-line utility used to sort lines of text files or piped data streams alphabetically or numerically. | 
| storage space | The physical capacity of a drive available for holding files, applications, and operating systems. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| Terabytes | A unit of digital information storage, equal to 1,024 Gigabytes. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
