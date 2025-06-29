import { createMcpServer } from "../mcp/server.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configure, getStreamSink } from "@logtape/logtape";

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

const mcpServer = createMcpServer();
const transport = new StdioServerTransport();

await mcpServer.connect(transport);
