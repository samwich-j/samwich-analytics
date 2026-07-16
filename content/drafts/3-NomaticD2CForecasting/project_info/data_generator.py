"""
Nomatic Multi-Channel Inventory Forecasting — Phase 1: Data Generation
=======================================================================
Generates 3 years of daily sales data across two channels:

  D2C (Direct-to-Consumer):
    - Strong weekly seasonality (weekday > weekend)
    - Strong annual seasonality (holiday spikes in Nov/Dec, summer bump, Jan dip)
    - Upward growth trend over 3 years
    - Moderate daily noise

  B2B (Wholesale):
    - Erratic, large-volume spikes (simulating bulk purchase orders)
    - Most days have zero or near-zero volume
    - Spikes cluster slightly around quarter-ends (restock cycles)
    - No smooth seasonality — intentionally volatile

Output: nomatic_daily_sales.csv
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# ── Configuration ────────────────────────────────────────────────────────────
SEED = 99
START_DATE = datetime(2023, 1, 1)
YEARS = 3
TOTAL_DAYS = YEARS * 365

# D2C parameters
D2C_BASE_UNITS = 120            # average daily units at start
D2C_GROWTH_RATE = 0.0003        # daily compound growth factor
D2C_UNIT_PRICE_MEAN = 45.0      # average price per unit
D2C_UNIT_PRICE_STD = 8.0

# B2B parameters
B2B_SPIKE_PROBABILITY = 0.08    # ~8% of days have an order
B2B_SPIKE_UNITS_MIN = 200
B2B_SPIKE_UNITS_MAX = 2500
B2B_UNIT_PRICE_MEAN = 32.0      # wholesale discount
B2B_UNIT_PRICE_STD = 5.0
B2B_QUARTER_END_BOOST = 0.18    # higher spike probability near quarter-end

# ── Generation ───────────────────────────────────────────────────────────────
np.random.seed(SEED)

dates = [START_DATE + timedelta(days=i) for i in range(TOTAL_DAYS)]
records = []

for i, date in enumerate(dates):
    day_of_week = date.weekday()   # 0=Mon, 6=Sun
    month = date.month
    day_of_month = date.day

    # ─── D2C Channel ─────────────────────────────────────────────────────
    # Growth trend
    trend = D2C_BASE_UNITS * (1 + D2C_GROWTH_RATE) ** i

    # Weekly seasonality: weekdays stronger, weekend dip
    weekly_factor = 1.0
    if day_of_week == 5:      # Saturday
        weekly_factor = 0.72
    elif day_of_week == 6:    # Sunday
        weekly_factor = 0.65
    elif day_of_week == 0:    # Monday (recovery)
        weekly_factor = 1.08

    # Annual seasonality
    annual_factor = 1.0
    if month == 1:
        annual_factor = 0.70   # post-holiday slump
    elif month == 2:
        annual_factor = 0.78
    elif month in (6, 7):
        annual_factor = 1.15   # summer travel season bump
    elif month == 10:
        annual_factor = 1.10   # pre-holiday ramp
    elif month == 11:
        annual_factor = 1.55   # Black Friday / holiday shopping
        if 24 <= day_of_month <= 30:
            annual_factor = 2.20  # Black Friday week spike
    elif month == 12:
        annual_factor = 1.80   # peak holiday
        if day_of_month >= 20:
            annual_factor = 1.30  # post-shipping-cutoff drop

    # Daily noise
    noise = np.random.normal(1.0, 0.12)

    d2c_units = max(0, int(trend * weekly_factor * annual_factor * noise))
    d2c_price = round(max(15, np.random.normal(D2C_UNIT_PRICE_MEAN, D2C_UNIT_PRICE_STD)), 2)
    d2c_revenue = round(d2c_units * d2c_price, 2)

    # ─── B2B Channel ─────────────────────────────────────────────────────
    # Quarter-end boost: last 15 days of Mar, Jun, Sep, Dec
    is_quarter_end_window = (
        (month in (3, 6, 9, 12)) and (day_of_month >= 16)
    )
    spike_prob = B2B_QUARTER_END_BOOST if is_quarter_end_window else B2B_SPIKE_PROBABILITY

    has_order = np.random.random() < spike_prob

    if has_order:
        # Log-normal spike size for realistic heavy-tail distribution
        log_units = np.random.uniform(
            np.log(B2B_SPIKE_UNITS_MIN), np.log(B2B_SPIKE_UNITS_MAX)
        )
        b2b_units = int(np.exp(log_units))
        b2b_price = round(max(18, np.random.normal(B2B_UNIT_PRICE_MEAN, B2B_UNIT_PRICE_STD)), 2)
    else:
        b2b_units = 0
        b2b_price = 0.0

    b2b_revenue = round(b2b_units * b2b_price, 2)

    # ─── Combined Record ─────────────────────────────────────────────────
    records.append({
        "date": date.strftime("%Y-%m-%d"),
        "day_of_week": date.strftime("%A"),
        "channel": "D2C",
        "units_sold": d2c_units,
        "unit_price": d2c_price,
        "revenue": d2c_revenue,
    })
    records.append({
        "date": date.strftime("%Y-%m-%d"),
        "day_of_week": date.strftime("%A"),
        "channel": "B2B",
        "units_sold": b2b_units,
        "unit_price": b2b_price,
        "revenue": b2b_revenue,
    })

# ── Build DataFrame & Save ───────────────────────────────────────────────────
df = pd.DataFrame(records)

print("=" * 60)
print("Nomatic Inventory Forecasting — Data Generation Summary")
print("=" * 60)
print(f"Total rows:    {len(df):,} ({TOTAL_DAYS:,} days × 2 channels)")
print(f"Date range:    {df['date'].min()} → {df['date'].max()}")
print()

for ch in ["D2C", "B2B"]:
    subset = df[df["channel"] == ch]
    active_days = subset[subset["units_sold"] > 0]
    print(f"  {ch}:")
    print(f"    Active selling days: {len(active_days):,} / {len(subset):,}")
    print(f"    Total units sold:    {subset['units_sold'].sum():,}")
    print(f"    Total revenue:       ${subset['revenue'].sum():,.2f}")
    print(f"    Avg daily units:     {subset['units_sold'].mean():.1f}")
    if ch == "B2B":
        spikes = subset[subset["units_sold"] > 0]
        print(f"    Spike days:          {len(spikes):,}")
        print(f"    Avg spike size:      {spikes['units_sold'].mean():.0f} units")
    print()

output_path = "nomatic_daily_sales.csv"
df.to_csv(output_path, index=False)
print(f"Data saved to: {output_path}")
print(f"\nD2C Preview (first 5 days):")
print(df[df["channel"] == "D2C"].head(5).to_string(index=False))
print(f"\nB2B Preview (first spike days):")
print(df[(df["channel"] == "B2B") & (df["units_sold"] > 0)].head(5).to_string(index=False))
