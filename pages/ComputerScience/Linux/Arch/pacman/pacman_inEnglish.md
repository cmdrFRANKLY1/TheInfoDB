# pacman
pacman is the package manager for Arch Linux. It tracks installed packages with dependency support, handles package groups, and synchronizes with remote repositories to install, update, and remove software. It was created by Judd Vinet and first released in 2002, and it remains the core tool for managing software on Arch-based systems.


# What pacman Is

pacman is a library-based package manager written in C. It uses a simple binary package format and maintains a text-based package database that can be hand-edited if necessary. It is designed to be fast, simple, and lightweight.


## Package Manager

A package is an archive containing the compiled files of an application, its metadata (name, version, dependencies), and installation directives used by pacman. pacman installs, upgrades, and removes these packages, handling dependencies automatically.

## libalpm Backend

Since version 3.0, pacman has been split into two parts: a backend library called libalpm (Arch Linux Package Management) and the pacman front-end. This separation makes it easier for other tools to use the same package management logic.

## Repository Model

pacman synchronizes with master servers to keep the system up to date. This server-client model resolves dependencies and downloads packages with simple commands.

# Why Use pacman

pacman provides a consistent, scriptable interface for all package operations on Arch Linux.

## Dependency Resolution

pacman handles dependencies automatically. You specify the program you want, and pacman installs it along with any required dependencies.

## Clean Uninstallation

pacman keeps a list of every file owned by a package. When you remove a package, nothing is left behind accidentally. Configuration files that you have modified are preserved with a `.pacsave` extension.

## Simple Updates

pacman updates existing packages as soon as updates become available, keeping the system current with a single command.

# Installation

pacman is pre-installed on Arch Linux and its derivatives. No additional installation is required.

## Verify Installation

Check the version:

    pacman --version

## Included Tools

The pacman package includes tools like `makepkg` and `vercmp`. Additional useful tools like `pactree` and `checkupdates` are in the `pacman-contrib` package.

# Common Commands

pacman uses operation flags with options. The most frequently used commands are listed below.

## Search

| Command | Purpose |
| :--- | :--- |
| `pacman -Ss <term>` | Search repositories for a package |
| `pacman -Qs <term>` | Search locally installed packages |

## Install

| Command | Purpose |
| :--- | :--- |
| `pacman -S <package>` | Install a package |
| `pacman -Syu <package>` | Update the system and install a package |
| `pacman -S --needed <package>` | Skip reinstalling up-to-date packages |

## Update

| Command | Purpose |
| :--- | :--- |
| `pacman -Sy` | Refresh the package database |
| `pacman -Syu` | Update the database and upgrade all packages |
| `pacman -Qu` | List all outdated packages |

## Remove

| Command | Purpose |
| :--- | :--- |
| `pacman -R <package>` | Remove a package |
| `pacman -Rs <package>` | Remove a package and its unneeded dependencies |
| `pacman -Rns <package>` | Remove a package, dependencies, and config files |

## Query

| Command | Purpose |
| :--- | :--- |
| `pacman -Q` | List all installed packages |
| `pacman -Qe` | List explicitly installed packages |
| `pacman -Qm` | List foreign packages (e.g. from AUR) |
| `pacman -Qtdq` | List orphan packages |

# Examples

Practical, copy-paste-ready examples for the most common tasks.

## Installing a Package

| Scenario | Command |
| :--- | :--- |
| Install a single package | `sudo pacman -S firefox` |
| Install multiple packages | `sudo pacman -S firefox vlc htop` |
| Install without prompts | `sudo pacman -S --noconfirm firefox` |
| Install from a specific repo | `sudo pacman -S extra/firefox` |
| Install a package group | `sudo pacman -S gnome` |
| Install via pattern expansion | `sudo pacman -S plasma-{desktop,mediacenter,nm}` |

## Searching for Packages

| Scenario | Command |
| :--- | :--- |
| Search for a package | `pacman -Ss lynis` |
| Search with a regular expression | `pacman -Ss "lyn*"` |
| Search installed packages | `pacman -Qs python` |
| Search for packages containing a file | `pacman -F lynis` |

## Updating the System

| Scenario | Command |
| :--- | :--- |
| Full system upgrade | `sudo pacman -Syu` |
| Refresh database only | `sudo pacman -Sy` |
| List outdated packages | `pacman -Qu` |
| Update without prompts | `sudo pacman -Syu --noconfirm` |

## Removing Packages

| Scenario | Command |
| :--- | :--- |
| Remove a package | `sudo pacman -R lynis` |
| Remove package and dependencies | `sudo pacman -Rs lynis` |
| Remove package, deps, and config | `sudo pacman -Rns lynis` |
| Remove orphan packages | `sudo pacman -Rns $(pacman -Qtdq)` |

## Querying Installed Packages

| Scenario | Command |
| :--- | :--- |
| List all installed packages | `pacman -Q` |
| List explicitly installed | `pacman -Qe` |
| List foreign packages | `pacman -Qm` |
| Show package info | `pacman -Qi firefox` |
| List files owned by a package | `pacman -Ql firefox` |
| Find which package owns a file | `pacman -Qo /usr/bin/firefox` |

## Cleaning Up

| Scenario | Command |
| :--- | :--- |
| Clear the package cache | `sudo pacman -Scc` |
| Remove orphan packages | `sudo pacman -Rns $(pacman -Qtdq)` |
| List orphan packages | `pacman -Qtdq` |

## File Operations

| Scenario | Command |
| :--- | :--- |
| Search for files in packages | `sudo pacman -Fy lynis` |
| Search with a regex | `sudo pacman -Fxy lyni` |
| List files in a package file | `pacman -Qlp /path/to/package.pkg.tar.zst` |

## Common Workflows

| Scenario | Command |
| :--- | :--- |
| Update system and remove orphans | `sudo pacman -Syu && sudo pacman -Rns $(pacman -Qtdq)` |
| Install and skip reinstalls | `sudo pacman -S --needed firefox` |
| Find which package owns a file | `pacman -Qo /usr/bin/lynis` |

# Configuration

pacman reads its configuration from `/etc/pacman.conf`. This file controls repositories, cache directories, and behavior options.

## Configuration Location

    /etc/pacman.conf

## Common Options

- `CacheDir` — directory where downloaded packages are stored (default: `/var/cache/pacman/pkg/`)
- `ParallelDownloads` — number of concurrent downloads (e.g. `ParallelDownloads = 5`)
- `SigLevel` — package signature verification level
- `Color` — enable colored output

## Mirror List

The mirror list is stored at `/etc/pacman.d/mirrorlist`. Keep it up to date for faster downloads. The `reflector` tool can generate an optimized list.

# Safety and the AUR

pacman is the official package manager for Arch Linux. It does not directly install packages from the Arch User Repository (AUR) — that requires an AUR helper like `yay` or manual builds with `makepkg`.

## Partial Upgrade Warning

Never run `pacman -Sy` followed by `pacman -S <package>` without the `-u` flag. This can cause partial upgrades, which are unsupported and can break your system. Always use `pacman -Syu` to upgrade the full system.

## AUR Packages

AUR packages are user-maintained and not vetted by Arch developers. Review PKGBUILDs before building. Tools like `yay` and `paru` provide AUR support.

## Package Signing

pacman supports package signatures. The default `SigLevel = Required DatabaseOptional` verifies signatures for all packages in official repositories.

# pacman vs Other Tools

| Feature | pacman | AUR Helpers (yay, paru) |
| :--- | :--- | :--- |
| Official repos | Yes | Yes (wraps pacman) |
| AUR packages | No | Yes |
| Build from source | No | Yes (via makepkg) |
| Learning curve | Low | Low (mirrors pacman flags) |

# Summary

pacman is the core package manager for Arch Linux. It installs, updates, queries, and removes packages with automatic dependency resolution and clean uninstallation. It is fast, scriptable, and the foundation on which AUR helpers are built. Always run full system upgrades with `pacman -Syu`, and never install a package without also upgrading the system.

---

For AUR package management, see the section on `yay`. For other terminal tools, see the sections on `grep`, `chmod`, and `cd`.

# Tags

- linux
- arch-linux
- pacman
- package-management
- package-manager
- command-line
- terminal
