# curl

The `curl` command stands for **Client URL**. It is a powerful and ubiquitous command-line tool in Unix, Linux, and other Unix-like operating systems used to transfer data to or from a network server using various supported protocols, most notably HTTP and HTTPS.

# What curl Is

When you want to fetch web pages, interact with REST APIs, or download files directly from the terminal without opening a web browser, `curl` is the industry-standard utility. 

Unlike a browser, which renders HTML into a visual graphical interface, `curl` is designed to output raw data streams directly to standard output (`stdout`). This makes it exceptionally easy to pipe data into other text-processing tools like `jq`, `grep`, or `sed`, or to script automated requests in shell scripts.

# Common Options

While a basic execution of `curl` simply prints the response body of a URL to the screen, it includes a vast array of command-line flags to modify headers, send data, and handle authentication.

## `-O` (Remote Name)

By default, `curl` outputs retrieved data directly to your terminal screen. The `-O` flag tells `curl` to save the downloaded file locally, keeping its original remote filename.

## `-o` (Output File)

If you want to save downloaded data under a custom local filename rather than its original name, the `-o` flag allows you to specify the exact target filename.

## `-X` (Request Method)

By default, `curl` sends a standard `GET` request. The `-X` flag allows you to explicitly define a different HTTP method, such as `POST`, `PUT`, `DELETE`, or `PATCH`.

## `-d` (Data)

When interacting with APIs, you often need to send payload data (such as JSON or form data). The `-d` flag allows you to pass data parameters along with your request (which automatically switches the default request method to `POST`).

## `-H` (Header)

The `-H` flag lets you inject custom HTTP headers into your request, such as `Content-Type: application/json` or authorization tokens.

## `-I` (Head)

The `-I` flag fetches *only* the HTTP response headers (status codes, server info, content-type) without downloading the actual body content.

## `-L` (Location / Follow Redirects)

Web servers frequently redirect requests to new URLs (using 301 or 302 status codes). By default, `curl` stops at the redirect response; the `-L` flag forces it to automatically follow redirects until it reaches the final destination page.

# Practical Examples

Here are the most common ways you will use `curl` in the terminal for web requests and system automation.

## Fetching a Web Page

This is the most basic usage, printing the raw HTML source of a website to your terminal.

* **Command:** `curl https://example.com`

* **Result:** Outputs the HTML response body of the example domain directly to standard output.

## Downloading a File

Using the remote name flag to save a downloadable file locally.

* **Command:** `curl -O https://example.com/archive.zip`

* **Result:** Downloads `archive.zip` from the server and saves it in your current working directory under that exact filename.

## Saving with a Custom Filename

If you want to rename the downloaded file during the transfer process.

* **Command:** `curl -o custom_name.tar.gz https://example.com/download?id=123`

* **Result:** Saves the remote file locally as `custom_name.tar.gz`.

## Sending a POST Request with JSON Data

A common workflow for testing REST APIs.

* **Command:** `curl -X POST -H "Content-Type: application/json" -d '{"username": "developer", "status": "active"}' https://api.example.com/users`

* **Result:** Sends a `POST` request containing a JSON payload with a defined content-type header to the API endpoint.

Inspire / System Maintenance

## Inspecting Response Headers Only

Useful when troubleshooting server status or checking caching policies.

* **Command:** `curl -I https://github.com`

* **Result:** Returns the HTTP status line, date, server type, and content headers without printing the page body.

# Summary

The `curl` command is an indispensable utility for developers, system administrators, and network engineers. Whether you are downloading software packages, debugging web servers, or querying REST APIs using custom headers and JSON payloads, mastering `curl` provides total control over HTTP communications in the terminal.

# Tags

* linux

* bash

* gnu

* command-line

* terminal

* networking

* curl

* http

* api

* web

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| curl | https://curl.se/docs/manpage.html | 
| HTTP | https://datatracker.ietf.org/doc/html/rfc9110 | 
| REST | https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| API | Application Programming Interface; a set of rules and protocols allowing different software applications to communicate. | 
| arguments | Extra data, URLs, or flags provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| command-line | A text-based interface used to interact with a computer operating system by typing commands. | 
| curl | Client URL; a command-line utility used for transferring data across various network protocols like HTTP or HTTPS. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-O`) passed to a command to modify its default behavior. | 
| grep | Global Regular Expression Print; a command used to search text for lines matching a specific pattern. | 
| HTML | HyperText Markup Language; the standard markup language used to create web pages. | 
| HTTP | Hypertext Transfer Protocol; the foundational protocol used to transmit data across the World Wide Web. | 
| HTTPS | Hypertext Transfer Protocol Secure; an encrypted extension of HTTP used for secure web communications. | 
| jq | A lightweight and flexible command-line JSON processor used to slice, filter, and map structured JSON data. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| payload | The actual intended message, object, or data string carried inside an HTTP request or response body. | 
| redirect | A server response instructing the client browser or tool to fetch the requested resource from a different URL. | 
| REST | Representational State Transfer; an architectural style for designing networked applications using HTTP methods. | 
| sed | Stream Editor; a powerful text processing tool used for filtering and transforming text streams. | 
| shell | A computer program that exposes an operating system's services to a human user or other programs. | 
| standard output | Often abbreviated as `stdout`; the default data stream where a program writes its normal output data. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| URL | Uniform Resource Locator; a structured web address used to locate a resource on a computer network. | 
