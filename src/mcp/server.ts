import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/** MCPサーバーを作成する関数 */
export function createMcpServer() {
  const mcpServer = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  });

  mcpServer.registerTool("echo", {
    title: "Echo Tool",
    description: "Echoes back the input text.",
    annotations: {
      readOnlyHint: true, // 外部の状態を変更しない
      openWorldHint: false, // 外部システムと接続しない
    },
    inputSchema: {
      text: z.string().describe("Text to echo"),
    },
    outputSchema: {
      result: z.string().describe("The echoed text"),
    },
  }, ({ text }) => {
    const structuredContent = {
      result: text,
    };

    return {
      content: [{
        type: "text",
        text: JSON.stringify(structuredContent),
      }],
      structuredContent,
    };
  });

  return mcpServer;
}
