# Arch

Arch Linux is an independently developed, x86-64 general-purpose Linux distribution that strives to provide the latest stable versions of most software by following a rolling release model. Known for its minimalist, "do-it-yourself" approach, Arch gives users complete control over their system from the ground up.

# What Arch Linux Is

Unlike distributions like Ubuntu or Debian that come with a pre-configured graphical desktop, default web browser, and a suite of office tools, an official Arch Linux installation provides only a minimal base system. The user is expected to build their environment by explicitly choosing and installing only the components they want.

## The Arch Philosophy (KISS)

The guiding principle of Arch Linux is KISS ("Keep It Simple, Stupid"). In the context of Arch, "simplicity" is defined from a technical standpoint, not a user-experience standpoint. 

It aims for:
* **Minimalism:** No unnecessary additions or modifications to upstream software.
* **Code Elegance:** Clean, readable, and easy-to-understand system configuration files.
* **User-Centricity:** Arch is designed to be user-centric, rather than user-friendly. It caters to the needs of the user contributing to it, expecting them to be willing to read documentation and understand how their system operates.

Arch Linux was originally created by Judd Vinet in 2002, inspired by the elegant simplicity of distributions like Slackware and CRUX.

# The Rolling Release Model

Most operating systems (like Debian, Ubuntu, or Windows) use a "point release" model, where entirely new versions of the OS are released periodically (e.g., Ubuntu 22.04, 24.04).

Arch Linux uses a rolling release model. There are no major version upgrades. Instead, individual software packages are updated continuously as new versions are released by upstream developers. 

* **The Benefit:** Users always have access to the bleeding-edge features and newest software almost immediately.
* **The Drawback:** Because the software is so new, the risk of encountering bugs or system breakages requires the user to be somewhat technically proficient to troubleshoot issues.

# Package Management

Arch Linux is famous for its efficient and powerful package management ecosystem, which is divided into official repositories and a massive community-driven repository.

## Pacman

The primary package manager is pacman. It was written in C to be incredibly fast and lightweight. Pacman resolves dependencies and automatically downloads and installs packages from the official Arch mirrors.

A typical command to synchronize the repository databases and update the entire system looks like this:

```bash
# Synchronize repositories and upgrade all packages
sudo pacman -Syu

# Install a specific software package (e.g., firefox)
sudo pacman -S firefox
```

## The AUR (Arch User Repository)

The AUR is arguably Arch Linux's greatest asset. It is a community-driven repository containing over 80,000 software packages that are not found in the official repositories. 

Instead of pre-compiled binaries, the AUR contains PKGBUILD files. These are shell scripts that tell the `makepkg` utility exactly how to download the source code, compile it, and package it so `pacman` can install it. If a piece of software exists for Linux, it is almost certainly in the AUR.

# The Arch Wiki

Because Arch expects users to configure everything manually—from the bootloader and network manager to the display server and audio drivers—documentation is critical. 

The Arch Wiki is widely considered one of the most comprehensive and well-maintained pieces of documentation in the entire open-source world. It is so detailed and universally applicable that users of entirely different Linux distributions frequently use the Arch Wiki to solve their own system problems.

# Arch Derivatives

Because installing and configuring Arch Linux from a command-line prompt can be daunting for beginners, several other distributions have been built on top of Arch to provide a graphical installer and a pre-configured out-of-the-box experience.

## Notable Derivatives
* **Manjaro:** One of the most popular derivatives. It holds back Arch updates by a few weeks in its own repositories to ensure greater stability, providing a highly polished desktop experience.
* **EndeavourOS:** Provides a graphical installer but stays very close to pure Arch, using the official Arch repositories directly.
* **Garuda Linux:** A heavily optimized, performance-focused derivative often used for Linux gaming, featuring a visually striking default interface and automatic system snapshots.

# Summary

Arch Linux is not for everyone. It requires patience, a willingness to read documentation, and a desire to understand how a Linux system actually works under the hood. However, for power users, developers, and enthusiasts who want a lightweight, bleeding-edge OS perfectly tailored to their exact specifications, Arch Linux is unmatched. 

# Tags

* linux
* operating-system
* open-source
* arch-linux
* pacman
* aur
* rolling-release
* bleeding-edge

# Hyperlinks

| Word in Document | Official Source |
| ----- | ----- |
| Arch Linux | https://archlinux.org/ |
| Arch Wiki | https://wiki.archlinux.org/ |
| AUR | https://aur.archlinux.org/ |
| pacman | https://wiki.archlinux.org/title/pacman |
| Manjaro | https://manjaro.org/ |
| EndeavourOS | https://endeavouros.com/ |
| Garuda Linux | https://garudalinux.org/ |

# Mouse Over

| Word in Document | Mouse Over Information |
| ----- | ----- |
| KISS | "Keep It Simple, Stupid"; a design principle stating that systems work best when they are kept simple rather than made complicated. |
| rolling release | A software delivery model where updates are continuously pushed to the user, eliminating the need for major version upgrades. |
| upstream | The original creators or maintainers of a piece of software, before it is packaged by a Linux distribution. |
| bleeding-edge | The absolute newest, most advanced version of a technology or software, which may occasionally contain unresolved bugs. |
| pacman | The official package manager for Arch Linux, written in C, used to securely resolve dependencies and install software. |
| AUR | Arch User Repository; a community-driven repository containing scripts to compile and install software from source code. |
| PKGBUILD | A specialized shell script containing the instructions required by Arch Linux to build a package from source. |
| makepkg | A script that automates the building of packages in Arch Linux using a PKGBUILD file. |
| source code | The fundamental, human-readable text written by a programmer that dictates how a software program operates. |
| Judd Vinet | A Canadian software developer who created and founded the Arch Linux project in 2002. |
| Slackware | The oldest currently maintained Linux distribution, known for its strict adherence to Unix-like design and simplicity. |
| user-centric | A design philosophy prioritizing the freedom, transparency, and control of the end-user over hiding system complexity. |