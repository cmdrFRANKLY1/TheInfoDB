# cd — Change Directory

The `cd` command changes the current working directory of the shell. It is a builtin command in Bash and most other Unix shells, meaning it runs inside the shell process itself rather than as a separate executable. Because of this, its effect is local to the shell you are currently using.

# Overview

`cd` is one of the most frequently used commands in any Unix-like system. It defines how you move around the filesystem from the command line and is fundamental to almost every workflow, from navigating source trees to running scripts.

## What It Is

`cd` stands for "change directory." When you run it, the shell updates its internal notion of the current working directory, which is stored in the `$PWD` environment variable. All subsequent relative paths you use are resolved from this new location.

## Why It Matters

Every command that accepts a relative path depends on the current working directory. Without `cd`, you would have to type absolute paths constantly. It is the primary navigation tool for interactive shell use and a common building block inside scripts.

## Key Features

- Changes the current working directory of the shell
- Accepts absolute paths, relative paths, and shortcuts like `~` and `-`
- Supports a `CDPATH` search list for convenient jumping
- Can resolve or preserve symlinks with `-P` and `-L`
- Requires no external binary — it is a shell builtin

# How It Works

`cd` does not spawn a new process. Instead, it asks the shell itself to update the working directory of the current process. This is why the change persists after the command finishes.

## The Basic Flow

1. The shell reads the argument you pass to `cd`.
2. The shell checks whether the argument resolves to a valid directory.
3. The shell attempts to change its working directory using the underlying `chdir()` system call.
4. If successful, `$OLDPWD` is set to the previous directory and `$PWD` is updated.
5. If unsuccessful, the shell prints an error and the working directory stays unchanged.

## Important Details

If no argument is given, `cd` uses the value of `$HOME`. If the argument is `-`, it uses `$OLDPWD`, which is the directory you were in before the last successful `cd`. If `CDPATH` is set and the argument is a relative path, the shell searches each entry in `CDPATH` before falling back to the current directory.

Symbolic links matter here. With `-L` (the default), the shell keeps the logical path you typed. With `-P`, the shell resolves symlinks and stores the physical path instead.

## A Simple Example

    cd /var/log        # move to /var/log
    cd ..              # move up to /var
    cd -               # return to /var/log

# Components

`cd` interacts with several shell features and environment variables. Understanding these parts makes its behavior predictable.

## The Working Directory

The current working directory is a property of the shell process. It is inherited by child processes you launch from that shell, which is why `cd` in a script does not affect the shell that called the script.

## Environment Variables

Several variables influence or reflect `cd` behavior. `$HOME` provides the default target. `$OLDPWD` stores the previous directory. `$PWD` always reflects the current one. `$CDPATH` defines a search path for relative arguments.

## Shell Options

The options `-L`, `-P`, and `-e` control how paths are interpreted and whether errors are reported when the physical path cannot be determined.

# Common Commands

The examples below cover the most frequent uses of `cd`.

## Basic Commands

| Command | Purpose |
| :--- | :--- |
| `cd` | Go to the home directory |
| `cd ~` | Go to the home directory |
| `cd /` | Go to the root directory |
| `cd ..` | Go up one directory (parent) |
| `cd ../..` | Go up two directories |
| `cd -` | Go back to the previous directory |
| `cd /etc` | Go to an absolute path |
| `cd projects` | Go to a relative subdirectory |
| `cd "My Documents"` | Go to a directory with a space in its name |

## Advanced Commands

| Command | Purpose |
| :--- | :--- |
| `cd -P /usr/lib` | Resolve symlinks and use the physical path |
| `cd -L /usr/lib` | Keep the logical path (default behavior) |
| `cd -e -P /usr/lib` | With `-P`, error if the physical path cannot be determined |
| `CDPATH=.:~:/projects cd myapp` | Search `CDPATH` entries for the target |

# Examples

Practical, ready-to-use examples for the most common tasks.

## Scenario One

| Scenario | Command |
| :--- | :--- |
| Go home | `cd` |
| Go to a specific directory | `cd /var/log` |
| Go to a subdirectory | `cd projects/app` |
| Go up one level | `cd ..` |
| Go up two levels | `cd ../..` |

## Scenario Two

| Scenario | Command |
| :--- | :--- |
| Toggle between two directories | `cd /etc && cd /tmp && cd -` |
| Go to a directory with spaces | `cd "My Documents"` |
| Go to a directory with spaces (escaped) | `cd My\ Documents` |
| Go to another user's home | `cd ~alice` |

## Combined Workflows

| Scenario | Command |
| :--- | :--- |
| Change directory then list | `cd /etc && ls -la` |
| Change directory in a subshell | `(cd /tmp && ls)` |
| Change directory then run a script | `cd /opt/app && ./run.sh` |
| Save current dir, change, restore | `OLD=$PWD; cd /tmp; cd "$OLD"` |

# Configuration

`cd` has no configuration file of its own, but its behavior is shaped by shell variables and startup files.

## Configuration Location

Any settings that affect `cd` are typically placed in your shell startup file:

    ~/.bashrc

## Common Options

- `CDPATH` — colon-separated list of directories searched for relative arguments
- `HOME` — default target when no argument is given
- `OLDPWD` — previous directory, used by `cd -`
- `PWD` — current working directory, maintained by the shell
- `shopt -s cdable_vars` — allow `cd` to accept variable names as directories

## Persisting Changes

To make `CDPATH` permanent, add it to your shell startup file:

    echo 'export CDPATH=.:~:/projects' >> ~/.bashrc

# Comparisons

`cd` is often compared with related directory-navigation commands.

## How It Differs

| Aspect | `cd` | `pushd` / `popd` |
| :--- | :--- | :--- |
| Core purpose | Change directory | Manage a directory stack |
| Learning curve | Very simple | Slightly more complex |
| State | One current directory | A stack of directories |
| Undo | `cd -` (one step back) | `popd` (unlimited stack) |

| Aspect | `cd` | `cd` inside a script |
| :--- | :--- | :--- |
| Scope | Affects the current shell | Affects only the subshell |
| Persistence | Change survives after command | Change lost when script exits |

## When to Choose Which

- Choose **`cd`** when you simply need to move to another directory.
- Choose **`pushd` / `popd`** when you need to move between several directories and return in order.
- Choose **`cd` inside a subshell** when you want a temporary change that does not affect your main shell.

# Best Practices

- Prefer `cd` over `pushd` for simple one-step navigation.
- Quote paths that contain spaces: `cd "My Documents"`.
- Use `cd -` to toggle between two directories instead of retyping paths.
- Use `cd "$DIR" || exit` in scripts to fail safely.
- Avoid relying on `CDPATH` in scripts, since it can produce surprising results.

# Common Pitfalls

## Forgetting That `cd` in a Script Is Local

A `cd` inside a script changes the working directory only for that script's subshell. When the script exits, the calling shell returns to its original directory.

    # script.sh
    cd /tmp
    pwd        # prints /tmp

    # caller
    ./script.sh
    pwd        # prints the original directory, not /tmp

To change the caller's directory, source the script instead:

    source script.sh

## Using `cd` Without Checking for Failure

If `cd` fails, subsequent commands run in the wrong directory. Always guard against failure:

    cd /nonexistent || exit 1
    cd /nonexistent && rm -rf *    # dangerous if cd fails silently

## Ignoring Spaces in Paths

Unquoted paths with spaces are split into multiple arguments:

    cd My Documents      # wrong: tries to cd into "My" then "Documents"
    cd "My Documents"    # correct

## Assuming `cd -` Always Works

`cd -` depends on `$OLDPWD`. In a fresh shell, `$OLDPWD` may be unset, and `cd -` will fail.

# Security

`cd` itself has few security implications, but its misuse can lead to dangerous outcomes.

## General Advice

- Always quote variables used as `cd` arguments: `cd "$DIR"`.
- Check the exit status of `cd` before running destructive commands.
- Avoid `cd` into untrusted directories and then executing scripts from them.
- Be careful with `CDPATH` in scripts, as it can redirect navigation unexpectedly.

## Specific Warnings

- `cd /nonexistent && rm -rf *` is safe only because `&&` short-circuits. Using `;` instead can delete files in the wrong directory.
- Running `rm -rf *` after a failed `cd` in a sensitive directory (such as `$HOME`) can cause severe data loss.
- Sourcing an untrusted script that contains `cd` changes your current shell's directory.

# Summary

`cd` is a shell builtin that changes the current working directory of the running shell. It accepts absolute paths, relative paths, and shortcuts such as `~`, `..`, and `-`, and its behavior is influenced by variables like `$HOME`, `$OLDPWD`, `$PWD`, and `$CDPATH`. Because it is a builtin, its effect is limited to the current shell and is not inherited by the parent shell. Used carelessly in scripts, it can cause commands to run in unexpected locations, so guarding it with `|| exit` and quoting paths is essential.

---

For related topics, see the sections on `pwd`, `pushd`, `popd`, `dirs`, and `ls`.

# Tags

- cd
- shell
- bash
- linux
- console
- terminal
- navigation

