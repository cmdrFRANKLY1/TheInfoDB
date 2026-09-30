# 🛡️ The `sudo` Command

### ❓ What is it?

`sudo` (SuperUser DO) is a command-line tool that allows permitted users to execute commands with the security privileges of another user, typically the superuser (root). It acts as a security gateway, allowing system administration tasks to be performed without logging in as root, thereby minimizing the risk of accidental system damage.

---

### 🏳️ Options & Flags

`sudo [options] [command]`

| Flag                      | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `-u`, `--user <user>`     | Run the command as the specified user instead of root.               |
| `-i`, `--login`           | Run a login shell as the target user (loads their environment).      |
| `-s`, `--shell`           | Run the specified shell (or default shell) as the target user.       |
| `-l`, `--list`            | List the commands allowed (and forbidden) for the current user.      |
| `-v`, `--validate`        | Update the user's cached credentials (extends the timeout).          |
| `-k`, `--reset-timestamp` | Invalidate the cached password timestamp (forces re-authentication). |
| `-b`, `--background`      | Run the command in the background.                                   |
| `-e`, `--edit`            | Edit files safely with root privileges (uses `sudoedit`).            |
| `-h`, `--help`            | Display help message and exit.                                       |
| `-V`, `--version`         | Print the sudo version and exit.                                     |