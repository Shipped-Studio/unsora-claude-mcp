import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { UnsoraApi } from "./unsora-api.js";
import { registerTools, schedulerWorkflowGuide } from "./tools/index.js";

export type UnsoraAuthResolver = (authInfo?: AuthInfo) => UnsoraApi;

export const SCHEDULER_INSTRUCTIONS = [
  "ClipCast by Unsora turns long videos, podcasts and streams into short clips (AI clipping), then posts or schedules those clips to the user's connected social accounts. Clipping spends credits from the user's ClipCast account; posting needs a paid plan.",
  "create_clipping starts a job. In hosts that render the ClipCast preview panel, the panel polls and shows the clips itself; otherwise follow with wait_for_clipping until the status is COMPLETED or FAILED.",
  "Files the user attaches in this chat don't reach ClipCast: import them with upload_file (public URL, or base64 for small files) before clipping or posting them. For large files from the user's device, call list_uploads so they can use the panel's Upload button; agents that can send HTTP requests can use create_upload_url + complete_upload.",
  "See the clipcast://workflows resource for multi-step workflows.",
].join(" ");

/**
 * This build serves only the scheduler: clipping plus everything needed to
 * post. The monorepo app serves the full tool set at /mcp.
 */
const SCHEDULER_TOOLS = new Set([
  // Clipping
  "create_clipping",
  "clipping_status",
  "wait_for_clipping",
  // Accounts and plan
  "get_accounts",
  "pinterest_boards",
  "tiktok_creator_info",
  "get_credits",
  "get_subscription",
  // Posts
  "create_post",
  "compose_post",
  "publish_post",
  "update_post",
  "delete_post",
  "get_post",
  "list_posts",
  "retry_post",
  "get_post_analytics",
  // Media to post
  "upload_file",
  "create_upload_url",
  "complete_upload",
  "list_uploads",
  "list_generations",
  "delete_generation",
]);

export function createMcpServer(resolveUnsora: UnsoraAuthResolver): McpServer {
  const baseUrl =
    process.env.MCP_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`;

  const server = new McpServer(
    {
      name: process.env.MCP_SERVER_NAME || "clipcast",
      title: "ClipCast",
      version: "1.0.0",
      websiteUrl: "https://tryunsora.com",
      icons: [
        {
          src: `${baseUrl}/assets/brand/icon-light.png`,
          mimeType: "image/png",
          sizes: ["524x524"],
          theme: "light",
        },
        {
          src: `${baseUrl}/assets/brand/icon-dark.png`,
          mimeType: "image/png",
          sizes: ["520x520"],
          theme: "dark",
        },
      ],
    },
    { instructions: SCHEDULER_INSTRUCTIONS },
  );

  registerTools(server, resolveUnsora, {
    tools: SCHEDULER_TOOLS,
    workflowGuide: schedulerWorkflowGuide,
  });

  return server;
}
