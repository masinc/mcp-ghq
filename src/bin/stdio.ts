import { createMcpServer } from "../mcp/server.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configure, getLogger, getStreamSink } from "@logtape/logtape";
import denoConfig from "../../deno.json" with { type: "json" };

await configure({
  sinks: {
    stderr: getStreamSink(Deno.stderr.writable),
  },
  loggers: [
    {
      category: "mcp-ghq",
      lowestLevel: "debug",
      sinks: ["stderr"],
    },
  ],
});

const logger = getLogger("mcp-ghq");
logger.info(`mcp-ghq v${denoConfig.version} (STDIO mode)`);

const mcpServer = createMcpServer();
const transport = new StdioServerTransport();

await mcpServer.connect(transport);
