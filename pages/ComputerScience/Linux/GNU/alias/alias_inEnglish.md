# alias — Define or Display Command Aliases

The `alias` command creates, displays, or removes shortcuts for longer commands. It is a builtin command in Bash and most other Unix shells, meaning it runs inside the shell process itself rather than as a separate executable. Aliases are a simple way to save typing and to customize the shell's behavior.

# Overview

`alias` is one of the simplest customization tools available in a Unix shell. It lets you attach a short name to a longer command or command sequence, so you can type less and reduce mistakes. Aliases are widely used in interactive shells and in startup files such as `~/.bashrc`.

## What It Is

An alias is a name that the shell substitutes for a string before executing a command. When you type the alias name as the first word of a command line, the shell replaces it with the aliased text and then runs the result. The `alias` command itself is the builtin used to define, list, and manage these shortcuts.

## Why It Matters

Aliases improve productivity and consistency in interactive shell use. They let you:

- Shorten frequently used commands (`ll` for `ls -alF`)
- Add default options (`rm -i` to make `rm` interactive)
- Create memorable names for complex pipelines
- Enforce safer habits when running destructive commands

They are not a replacement for scripts or functions, but they are the lightest-weight customization available.

## Key Features

- Define shortcuts for commands and command sequences
- List currently defined aliases
- Remove aliases with `unalias`
- Persist across sessions via shell startup files
- Support quoting and escaping rules for complex values
- Expand only the first word of a command line

# How It Works

When the shell reads a command line, it checks whether the first word matches a defined alias. If it does, the shell replaces that word with the alias value and re-parses the line. This substitution happens before the command is executed.

## The Basic Flow

1. The shell reads a command line.
2. The shell checks the first word against the list of defined aliases.
3. If a match is found, the shell replaces the word with the alias value.
4. The shell re-parses the resulting command line.
5. The shell executes the expanded command.

## Important Details

Aliases are only expanded when the alias name appears as the first word of a command. They are not expanded inside arguments, variables, or after other words on the same line.

If an alias ends with a space, the shell also tries to expand the next word as an alias. This is useful for chaining aliases, but it can also cause confusion.

Aliases are not inherited by child shells or scripts unless they are defined in a startup file that the child shell reads. Aliases are also disabled in non-interactive shells by default, which means scripts do not see them.

To see how the shell will expand a command, use `type`:

    type ll

## A Simple Example

    alias ll='ls -alF'
    ll

The first line defines the alias. The second line is expanded by the shell to `ls -alF` before execution.

# Components

The `alias` mechanism involves a few shell features that work together. Understanding them makes aliases predictable.

## The Alias Table

Each shell instance maintains its own table of aliases. You can view the table with `alias` and modify it with `alias` or `unalias`. The table is not shared between shells.

## Shell Startup Files

Aliases are usually defined in a startup file so they persist across sessions. In Bash, the common files are:

- `~/.bashrc` for interactive non-login shells
- `~/.bash_profile` or `~/.profile` for login shells

## Quoting and Escaping

Because the shell parses the alias value, quoting matters. Single quotes are usually best for simple aliases. Double quotes allow variable expansion at definition time. Backslashes are needed to prevent alias expansion when you want to run the underlying command.

# Common Commands

The examples below cover the most frequent uses of `alias`.

## Basic Commands

| Command | Purpose |
| :--- | :--- |
| `alias` | List all defined aliases |
| `alias name='value'` | Define or redefine an alias |
| `alias name` | Show the value of a single alias |
| `unalias name` | Remove a single alias |
| `unalias -a` | Remove all aliases |
| `type name` | Show how the shell interprets a name |

## Advanced Commands

| Command | Purpose |
| :--- | :--- |
| `alias -p` | Print all aliases in a reusable format |
| `\command` | Bypass an alias for a single invocation |
| `command name` | Run the external command, ignoring aliases |
| `shopt -s expand_aliases` | Enable alias expansion in non-interactive shells |

# Examples

Practical, ready-to-use examples for the most common tasks.

## Scenario One

| Scenario | Command |
| :--- | :--- |
| Shorten `ls -alF` | `alias ll='ls -alF'` |
| Make `rm` interactive | `alias rm='rm -i'` |
| Make `cp` interactive | `alias cp='cp -i'` |
| Make `mv` interactive | `alias mv='mv -i'` |
| Colorize `grep` | `alias grep='grep --color=auto'` |

## Scenario Two

| Scenario | Command |
| :--- | :--- |
| Show one alias | `alias ll` |
| Remove one alias | `unalias ll` |
| Remove all aliases | `unalias -a` |
| List all aliases | `alias` |
| List aliases in reusable form | `alias -p` |

## Combined Workflows

| Scenario | Command |
| :--- | :--- |
| Define and use immediately | `alias ll='ls -alF' && ll` |
| Bypass an alias once | `\rm file.txt` |
| Bypass an alias with `command` | `command rm file.txt` |
| Persist an alias | `echo "alias ll='ls -alF'" >> ~/.bashrc` |
| Reload startup file | `source ~/.bashrc` |

# Configuration

Aliases are typically stored in shell startup files, not in a dedicated configuration file.

## Configuration Location

The most common location for interactive Bash aliases is:

    ~/.bashrc

For login shells, aliases may also be placed in:

    ~/.bash_profile
    ~/.profile

## Common Options

- `alias name='value'` — define or update an alias
- `unalias name` — remove an alias
- `unalias -a` — remove all aliases
- `alias -p` — display aliases in a form that can be re-sourced
- `shopt -s expand_aliases` — allow alias expansion in non-interactive shells

## Persisting Changes

To make an alias permanent, add it to your shell startup file:

    echo "alias ll='ls -alF'" >> ~/.bashrc
    source ~/.bashrc

# Comparisons

`alias` is often compared with shell functions and scripts.

## How It Differs

| Aspect | `alias` | Shell function |
| :--- | :--- | :--- |
| Core purpose | Simple text substitution | Reusable command with logic |
| Learning curve | Very simple | Moderate |
| Arguments | Not supported directly | Fully supported |
| Complexity | One line | Multiple lines, conditionals, loops |
| Scope | Interactive shells, first word only | Any shell context |

| Aspect | `alias` | Script |
| :--- | :--- | :--- |
| Core purpose | Shortcut in the current shell | Standalone program |
| Persistence | Only in the current shell | Runs in its own process |
| Arguments | Not supported | Fully supported |
| Distribution | Defined per user | Can be shared across systems |
| Overhead | None beyond parsing | Process startup cost |

## When to Choose Which

- Choose **`alias`** for short, simple substitutions in interactive shells.
- Choose a **shell function** when you need arguments, conditionals, or multiple commands.
- Choose a **script** when the logic should be reusable, versioned, and shared across systems.

# Best Practices

- Keep aliases short and memorable.
- Define aliases in `~/.bashrc` so they persist.
- Use single quotes around alias values to avoid premature expansion.
- Avoid overriding critical commands like `rm` without making them safer.
- Use `type` to confirm how a name is currently interpreted.
- Document your aliases with comments in your startup file.

# Common Pitfalls

## Expecting Arguments to Work

Aliases do not accept arguments. The shell substitutes text, so arguments are appended after the expanded command:

    alias ll='ls -alF'
    ll /tmp        # expands to: ls -alF /tmp

This works for simple cases but breaks when you need to place arguments in the middle of the alias.

## Defining an Alias in a Script

Aliases are disabled in non-interactive shells by default. Defining one in a script and expecting it to work usually fails unless you enable `expand_aliases`:

    shopt -s expand_aliases

## Recursive Aliases

If an alias refers to its own name, it can cause infinite recursion:

    alias ls='ls --color=auto'    # fine: refers to the external ls
    alias ls='ls ls'              # problematic

## Forgetting About Quotes

Unquoted alias values are parsed by the shell at definition time, which can lead to unexpected results:

    alias greet='echo hello world'    # fine
    alias greet=echo hello world      # wrong: defines greet=echo, then runs hello

## Assuming Aliases Apply Everywhere

Aliases are only expanded in interactive shells, only for the first word, and only after the shell has read the alias table. They do not apply inside scripts, subshells, or non-interactive contexts by default.

# Security

Aliases themselves are not a security mechanism, but they can influence behavior in ways that matter.

## General Advice

- Be careful when aliasing commands like `sudo`, `ssh`, or `rm`.
- Review startup files regularly to ensure aliases have not been added maliciously.
- Avoid aliases that hide the true behavior of a command.
- Use `command` or `\` to bypass aliases when you need predictable behavior.

## Specific Warnings

- Aliasing `rm` to something that silently deletes more than expected can cause data loss.
- Aliasing `sudo` to include options can weaken authentication or logging.
- Sourcing an untrusted file that defines aliases can change how your shell behaves.
- Aliases that shadow system commands may confuse users who expect standard behavior.

# Summary

`alias` is a shell builtin that defines, lists, and removes text substitutions for commands. It works by replacing the first word of a command line with the alias value before execution. Aliases are simple, fast, and ideal for interactive shortcuts, but they do not support arguments, are not inherited by scripts, and can be bypassed with `\` or `command`. They are best used for short, safe, and memorable customizations, and they should be defined in `~/.bashrc` to persist across sessions.

---

For related topics, see the sections on `unalias`, `type`, `command`, shell functions, and `~/.bashrc`.

# Tags

- alias
- shell-builtin
- customization
- bash
- linux
- documentation
- markdown