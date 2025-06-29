import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("mcp-ghq");

/** MCPサーバーを作成する関数 */
export function createMcpServer(): McpServer {
  const mcpServer = new McpServer({
    name: "mcp-ghq",
    title: "MCP ghq CLI Server",
    version: "1.0.0",
    description:
      `Model Context Protocol server for ghq - a remote repository management tool.
Provides tools to clone and manage Git repositories using ghq.`,
  });

  mcpServer.registerTool("get", {
    title: "Get Repository",
    description:
      `Clones a Git repository using ghq (if not already exists) and returns its local path. 
This tool helps manage remote repositories in a structured way using ghq's directory layout.`,

    inputSchema: {
      name: z.string().describe(
        "Repository name, URL, or ID (e.g., 'owner/repo', 'https://github.com/owner/repo.git', 'github.com/owner/repo')",
      ),

      shallow: z.boolean().default(true).describe(
        `If true, performs a shallow clone to save time and disk space.
Set to false for a full clone with complete history.`,
      ),

      rootPath: z.string().optional().describe(
        `Optional root path where repositories are stored. If not provided, uses the default ghq root path (usually ~/ghq).
This option is useful for managing project-specific repositories separately from your global ghq collection.`,
      ),
    },
  }, async ({ name, shallow, rootPath }) => {
    let env = {};
    if (rootPath) {
      env = { GHQ_ROOT: rootPath };
    }

    // fetch repository using ghq
    {
      const commandArgs = ["get"];
      if (shallow) {
        commandArgs.push("--shallow");
      }

      commandArgs.push(name);

      const command = new Deno.Command("ghq", {
        args: commandArgs,
        stdout: "piped",
        stderr: "piped",
        env,
      });

      const child = command.spawn();

      const [_stdout, stderr, status] = await Promise.all([
        child.stdout.getReader().read().then(({ value }) => {
          if (!value) {
            return;
          }

          const message = new TextDecoder().decode(value);
          logger.debug(message);
          return message;
        }),

        child.stderr.getReader().read().then(({ value }) => {
          if (!value) {
            return;
          }

          const message = new TextDecoder().decode(value);
          logger.error(message);
          return message;
        }),

        child.status,
      ]);

      const { code, success } = status;

      if (!success) {
        throw new Error(
          `ghq get failed with code ${code}: ${stderr}`,
        );
      }
    }

    // get repository path
    {
      const commandArgs = ["list", "--full-path", "--exact", name];

      const command = new Deno.Command("ghq", {
        args: commandArgs,
        stdout: "piped",
        stderr: "piped",
        env,
      });

      const { stdout, stderr, success } = await command.output();

      if (!success) {
        throw new Error(new TextDecoder().decode(stderr));
      }

      const path = new TextDecoder().decode(stdout).trim();

      const structuredContent = {
        path,
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(structuredContent),
        }],
        structuredContent,
      };
    }
  });

  return mcpServer;
}
