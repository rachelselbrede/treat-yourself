# 🍭 Treat Yourself

A sweet little sugar tracker — built at the **UC Berkeley Women's Night Hackathon**.

Pick the treats you've had today, watch the grams add up, and keep an eye on the
sugar scale on the right as you get closer to your daily goal.

## What it does

- **Treat picker** — ~55 preset sweets (cookies, boba, ice cream, candy, drinks, fruit)
  organized by category, with search.
- **Add your own** — name it, give it a sugar value and an emoji, and it lives in
  the "Yours" category.
- **Today's log** — a running total with timestamps; remove anything you tapped by mistake.
- **The sugar scale** — a vertical gauge on the side that fills up and shifts color
  (mint → butter → peach → rose) as you approach your goal, with a dashed goal line
  and a readout showing the percentage and how much room is left.
- **Adjustable goal** — defaults to 25 g (the American Heart Association's suggestion
  for women); one tap for 25 / 36 / 50 g, or type your own.
- **Daily reset + 7-day history** — the day rolls over at midnight on its own, and the
  last week shows up as a little bar chart with your logging average.

Feedback messages are deliberately kind — the scale is for awareness, not guilt.
Going over your goal says so plainly and then tells you tomorrow resets.

## Running it

No build step, no dependencies. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

To put it online, turn on GitHub Pages for this repo (Settings → Pages → Deploy from
branch → `main` / root).

## Privacy

Everything is stored in your browser's `localStorage`. Nothing is sent to a server —
there isn't one. Clearing site data clears your history.

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | All the pastel |
| `treats.js` | The preset treat library and sugar values |
| `app.js` | State, rendering, the scale, storage |

## A note on the numbers

Sugar values are rounded public nutrition-label averages for one typical serving.
They're close enough to be useful for curiosity and not precise enough for anything
clinical. This isn't medical or nutrition advice.
