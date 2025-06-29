# mcp-ghq

MCP (Model Context Protocol) server for [ghq](https://github.com/x-motemen/ghq) - a remote repository management tool.

## Features

This MCP server provides tools to interact with ghq:

- **get**: Clone/get a repository and return its path

## Installation & Usage

### STDIO Mode

Run the MCP server in STDIO mode (for use with MCP clients):

```bash
deno run --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-stdio
```

To ensure you're running the latest version:

```bash
deno run --reload --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-stdio
```

### HTTP Mode

Run the MCP server as an HTTP server:

```bash
deno serve --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http
```

To ensure you're running the latest version:

```bash
deno serve --reload --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http
```

The HTTP server will be available at `http://localhost:8000/mcp`.

You can specify host and port:

```bash
# Custom port
deno serve --port 3000 --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http

# Custom host and port
deno serve --host 0.0.0.0 --port 3000 --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http
```

## MCP Tools

### get

Gets a repository using ghq (clones if not exists) and returns its path.

**Input:**
- `name`: Repository name/URL/ID
- `shallow` (optional, default: true): Perform shallow clone
- `rootPath` (optional): Root path for the repository

**Output:**
- `path`: Local path of the repository

## Requirements

- [Deno](https://deno.land/) runtime
- [ghq](https://github.com/x-motemen/ghq) installed and configured


## License

MIT