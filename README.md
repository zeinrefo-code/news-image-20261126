[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/zeinrefo-code/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/zeinrefo-code/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# The World in One Day — 26 November 2026

A single front-page-style image that compresses one day of world news
into a classic newspaper layout: one dominant lead story, a row of
secondary headlines, and nothing else competing for the reader's eye.

This repository is an entry for the make.fun bounty
[news-image-20261126](https://make.fun/bounty/news-image-20261126)
($100 prize pool, 50 paid places). Bounty page:
https://make.fun/bounty/news-image-20261126

## What the image shows

- **Lead story — "AMERICA'S NEW TARIFFS"**: the Trump administration
  proposes new tariffs on goods from 14 major trading partners,
  China included (Reuters / BBC, 26 November 2026).
- **"RUSSIA'S WAR DEAD NEAR 500,000"** — leaked Russian government
  figures analysed by journalists put Russian military deaths in
  Ukraine at about 490,334 (BBC).
- **"UKRAINE HITS 5 RUSSIAN JETS"** — Ukraine says it struck a major
  Russian air base, damaging five planes (Reuters).
- **"HOUTHIS STRIKE SAUDI REFINERY"** — Yemen's Houthis say they
  attacked Saudi Arabia's largest oil refinery; Brent crude rose
  (Reuters).
- **"COLOMBIA HOSTAGES FREED"** — police storm a supermarket in
  Cartagena and free 20 people held hostage for 17 hours (BBC).
- **"MERCURY AT LAST"** — the BepiColombo probe reaches Mercury orbit
  after an eight-year journey.
- **"CAIRO TANKER FIRE — 30 DEAD"** — a fuel tanker crash ignites a
  massive fire on a highway around Cairo, killing at least 30 people.

## How to run

The delivery program is `main.ts`, a dependency-free Node script. It
locates `entry.png` next to itself, checks the PNG signature and a
minimum file size, copies the image into the output directory, and
then re-reads the copy and compares SHA-256 digests so a corrupted
deliverable can never pass silently.

Copy the image into the default `out/` directory:

```sh
node main.ts
```

Choose a different output directory with an environment variable:

```sh
MAKEFUN_OUTPUT_DIR=/some/other/dir node main.ts
```

Dry run — validate and hash the source image without writing anything:

```sh
node main.ts --check
```

## License

MIT — see the `LICENSE` file in this repository.
