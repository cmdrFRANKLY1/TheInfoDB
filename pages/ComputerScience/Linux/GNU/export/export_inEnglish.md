# export

The `export` command marks shell variables for inclusion in the environment of child processes. It is a builtin command in Bash and most other Unix shells, meaning it runs inside the shell process itself rather than as a separate executable. Once a variable is exported, any program launched from that shell inherits it.

# Overview

`export` is the bridge between the shell's internal variables and the environment that external programs see. Without it, variables defined in the shell stay private to the shell. With it, those variables become part of the environment passed to every child process, including scripts, commands, and other shells.

## What It Is

A shell variable is a name that holds a value inside the shell. An environment variable is a variable that has been marked for export and is passed to child processes. The `export` command applies that mark. It does not create the variable by itself, though it can assign a value at the same time.

## Why It Matters

Many programs rely on environment variables for configuration. `PATH` determines where the shell looks for executables. `EDITOR` tells tools which editor to use. `LANG` and `LC_*` control locale and language behavior. `HOME`, `USER`, and `PWD` are used by countless programs. Without `export`, setting these variables in a shell would have no effect on the programs you run.

## Key Features

- Marks shell variables for export to child processes
- Can assign and export in a single statement
- Can remove the export attribute with `-n`
- Can export shell functions with `-f`
- Can display all exported variables with `-p`
- Works in every POSIX-compatible shell

# How It Works

When you run `export NAME=value`, the shell creates or updates the variable `NAME` and adds it to the list of variables that will be inherited by child processes. When a child process is launched, the shell copies the exported variables into the new process's environment.

## The Basic Flow

1. The shell reads the `export` command and its arguments.
2. For each argument of the form `NAME=value`, the shell assigns the value to the variable.
3. The shell marks the variable for export.
4. When a child process is launched, the shell passes the exported variables in its environment.
5. The child process reads the variables it needs from that environment.

## Important Details

`export NAME` without a value does not create a variable. It only marks an existing variable for export. If the variable does not exist, it is created as an empty exported variable in some shells.

`export NAME=value` both assigns and exports in one step. This is the most common form.

Once a variable is exported, its exported status persists until you remove it with `export -n NAME` or unset it entirely with `unset NAME`.

Exported variables are inherited by all child processes, including subshells, scripts, and external commands. Changes made to an exported variable in a child process do not affect the parent shell.

## A Simple Example

    export EDITOR=vim
    echo $EDITOR

The first line assigns `vim` to `EDITOR` and marks it for export. The second line prints the value. Any program launched after this inherits `EDITOR=vim`.

# Components

The `export` mechanism involves a few shell features that work together.

## Shell Variables vs Environment Variables

A shell variable lives only inside the shell. An environment variable is a shell variable that has been exported. The distinction matters because child processes only see exported variables.

## The Environment Block

Every process has an environment block — a list of `NAME=value` pairs passed to it at startup. `export` is what populates that block for child processes.

## The `env` Command

The `env` command displays or modifies the environment of a command. It is useful for inspecting what is currently exported:

    env | sort

## The `set` Command

The `set` command displays all shell variables, whether exported or not. Use `set` to see private variables and `env` to see exported ones.

# Common Commands

The examples below cover the most frequent uses of `export`.

## Basic Commands

| Command | Purpose |
| :--- | :--- |
| `export NAME=value` | Assign and export a variable |
| `export NAME` | Mark an existing variable for export |
| `export -p` | List all exported variables |
| `export -n NAME` | Remove the export attribute |
| `unset NAME` | Remove the variable entirely |
| `env` | Show the environment of child processes |

## Advanced Commands

| Command | Purpose |
| :--- | :--- |
| `export -f function_name` | Export a shell function |
| `export -p > env_backup.sh` | Save exported variables to a file |
| `export PATH="$PATH:/opt/bin"` | Append to `PATH` safely |
| `export -n NAME` | Keep the variable but stop exporting it |
| `env -i command` | Run a command with an empty environment |

# Examples

Practical, ready-to-use examples for the most common tasks.

## Scenario One

| Scenario | Command |
| :--- | :--- |
| Set the default editor | `export EDITOR=vim` |
| Set the default pager | `export PAGER=less` |
| Set the language | `export LANG=en_US.UTF-8` |
| Set the terminal type | `export TERM=xterm-256color` |
| Set a custom variable | `export APP_ENV=production` |

## Scenario Two

| Scenario | Command |
| :--- | :--- |
| Add a directory to `PATH` | `export PATH="$PATH:/opt/bin"` |
| Prepend a directory to `PATH` | `export PATH="/opt/bin:$PATH"` |
| Show all exported variables | `export -p` |
| Show the environment | `env` |
| Remove the export attribute | `export -n APP_ENV` |
| Unset a variable | `unset APP_ENV` |

## Combined Workflows

| Scenario | Command |
| :--- | :--- |
| Export and use immediately | `export EDITOR=vim && $EDITOR file.txt` |
| Persist an export | `echo 'export EDITOR=vim' >> ~/.bashrc` |
| Reload startup file | `source ~/.bashrc` |
| Run a command with a temporary variable | `EDITOR=nano command` |
| Run a command with a clean environment | `env -i /bin/bash` |
| Save exports to a file | `export -p > ~/env_backup.sh` |
| Restore exports from a file | `source ~/env_backup.sh` |

# Configuration

Exported variables are typically defined in shell startup files so they persist across sessions.

## Configuration Location

The most common locations for exported variables in Bash are:

    ~/.bashrc           # interactive non-login shells
    ~/.bash_profile     # login shells
    ~/.profile          # login shells (POSIX)
    /etc/environment    # system-wide, read by PAM
    /etc/profile        # system-wide login shells

## Common Options

- `export NAME=value` — assign and export
- `export -p` — list exported variables
- `export -n NAME` — remove the export attribute
- `export -f NAME` — export a shell function
- `export -fp` — list exported functions

## Persisting Changes

To make an export permanent, add it to your shell startup file:

    echo 'export EDITOR=vim' >> ~/.bashrc
    source ~/.bashrc

For system-wide settings, add the line to `/etc/environment` or `/etc/profile.d/` scripts.

# Comparisons

`export` is often compared with related commands and mechanisms.

## How It Differs

| Aspect | `export` | `set` |
| :--- | :--- | :--- |
| Core purpose | Mark variables for child processes | Display or set shell options and variables |
| Visibility | Child processes see the variable | Only the current shell sees it |
| Output | Exported variables only | All shell variables |
| Typical use | Configure environment | Debug shell state |

| Aspect | `export` | `env` |
| :--- | :--- | :--- |
| Core purpose | Mark a variable for export | Display or modify a command's environment |
| Scope | Affects the current shell and its children | Affects only the command it runs |
| Persistence | Persists in the shell | Temporary for one command |
| Typical use | Configure the shell session | Run a command with a custom environment |

| Aspect | `export` | Local variable |
| :--- | :--- | :--- |
| Inheritance | Passed to child processes | Not passed to child processes |
| Scope | Shell session and its children | Shell session only |
| Typical use | Configuration | Temporary values and loops |

## When to Choose Which

- Choose **`export`** when a child process needs to see the variable.
- Choose a **local variable** when the value is only needed inside the current shell.
- Choose **`env`** when you want to run a single command with a modified environment.
- Choose **`unset`** when you want to remove a variable entirely.

# Best Practices

- Export only what child processes actually need.
- Use `~/.bashrc` or `~/.profile` to persist exports.
- Quote values that contain spaces or special characters.
- Use `export PATH="$PATH:/new/dir"` to append safely.
- Avoid exporting secrets in shell startup files.
- Review exported variables periodically with `export -p` or `env`.
- Prefer lowercase names for private shell variables and uppercase for exported ones.

# Common Pitfalls

## Forgetting to Export

A variable set without `export` is not visible to child processes:

    EDITOR=vim
    some_program    # does not see EDITOR

    export EDITOR=vim
    some_program    # sees EDITOR

## Exporting After the Child Is Already Running

Exporting a variable affects only future child processes. A program that is already running does not see the new value.

## Overwriting `PATH` Instead of Appending

Setting `PATH` without including the previous value breaks command lookup:

    export PATH=/opt/bin        # wrong: loses /usr/bin, /bin, etc.
    export PATH="$PATH:/opt/bin" # correct

## Quoting Mistakes

Unquoted values with spaces or glob characters can be expanded unexpectedly:

    export GREETING="hello world"    # correct
    export GREETING=hello world      # wrong: assigns only "hello"

## Assuming Changes Propagate Upward

Exported variables flow from parent to child, never from child to parent. A script that exports a variable does not change the caller's environment.

## Leaking Secrets

Exporting passwords or tokens makes them visible to every child process and to tools like `ps e`:

    export API_KEY=secret    # visible to all child processes

# Security

`export` affects what every child process can see, so it has real security implications.

## General Advice

- Avoid exporting secrets; use files with restricted permissions or secret managers instead.
- Keep `PATH` clean and predictable; avoid exporting `.` or world-writable directories.
- Be cautious when sourcing untrusted scripts that contain `export` commands.
- Review `/etc/environment` and `/etc/profile.d/` regularly on shared systems.
- Use `env -i` to run untrusted commands with a minimal environment.

## Specific Warnings

- Exporting a modified `PATH` that includes a writable directory can lead to command hijacking.
- Exporting `LD_PRELOAD` or similar variables can inject code into child processes.
- Exported variables are visible in `/proc/<pid>/environ` to users with sufficient privileges.
- A malicious script sourced into your shell can export variables that alter future command behavior.

# Summary

`export` is a shell builtin that marks variables for inclusion in the environment of child processes. It can assign and export in one step, list exported variables with `-p`, and remove the export attribute with `-n`. Exported variables flow from parent to child, never the reverse, and are commonly defined in `~/.bashrc`, `~/.profile`, or system-wide files like `/etc/environment`. Used carelessly, exports can leak secrets, break `PATH`, or inject unsafe settings into every process you launch.

---

For related topics, see the sections on `env`, `set`, `unset`, `PATH`, and shell startup files.

# Tags

- export
- shell
- environment
- bash
- linux
- console
- terminal