# ClipCast — Unsora MCP server for Claude

**ClipCast** is the Claude connector for Unsora: clip long videos into shorts
and schedule or publish posts. It's a standalone copy of `chatgpt-mcp` (itself
a copy of `mono-repo/apps/mcp`) that serves only the **scheduler** tool set — the same tools as the monorepo's
`/scheduler` endpoint. Deploy it separately
(e.g. `https://claude-mcp.tryunsora.com/mcp`).

Differences from the monorepo app:

- One endpoint only: `/mcp` (or `MCP_PATH`) serves the scheduler profile.
  The full generation tool set is not served.
- Every tool declares `readOnlyHint`, `destructiveHint` and `openWorldHint`
  (see the hint constants in `src/tools/index.ts`), carried over from the
  ChatGPT build.
- Widgets use Claude's sandbox domain (`<sha256>.claudemcpcontent.com`,
  derived from `MCP_PUBLIC_URL` + `MCP_PATH`), as in the monorepo app.
- `server.json` is the MCP registry manifest (`com.tryunsora/clipcast`).

```text
Claude
   ↓
https://claude-mcp.tryunsora.com/mcp
   ↓
This server (Clerk OAuth or Bearer USER_API_KEY)
   ↓
UNSORA_API_BASE_URL (Unsora API)
```

## Auth

Claude connects with OAuth (Clerk). Discovery lives at
`/.well-known/oauth-protected-resource/mcp` and
`/.well-known/oauth-authorization-server`; `/oauth/register` proxies dynamic
client registration to Clerk with the full scope list.

An Unsora API key also works, in any of these headers:

```http
apiKey: uns_...
x-api-key: uns_...
Authorization: Bearer uns_...
```

## Local dev

```bash
cp .env.example .env
npm install
npm run dev
```

```bash
curl http://localhost:3002/health

npx @modelcontextprotocol/inspector \
  --transport http \
  --server-url http://localhost:3002/mcp \
  --header "Authorization: Bearer uns_YOUR_KEY"
```

## Deploy (Railway)

`railway.json` builds with `npm run build`, starts with `npm start` and
health-checks `/health`. Set the variables below, then point DNS at it:

```text
CNAME claude-mcp → your-railway-domain
```

## Environment

| Variable                | Default            | Purpose                                      |
| ----------------------- | ------------------ | -------------------------------------------- |
| `PORT`                  | `3000`             | Listen port                                  |
| `HOST`                  | `0.0.0.0`          | Bind address                                 |
| `MCP_PUBLIC_URL`        | required           | Public origin (OAuth metadata, icons, widget domain) |
| `MCP_PATH`              | `/mcp`             | MCP endpoint path                            |
| `MCP_ALLOWED_HOSTS`     | required           | Host header allowlist                        |
| `MCP_SERVER_NAME`       | `clipcast`         | MCP server name                              |
| `CLERK_PUBLISHABLE_KEY` | required           | Clerk OAuth                                  |
| `CLERK_SECRET_KEY`      | required           | Clerk OAuth                                  |
| `UNSORA_API_BASE_URL`   | required           | Backend API                                  |
| `UNSORA_APP_URL`        | `https://app.tryunsora.com` | Web app the widgets link to         |
| `MCP_MEDIA_DOMAINS`     | —                  | Media hosts allowed in the widget CSP        |

## Tools

| Tool                        | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `create_clipping`           | Long video → short clips                             |
| `wait_for_clipping`         | Poll clipping job                                    |
| `get_credits`               | Credit balance                                       |
| `get_subscription`          | Plan / `isActive`                                    |
| `get_accounts`              | Connected social accounts                            |
| `create_post`               | Draft, schedule, or publish now (`publishNow`)       |
| `compose_post`              | Interactive post composer                            |
| `publish_post`              | Publish a draft / scheduled post immediately         |
| `get_post` / `list_posts`   | Read posts                                           |
| `update_post`               | Edit / reschedule a draft or scheduled post          |
| `retry_post`                | Retry failed accounts of a post                      |
| `delete_post`               | Delete a post                                        |
| `get_post_analytics`        | Views / likes / comments / shares of published posts |
| `upload_file`               | Import a URL / base64 file into the library          |
| `list_uploads`              | List uploaded files                                  |
| `list_generations`          | Browse past results to post                          |
| `delete_generation`         | Delete a result or uploaded file                     |

App-only (widget polling / pickers): `clipping_status`, `pinterest_boards`,
`tiktok_creator_info`.

The tool list is `SCHEDULER_TOOLS` in `src/server.ts`; `limitTools` in
`src/tools/index.ts` drops every other tool and any widget no remaining tool
renders.

## Preview widgets (MCP Apps)

Plain HTML/JS in `assets/mcp-ui/`, served as-is. This build exposes
`ui://unsora/` `account`, `accounts`, `posts`, `analytics`, `library`,
`composer` and `clipping`. `npm run preview` opens a mock host that exercises
the widgets without the server.

## Project layout

```text
src/
  index.ts       # Express + Streamable HTTP (/mcp) + OAuth discovery
  auth.ts        # API key from request headers
  unsora-api.ts  # Unsora HTTP client + polling
  server.ts      # createMcpServer — scheduler tool set
  tools/index.ts # Tool registrations
assets/
  brand/         # Server icons
  mcp-ui/        # Preview widgets (plain HTML)
ui/              # npm run preview — mock host for the widgets
server.json      # MCP registry manifest
```
