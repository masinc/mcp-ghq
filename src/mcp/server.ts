import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("mcp-ghq");

/** MCPサーバーを作成する関数 */
export function createMcpServer(): McpServer {
  const mcpServer = new McpServer({
    name: "mcp-ghq",
    title: "MCP ghq cli Server",
    version: "1.0.0",
  });

  mcpServer.registerTool("get", {
    title: "Get Repository",
    description: "Gets the path of a specific repository managed by ghq.",

    inputSchema: {
      name: z.string().describe("Name/URL/ID of the repository"),

      shallow: z.boolean().default(true).describe(
        "If true, performs a shallow clone of the repository.",
      ),

      rootPath: z.string().optional().describe(
        "Optional root path to get the repository from. If not provided, uses the default ghq root path.",
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
