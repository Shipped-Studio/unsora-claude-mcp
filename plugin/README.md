# Unsora

Unsora turns long videos, podcasts and streams into short clips, then posts or
schedules those clips to your connected social accounts: YouTube, TikTok,
Instagram, Facebook, LinkedIn, Pinterest, Threads, Bluesky, X and Google
Business Profile.

## What it does

- **Clipping:** give Claude a YouTube link or a video file and Unsora finds
  the strongest moments (or the moments you describe), cuts them into clips
  for Shorts, Reels or TikTok, reframes them to the aspect ratio you choose,
  and can add captions.
- **Scheduling:** write captions, pick accounts, and publish now or at a set
  time. Claude can also list, edit, retry and delete posts, and show how your
  posts performed.

The plugin includes the Unsora connector and a `clip-and-schedule` skill that
walks Claude through clipping a video and scheduling the clips.

## Try it

- "Clip this podcast into five 30-second vertical clips with captions:
  https://www.youtube.com/watch?v=…"
- "Find the moments where we talk about pricing in this webinar and make 9:16
  clips."
- "Schedule the second clip to TikTok and Instagram tomorrow at 9am with the
  caption 'Pricing, explained in 30 seconds'."
- "How did my posts do over the last 30 days?"

## Before you start

You need an Unsora account. Clipping uses credits from your account, and
posting needs a paid plan and at least one connected social account. Only clip
videos you own or have permission to use.

## How it connects

This plugin adds one remote MCP server, `https://clipcast.tryunsora.com/mcp`.
It runs no code on your computer. The first time Claude uses it, you sign in to
your Unsora account with OAuth.

To clip a file from your computer, ask Claude to open your Unsora library and
use its **Upload** button. The file goes straight to Unsora's storage through a
one-time upload link; Claude doesn't read the file.

## Data it sends

The video links, uploaded files, captions, accounts and schedule times you give
Claude are sent to Unsora to create clips and posts. Posts are published only
to the social accounts you choose, and only when you ask. Unsora doesn't
receive your conversation history.

- Documentation: https://tryunsora.com/connector
- Privacy policy: https://tryunsora.com/privacy
- Terms of service: https://tryunsora.com/terms
- Support: https://tryunsora.com/contact
