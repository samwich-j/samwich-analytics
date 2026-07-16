# Nomatic Multi-Channel Inventory Forecasting — Methodology & Output Guide

## What This Project Is

This project builds a 6-month inventory forecast for [Nomatic](https://www.nomatic.com/), a premium travel bag and gear brand that sells through two very different channels:

- **D2C (Direct-to-Consumer)** — online sales to individual customers
- **B2B (Business-to-Business / Wholesale)** — bulk orders from retailers and distributors

The core challenge: **these two channels behave so differently that they require completely separate forecasting strategies.** D2C sales are smooth and seasonal — you can predict tomorrow's sales pretty well from last week's pattern. B2B is the opposite: most days have zero sales, then suddenly a retailer places an order for 1,500 units. No traditional time-series model handles both well.

## Why This Matters for Nomatic

Inventory planning for a multi-channel brand is a balancing act:

- **Under-stock** and you miss D2C sales (lost revenue) or can't fulfill a wholesale order (lost relationship)
- **Over-stock** and you tie up capital in unsold inventory (carrying costs, potential markdowns)

The question isn't "how many units will we sell?" — it's "how many units should we have on hand, given the uncertainty in our B2B channel?" This analysis answers that by giving a **range** of outcomes (P10 through P90) rather than a single number, so Nomatic can choose their risk tolerance.

---

## The Data

The dataset (`nomatic_daily_sales.csv`) contains 2,190 rows: 1,095 days (3 years) × 2 channels, each representing one day's sales for one channel.

| Column | What It Is |
|--------|-----------|
| `date` | The day (2023-01-01 through 2025-12-30) |
| `day_of_week` | Written day name (Monday, Tuesday, etc.) |
| `channel` | "D2C" or "B2B" |
| `units_sold` | Number of units sold that day |
| `unit_price` | Price per unit that day |
| `revenue` | Total revenue (units_sold × unit_price) |

### How the two channels differ

**D2C** is what most people picture when they think of sales data:
- Sales every single day (1,095 out of 1,095 days active)
- Average ~146 units/day
- Clear weekly pattern: weekdays sell ~33% more than weekends
- Clear annual pattern: November/December spikes (holiday shopping), January dips (post-holiday slump), summer bump (travel season)
- Steady upward growth trend over 3 years

**B2B** is completely different:
- Only 101 days out of 1,095 have any sales at all (~9.2%)
- When orders come, they're big: average spike is ~884 units
- Spikes cluster around quarter-ends (last 15 days of March, June, September, December) — retailers restocking
- No smooth trend, no weekly pattern — just intermittent large orders

This contrast is why we use Prophet for D2C and Monte Carlo simulation for B2B.

---

## Statistical Methods Explained

### 1. Facebook Prophet (D2C Forecast)

**What it is:** Prophet is a forecasting model developed by Meta (Facebook) in 2017. It decomposes a time series into three components:

- **Trend** — the long-term direction (are sales growing, shrinking, or flat?)
- **Weekly seasonality** — the repeating pattern within each week (weekday vs weekend)
- **Yearly seasonality** — the repeating pattern within each year (holiday spikes, summer bumps)

The forecast is the sum of these components: `forecast = trend + weekly + yearly`.

**Why Prophet for D2C?** Prophet is designed for exactly this kind of data:
- Daily observations with strong weekly and annual patterns
- Multiple years of history to learn the seasonal shapes
- A growth trend that may have changepoints (acceleration/deceleration)

You could use ARIMA or exponential smoothing instead, but Prophet handles multiple seasonalities more naturally and produces uncertainty intervals out of the box.

**What we configured:**
- `yearly_seasonality=True` — let Prophet learn the annual pattern (holiday spike, January dip, summer bump)
- `weekly_seasonality=True` — let Prophet learn the weekday vs weekend pattern
- `daily_seasonality=False` — our data is daily-grained, so there's no intra-day pattern to model
- `changepoint_prior_scale=0.05` — this controls how flexible the trend is. The default (0.05) allows moderate trend changes. Lower values make the trend smoother; higher values let it react to sudden shifts.

**How to read the component plots:**

- **Trend panel:** Shows D2C growing from ~125 units/day in early 2023 to ~185 units/day by mid-2026. This is the underlying growth trajectory with seasonality stripped out.

- **Weekly panel:** Shows units relative to the trend. Monday is the peak day (~+25 units above average), while Sunday is the trough (~-40 units). The pattern is: Monday > Tuesday-Friday > Saturday > Sunday.

- **Yearly panel:** Shows the seasonal pattern across the calendar year. The massive spike in November represents holiday shopping (+120 units above trend). January/February shows the post-holiday slump (-50 units). There's a smaller summer bump in June/July.

**How to read the forecast plot:**

- Gray dots are daily actual sales (noisy)
- Blue line is the 14-day rolling average of actuals (smoother)
- Orange line after the dashed vertical is the forecast
- Shaded orange band is the 80% uncertainty interval — Prophet is 80% confident actual values will fall in this range. Wider bands mean more uncertainty.

### 2. Backtesting (D2C Model Validation)

**What it is:** Before trusting a model's future predictions, we test how well it would have predicted the past. We train the model on years 1-2 (2023-2024) and ask it to predict year 3 (2025). Then we compare those predictions to what actually happened.

**MAE (Mean Absolute Error):** The average number of units the prediction was off by, on any given day. Our MAE of ~20 units/day means the forecast is typically within ±20 units of the actual value. With an average of ~146 units/day, that's pretty good.

**MAPE (Mean Absolute Percentage Error):** The average percentage the prediction was off by. Our MAPE of ~13% means on average, the forecast is about 13% off from actual. In demand forecasting, MAPE under 20% is generally considered good, and under 10% is excellent. Our 13% sits in the "good" range.

**Why these metrics matter for a cold call:** You can say "the model achieves 13% MAPE on held-out data" — that's a concrete, quantifiable accuracy claim. Much stronger than "the model looks pretty good."

### 3. Two-Proportion Z-Test (Quarter-End Clustering)

**What it tests:** Are B2B spikes significantly more likely during quarter-end windows (last 15 days of March, June, September, December) than during the rest of the year?

This is the same test used in the &Collar project. For proportions, the variance is p(1-p)/n — fully determined by p — so a z-test is the correct choice (not a t-test).

**How to read the output:**
- Quarter-end spike rate: ~17.8% (33 spikes out of 185 quarter-end days)
- Non quarter-end rate: ~7.5% (68 spikes out of 910 other days)
- Z-statistic: 4.44, p-value: 0.000009

The spike rate more than doubles during quarter-end windows, and this is highly statistically significant. This isn't random — retailers genuinely tend to restock at quarter-ends.

**Why this matters for the forecast:** The Monte Carlo simulation uses different spike probabilities for quarter-end vs non-quarter-end days, making the projections more realistic.

### 4. Log-Normal Distribution (B2B Spike Sizes)

**What it is:** When a B2B order does come in, how big is it? We need a mathematical model for this to run simulations. The spike sizes are **right-skewed** — most spikes are in the 200-800 unit range, but some are much larger (up to 2,500). This is typical of order sizes.

A **log-normal distribution** is the standard model for right-skewed positive data. It's called "log-normal" because if you take the logarithm of the data, it becomes normally distributed.

**How we fit it:** Take the log of all spike sizes, compute the mean and standard deviation of those log-values, and those are the distribution parameters (μ and σ).

**The KS (Kolmogorov-Smirnov) test** checks how well the fitted distribution matches the observed data. It measures the maximum gap between the theoretical and observed cumulative distributions. A p-value above 0.05 means we can't reject the fit — the log-normal is a reasonable model for the data. Our p-value of ~0.52 is well above that threshold, indicating a good fit.

**How to read the spike size plot:** The histogram shows the observed distribution of spike sizes. The orange line shows the fitted log-normal curve. They should roughly match — the curve is the mathematical model we'll use in simulations.

### 5. Monte Carlo Simulation (B2B Projection)

**What it is:** Monte Carlo simulation generates thousands of possible futures and looks at the distribution of outcomes. Named after the casino — you're essentially "rolling the dice" many times.

**How it works for our B2B forecast:**

For each of 1,000 simulations, we simulate 180 days:
1. For each day, check: is this a quarter-end window day?
2. Draw a random number. If it's below the spike probability (17.8% for quarter-end, 7.5% for other days), this day has an order.
3. If there's an order, draw the order size from the fitted log-normal distribution.
4. Sum up all units across 180 days — that's one simulation's total.

After 1,000 runs, we have 1,000 possible 6-month totals. We look at the distribution:

- **P10 (~9,551 units):** Only 10% of simulations had fewer units than this. This is the "optimistic" scenario — few, small orders. You'd want at least this much inventory.
- **P50 (~14,437 units):** The median — half of simulations were above, half below. This is the "expected" level. Your best single-number guess for B2B volume.
- **P90 (~20,062 units):** Only 10% of simulations had more units than this. This is the "plan for the worst" level. If you stock to P90, you'll have enough inventory 90% of the time.

**Why 1,000 simulations is enough:** With 1,000 runs, the P50 is stable — running it again with a different seed changes the number by less than 5%. More simulations would give marginally tighter estimates, but 1,000 is standard for this kind of analysis.

**How to read the Monte Carlo histogram:** Each bar represents how many of the 1,000 simulations produced a total in that range. The green dotted line is P10 (left tail), the orange solid line is P50 (center), and the red dotted line is P90 (right tail). The width of the distribution shows B2B's inherent unpredictability.

---

## How to Read the Combined Inventory Recommendation

The final output is a month-by-month table and stacked bar chart combining both channels:

| Column | What It Means |
|--------|--------------|
| D2C | Prophet's predicted total units for that month |
| B2B (P50) | Expected B2B volume — what you'd plan for in a "normal" scenario |
| B2B (P90) | High-end B2B volume — what you'd plan for to avoid stockouts 90% of the time |
| Total Base | D2C + B2B P50 — your baseline inventory order |
| Total Safe | D2C + B2B P90 — your safety-stock inventory order |

**The gap between Total Base and Total Safe is your safety stock buffer.** This is the extra inventory you carry as insurance against unexpectedly large B2B orders. Over 6 months, this buffer is ~5,600 units.

**How to use this in practice:**
- Order inventory to the **Total Base** level if you're optimizing for capital efficiency and can tolerate occasional stockouts
- Order to the **Total Safe** level if customer fulfillment is the priority and you can absorb the carrying cost of extra inventory
- The right answer depends on Nomatic's margins, storage costs, and how much a missed wholesale order costs in relationship damage

In the stacked bar chart:
- Blue bars are D2C (predictable, from Prophet)
- Solid orange bars are B2B P50 (expected)
- Light/dashed orange on top is the extra safety stock needed to reach P90
- The bold numbers above each bar show the P90 total

---

## The Recommendation

This analysis delivers a framework, not just a number:

> **D2C demand is predictable and growing.** Prophet captures the weekly and annual patterns with 13% MAPE. The 6-month forecast shows ~28,500 D2C units with continued upward growth.

> **B2B demand is inherently unpredictable, but not random.** Orders cluster at quarter-ends (2.4x more likely), follow a log-normal size distribution, and can be bounded probabilistically. The 6-month range is 9,500-20,000 units depending on how many wholesale orders materialize.

> **Plan inventory to the P90 combined level (~48,500 units over 6 months) to avoid stockouts with 90% confidence.** The ~5,600-unit safety buffer above the P50 baseline is the cost of reliability.

This is the kind of analysis that turns "how much inventory do we need?" from a guess into a data-driven decision with explicit risk trade-offs.
