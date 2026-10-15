---
name: clip-and-schedule
description: Turn a long video into short clips and post or schedule them with Unsora. Use when the user wants to clip, cut or repurpose a podcast, stream, webinar or interview into Shorts, Reels or TikToks, find specific moments in a video, or post and schedule clips to their social accounts.
---

# Clip a long video and schedule the clips

Use the Unsora connector's tools in this order.

## 1. Get the video in

- A YouTube link or a direct video file URL (such as `.mp4`) can go straight
  to `create_clipping`. Page links from TikTok, Instagram or Vimeo don't work.
- For a file on the user's device, call `list_uploads`. It opens the library
  panel, and the user uploads the file with its **Upload** button. The file
  goes straight to Unsora's storage, and the upload's URL works as the
  clipping input.
- Only clip videos the user owns or has permission to use.

## 2. Agree the clip settings

Clipping spends the user's credits, so confirm these before calling
`create_clipping`:

- aspect ratio: 9:16 for Shorts, Reels and TikTok; 1:1 or 4:5 for feed posts;
  16:9 for YouTube; or the original ratio
- captions on or off, and the caption style if on
- how many clips, and how long each should be
- or, instead of length, the moments to find (pass them as `query`, for example
  "the part where we discuss pricing")

`get_credits` shows the balance if the user asks what it will cost.

## 3. Create the clips

Call `create_clipping`. Where the clips preview panel appears, it tracks
progress and shows the clips when they're ready, so tell the user the job has
started and what settings it uses. Where there's no panel, `wait_for_clipping`
returns the clips with their URLs. Clips made earlier are in `list_clips`.

## 4. Post or schedule

1. `get_subscription`: posting needs a paid plan (`isActive`).
2. `get_accounts`: find the accounts to post to.
3. Where apps can show, `compose_post` opens the composer prefilled with the
   clip URL, caption, accounts and time, and the user finishes there. Elsewhere,
   `create_post` creates the post: pass `scheduled_at` to schedule it, or
   `publishNow: true` to post right away. Without either it's saved as a draft.
4. Make one post per clip.

## 5. Follow up

- A post that is `FAILED` or `PARTIALLY_PUBLISHED`: `retry_post` retries only
  the accounts that failed. A new post would publish twice to the accounts
  that succeeded.
- `get_post_analytics` reports views, likes, comments and shares over 7 to 90
  days.
