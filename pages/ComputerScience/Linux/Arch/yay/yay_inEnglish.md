# yay

Yay (Yet Another Yogurt) is an AUR helper written in Go. It wraps around `pacman` and adds access to the Arch User Repository (AUR), allowing you to install, search, and manage packages from both the official repositories and the AUR with a single tool.

# What yay Is

Yay is an AUR helper — a tool that automates the process of downloading PKGBUILDs from the AUR, resolving dependencies, and building packages with `makepkg`. It also acts as a wrapper around `pacman`, so you can use it for all your normal package management tasks without switching between the two tools.

## AUR Helper

The Arch User Repository is a community-maintained collection of PKGBUILD files. Yay automates building and installing packages from it, handling the manual steps of cloning, dependency resolution, and `makepkg` invocation.

## pacman Wrapper

Yay passes most commands through to `pacman` with the same flags. For example, `yay -Syu` updates your system just like `pacman -Syu`, but also checks the AUR for updates.

## Written in Go

Yay is a compiled Go binary with no runtime dependencies beyond what `pacman` already provides.

# Why Use yay

Yay simplifies AUR usage and provides a consistent interface for both official and community packages.

## Single Tool for Everything

Instead of using `pacman` for official packages and manually building AUR packages, you can use `yay` for both. Its flags mirror `pacman`'s, so there's no new syntax to learn.

## Dependency Resolution

Yay resolves dependencies ahead of time, including AUR dependencies, and can remove make-only dependencies after building.

## Human-Friendly Output

Yay provides more verbose and readable output than raw `pacman`, making it easier to see what's happening during installs and updates.

## AUR Tab Completion

Yay includes shell completions for AUR package names, speeding up command entry.

# Installation

Yay is not available in the official Arch repositories. It must be built from the AUR, or installed via a helper if you already have one.

## Prerequisites

Install the build tools and Git:

    sudo pacman -S --needed base-devel git

## Build from Source

Clone the yay repository and build it with `makepkg`:

    git clone https://aur.archlinux.org/yay.git
    cd yay
    makepkg -si

The `-si` flags tell `makepkg` to resolve dependencies (`-s`) and install the built package (`-i`).

## Binary Package

If you prefer a pre-built binary instead of compiling, use `yay-bin`:

    git clone https://aur.archlinux.org/yay-bin.git
    cd yay-bin
    makepkg -si

## Verify Installation

Check the version:

    yay --version

## Distribution Packages

Some Arch-based distributions (Manjaro, EndeavourOS) package `yay` themselves and it may be installable directly with `pacman -S yay`. Check your distribution's repositories.

# Common Commands

Yay's command flags mirror `pacman`'s. The tables below cover the most frequently used operations.

## Search

| Command | Purpose |
| :--- | :--- |
| `yay <term>` | Interactive search across repos and AUR |
| `yay -Ss <term>` | Search both repositories and AUR |
| `yay -Ss <term1> <term2>` | Narrow search (search term1, then term2 within results) |

## Install

| Command | Purpose |
| :--- | :--- |
| `yay -S <package>` | Install from repos or AUR |
| `yay -S --noconfirm <package>` | Install without prompts |
| `yay -G <package>` | Download PKGBUILD only (no build) |
| `yay -Gp <package>` | Print PKGBUILD to stdout |

## Update

| Command | Purpose |
| :--- | :--- |
| `yay` or `yay -Syu` | Full system upgrade (repos + AUR) |
| `yay -Sua` | Upgrade AUR packages only |
| `yay -Qua` | List AUR packages with updates |
| `yay -Syu --devel` | Check `-git` packages for new commits |

## Remove

| Command | Purpose |
| :--- | :--- |
| `yay -R <package>` | Remove a package |
| `yay -Rns <package>` | Remove package, config files, and unneeded dependencies |

## Query and Clean

| Command | Purpose |
| :--- | :--- |
| `yay -Qm` | List installed AUR packages |
| `yay -Ps` | Print system and package statistics |
| `yay -Yc` | Remove unneeded dependencies |
| `yay -Scc` | Clear package cache |

# Examples

Practical, copy-paste-ready examples for the most common tasks.

## Installing a Package

| Scenario | Command |
| :--- | :--- |
| Install Firefox | `yay -S firefox` |
| Install VLC | `yay -S vlc` |
| Install an AUR package | `yay -S google-chrome` |
| Install a -git package | `yay -S neovim-git` |
| Install without prompts | `yay -S --noconfirm firefox` |
| Install multiple at once | `yay -S firefox vlc htop` |
| Reinstall a package | `yay -S firefox` |

## Searching for Packages

| Scenario | Command |
| :--- | :--- |
| Search for a term | `yay -Ss neovim` |
| Narrow search (two terms) | `yay -Ss neovim plugin` |
| Interactive search (pick from menu) | `yay neovim` |
| List AUR results only | `yay -Ss neovim` then filter the AUR section |

## Updating the System

| Scenario | Command |
| :--- | :--- |
| Full system upgrade (repos + AUR) | `yay -Syu` |
| Full upgrade without prompts | `yay -Syu --noconfirm` |
| Upgrade only AUR packages | `yay -Sua` |
| Check for AUR updates only | `yay -Qua` |
| Check -git packages for new commits | `yay -Syu --devel` |
| Full upgrade with devel checks | `yay -Syu --devel --timeupdate` |

## Removing Packages

| Scenario | Command |
| :--- | :--- |
| Remove a package | `yay -R firefox` |
| Remove package and config files | `yay -Rns firefox` |
| Remove orphaned dependencies | `yay -Yc` |
| Remove cached packages | `yay -Scc` |

## Querying Installed Packages

| Scenario | Command |
| :--- | :--- |
| List all installed AUR packages | `yay -Qm` |
| List upgradable AUR packages | `yay -Qua` |
| Show info about a package | `yay -Si firefox` |
| List files owned by a package | `yay -Ql firefox` |
| Find which package owns a file | `yay -Qo /usr/bin/firefox` |

## Cleaning Up

| Scenario | Command |
| :--- | :--- |
| Remove unneeded dependencies | `yay -Yc` |
| Clear the package cache (all) | `yay -Scc` |
| Clear cache, keep installed only | `yay -Sc` |
| Remove build files after install | `yay -S --cleanafter <package>` |
| Print system statistics | `yay -Ps` |

## PKGBUILD Inspection

| Scenario | Command |
| :--- | :--- |
| Download a PKGBUILD without building | `yay -G google-chrome` |
| Print a PKGBUILD to stdout | `yay -Gp google-chrome` |
| Show the diff since last build | `yay -S <aur-package>` (prompts by default) |

## Combined Workflows

| Scenario | Command |
| :--- | :--- |
| Update system, then remove orphans | `yay -Syu && yay -Yc` |
| Update system without prompts, then clean | `yay -Syu --noconfirm && yay -Yc` |
| Install and drop make deps | `yay -S --removemake <package>` |
| Search and install in one flow | `yay <term>` then pick from the menu |

## Persistent Configuration

| Scenario | Command |
| :--- | :--- |
| Enable devel checks permanently | `yay -Y --devel --save` |
| Enable combined upgrade menu | `yay -Y --combinedupgrade --save` |
| Auto-clean build files permanently | `yay -Y --cleanafter --save` |
| Remove make deps permanently | `yay -Y --removemake --save` |
| Configure several at once | `yay -Y --devel --combinedupgrade --cleanafter --removemake --save` |

# Managing -git and Development Packages

Packages built from -git sources only show updates when their version field changes, which may be never. Yay can check the upstream commit instead.

## Generate Development Database

Run once to build the database for -git packages installed without yay:

    yay -Y --gendb

## Check Development Updates

    yay -Syu --devel

## Persist the Setting

Make devel checks permanent in your config:

    yay -Y --devel --save

After this, `yay` and `yay -Syu` will always check development packages.

# Configuration

Yay reads its configuration from `~/.config/yay/config.json`. Flags can be persisted with `--save`.

## Common Persisted Flags

    yay --devel --combinedupgrade --cleanafter --save

- `--devel` — check -git packages for updates
- `--combinedupgrade` — show repo and AUR upgrades in one menu
- `--cleanafter` — remove build files after successful install
- `--removemake` — drop make-only dependencies after build

# Safety and the AUR

The AUR is user-maintained. Packages are not vetted by Arch developers. Always review PKGBUILDs before building, especially for less popular packages.

## Review the PKGBUILD

Yay shows a diff menu for AUR updates by default, letting you see what changed since the last build. Keep this enabled as a safety check.

## Malware Risk

The AUR has seen malware incidents. Stick to packages from well-known maintainers or projects referenced in the Arch Wiki. When in doubt, inspect the PKGBUILD before building.

## Root Warning

Never run `yay` with `sudo`. It will refuse, and running it as root can break your system. Yay escalates privileges only for the final install step.

# yay vs pacman

Yay is a superset of `pacman` for practical purposes. You can use `yay` exclusively and never touch `pacman` directly.

## When to Use Which

| Scenario | Recommendation |
| :--- | :--- |
| Official repo packages only | Either works; `yay` is fine |
| AUR packages | Must use `yay` or another AUR helper |
| Full system update | Use `yay -Syu` to include AUR |
| Partial update risk | Avoid; always do full upgrades |

## Partial Upgrade Warning

Mixing `pacman -Syu` for repos and `yay -Sua` for AUR separately can lead to partial upgrades if the repo side doesn't match the AUR side. Prefer `yay -Syu` for a unified upgrade.

# Summary

Yay is the most widely used AUR helper for Arch Linux. It wraps `pacman`, adds AUR support, and provides a consistent interface for installing, searching, updating, and removing packages across both official and community repositories. Install it from the AUR, run it as a regular user, and keep the diff menu on for safety.

---

# Tags

- linux
- arch-linux
- yay
- aur
- package-management
- package-building
- command-line
