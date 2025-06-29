# mcp-ghq

MCP (Model Context Protocol) server for [ghq](https://github.com/x-motemen/ghq) - a remote repository management tool.

## Features

This MCP server provides tools to interact with ghq:

- **list**: List all repository paths managed by ghq
- **get**: Clone/get a repository and return its path
- **echo**: Simple echo tool for testing

## Installation

### Via JSR

```bash
# Install globally
deno install -g --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-stdio
deno install -g --allow-net --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http
```

### From Source

```bash
git clone https://github.com/masinc/mcp-ghq.git
cd mcp-ghq
```

## Usage

### STDIO Mode

Run the MCP server in STDIO mode (for use with MCP clients):

```bash
# From JSR
deno run --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-stdio

# From source
deno task run-stdio
```

### HTTP Mode

Run the MCP server as an HTTP server:

```bash
# From JSR
deno run --allow-net --allow-run jsr:@masinc/mcp-ghq/mcp-ghq-http

# From source
deno task run-http
```

The HTTP server will be available at `http://localhost:8000/mcp`.

### Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
# Test STDIO mode
deno task inspect-stdio

# Test HTTP mode
deno task inspect-http
```

## MCP Tools

### list

Lists all repository paths managed by ghq.

**Input:**
- `rootPath` (optional): Root path to list repositories from

**Output:**
- `repositories`: Array of repository paths

### get

Gets a repository using ghq (clones if not exists) and returns its path.

**Input:**
- `name`: Repository name/URL/ID
- `shallow` (optional, default: true): Perform shallow clone
- `rootPath` (optional): Root path for the repository

**Output:**
- `path`: Local path of the repository

### echo

Simple echo tool for testing.

**Input:**
- `text`: Text to echo

**Output:**
- `result`: The echoed text

## Requirements

- [Deno](https://deno.land/) runtime
- [ghq](https://github.com/x-motemen/ghq) installed and configured

## Development

```bash
# Run in development mode
deno task run-stdio
deno task run-http

# Test with MCP Inspector
deno task inspect-stdio
deno task inspect-http
```

## License

MIT