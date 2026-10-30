This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Completion capture and notifications

Visitors confirm name and email before starting (URL handoff values are prefilled).
The last step saves before showing results. Each completed quiz writes all eight
answers, identity, time, scores, tier, weakest pillar and a submission reference to
a GHL contact note. The note is independently read back before an internal email
is sent to richard@transformationpartners.com.au, with the full response and CRM link.
No additional email is sent to the participant by this code; existing GHL tag
workflows remain in place.

The server-only GHL_API_KEY must allow contact read/write, note read/write and
conversation email sending. The location and Richard's notification contact are
fixed in src/lib/completion.ts. A failed save or email submission keeps the visitor
on the last question with a retry. Answers remain in the current page until they
leave or reload; there is no background retry after the page closes.

Normal sequential retries reuse the same verified note and recorded message ID.
A fresh run creates a new history note. GHL does not provide an atomic transaction
across notes and email: overlapping requests or a provider success followed by a
lost response can still duplicate an alert. A message ID confirms acceptance by
GHL, not arrival in the destination inbox. No historical raw answers can be recovered.

Run npm test, npm run lint and npm run build before release. Tests cover full
persistence, validation, existing contacts, replay, failed readback and failed
notification recovery. Use Richard's own contact and an explicit TEST name for
any live smoke test.
