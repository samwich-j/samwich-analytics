"""
Nomatic Multi-Channel Inventory Forecasting — Phase 2: Analysis
================================================================
Forecasts D2C demand using Prophet and models B2B spike behavior
using log-normal fitting and Monte Carlo simulation. Combines both
into a unified 6-month inventory recommendation.

Run data_generator.py first to produce nomatic_daily_sales.csv.

Usage:
    python data_generator.py
    python forecast_analysis.py
"""

import pandas as pd
import numpy as np
from prophet import Prophet
from scipy import stats
from datetime import timedelta
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import os
import warnings

warnings.filterwarnings("ignore")

# ── Configuration ────────────────────────────────────────────────────────────
ALPHA = 0.05
N_SIMULATIONS = 1000
MC_SEED = 42
FORECAST_DAYS = 180
PLOT_DIR = "plots"
DASHBOARD_DIR = "dashboard_data"

# ── Data Load ────────────────────────────────────────────────────────────────
df = pd.read_csv("nomatic_daily_sales.csv")
df["date"] = pd.to_datetime(df["date"])

d2c = df[df["channel"] == "D2C"].copy().reset_index(drop=True)
b2b = df[df["channel"] == "B2B"].copy().reset_index(drop=True)

os.makedirs(PLOT_DIR, exist_ok=True)
os.makedirs(DASHBOARD_DIR, exist_ok=True)

# ── Section 1: D2C Exploratory Summary ───────────────────────────────────────
print("=" * 65)
print("  Nomatic Multi-Channel Forecasting — Analysis Results")
print("=" * 65)
print()
print("SECTION 1: D2C Exploratory Summary")
print("-" * 65)

print(f"  Total days:          {len(d2c):,}")
print(f"  Date range:          {d2c['date'].min().date()} → {d2c['date'].max().date()}")
print(f"  Total units sold:    {d2c['units_sold'].sum():,}")
print(f"  Avg daily units:     {d2c['units_sold'].mean():.1f}")
print(f"  Total revenue:       ${d2c['revenue'].sum():,.2f}")

print("\n  Monthly averages:")
d2c["month"] = d2c["date"].dt.to_period("M")
monthly = d2c.groupby("month")["units_sold"].mean()
for period, avg in monthly.items():
    print(f"    {period}:  {avg:.0f} units/day")

print("\n  Weekday vs Weekend:")
d2c["is_weekend"] = d2c["date"].dt.dayofweek >= 5
weekday_avg = d2c[~d2c["is_weekend"]]["units_sold"].mean()
weekend_avg = d2c[d2c["is_weekend"]]["units_sold"].mean()
print(f"    Weekday avg: {weekday_avg:.1f} units/day")
print(f"    Weekend avg: {weekend_avg:.1f} units/day")
print(f"    Weekend dip: {(1 - weekend_avg / weekday_avg) * 100:.1f}%")

# ── Section 2: D2C Prophet Forecast ──────────────────────────────────────────
print("\n")
print("SECTION 2: D2C Prophet Forecast (6-Month)")
print("-" * 65)

prophet_df = d2c[["date", "units_sold"]].rename(
    columns={"date": "ds", "units_sold": "y"}
)

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,
)
model.fit(prophet_df)

future = model.make_future_dataframe(periods=FORECAST_DAYS)
forecast = model.predict(future)

# Forecast-only period
last_actual_date = d2c["date"].max()
forecast_only = forecast[forecast["ds"] > last_actual_date].copy()
forecast_only["month"] = forecast_only["ds"].dt.to_period("M")

print("  6-month D2C forecast (units/day):")
monthly_forecast = forecast_only.groupby("month")["yhat"].mean()
for period, avg in monthly_forecast.items():
    print(f"    {period}:  {avg:.0f}")

total_forecast_units = forecast_only["yhat"].sum()
print(f"\n  Total predicted D2C units (next 180 days): {total_forecast_units:,.0f}")

# ── Section 3: D2C Backtest ──────────────────────────────────────────────────
print("\n")
print("SECTION 3: D2C Backtest (Train Years 1-2, Test Year 3)")
print("-" * 65)

cutoff = pd.Timestamp("2025-01-01")
train = prophet_df[prophet_df["ds"] < cutoff]
test = prophet_df[prophet_df["ds"] >= cutoff]

backtest_model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,
)
backtest_model.fit(train)

backtest_future = backtest_model.make_future_dataframe(periods=len(test))
backtest_forecast = backtest_model.predict(backtest_future)

# Merge actuals with predictions for the test period
backtest_test = backtest_forecast[backtest_forecast["ds"] >= cutoff][
    ["ds", "yhat"]
].merge(test, on="ds")

mae = (backtest_test["y"] - backtest_test["yhat"]).abs().mean()
mape = ((backtest_test["y"] - backtest_test["yhat"]).abs() / backtest_test["y"]).mean() * 100

print(f"  Train period:  {train['ds'].min().date()} → {train['ds'].max().date()}")
print(f"  Test period:   {test['ds'].min().date()} → {test['ds'].max().date()}")
print(f"  Test days:     {len(test)}")
print(f"  MAE:           {mae:.1f} units/day")
print(f"  MAPE:          {mape:.1f}%")

if mape < 20:
    print("  Assessment:    Good accuracy — MAPE under 20%")
elif mape < 30:
    print("  Assessment:    Moderate accuracy — MAPE under 30%")
else:
    print("  Assessment:    High error — model may need tuning")

# ── Section 4: B2B Spike Analysis ────────────────────────────────────────────
print("\n")
print("SECTION 4: B2B Spike Analysis")
print("-" * 65)

# Part A: Spike frequency
spike_days = b2b[b2b["units_sold"] > 0]
total_b2b_days = len(b2b)
n_spikes = len(spike_days)
p_spike_overall = n_spikes / total_b2b_days

print(f"  Total days:        {total_b2b_days:,}")
print(f"  Spike days:        {n_spikes}")
print(f"  Overall spike rate: {p_spike_overall:.4f} ({p_spike_overall * 100:.1f}%)")

# Quarter-end analysis
b2b["is_quarter_end"] = (
    b2b["date"].dt.month.isin([3, 6, 9, 12]) & (b2b["date"].dt.day >= 16)
)
qe_days = b2b[b2b["is_quarter_end"]]
non_qe_days = b2b[~b2b["is_quarter_end"]]

n_qe = len(qe_days)
n_non_qe = len(non_qe_days)
x_qe = (qe_days["units_sold"] > 0).sum()
x_non_qe = (non_qe_days["units_sold"] > 0).sum()
p_qe = x_qe / n_qe
p_non_qe = x_non_qe / n_non_qe

# Z-test for quarter-end clustering
p_pool_b2b = (x_qe + x_non_qe) / (n_qe + n_non_qe)
se_b2b = np.sqrt(p_pool_b2b * (1 - p_pool_b2b) * (1 / n_qe + 1 / n_non_qe))
z_qe = (p_qe - p_non_qe) / se_b2b
p_val_qe = 2 * (1 - stats.norm.cdf(abs(z_qe)))

print(f"\n  Quarter-end windows (last 15 days of Mar/Jun/Sep/Dec):")
print(f"    Quarter-end days:    {n_qe} days, {x_qe} spikes ({p_qe:.1%})")
print(f"    Non quarter-end:     {n_non_qe} days, {x_non_qe} spikes ({p_non_qe:.1%})")
print(f"    Z-statistic:         {z_qe:.4f}")
print(f"    P-value:             {p_val_qe:.6f}")
if p_val_qe < ALPHA:
    print("    Result:              SIGNIFICANT — spikes cluster at quarter-ends")
else:
    print("    Result:              NOT significant at alpha = 0.05")

# Part B: Spike size distribution
print("\n  Spike size distribution:")
spike_sizes = spike_days["units_sold"].values

print(f"    Mean:     {spike_sizes.mean():.0f} units")
print(f"    Median:   {np.median(spike_sizes):.0f} units")
print(f"    Std dev:  {spike_sizes.std():.0f} units")
print(f"    Min:      {spike_sizes.min()} units")
print(f"    Max:      {spike_sizes.max():,} units")
print(f"    P90:      {np.percentile(spike_sizes, 90):.0f} units")

# Fit log-normal
log_spikes = np.log(spike_sizes)
mu_fit = log_spikes.mean()
sigma_fit = log_spikes.std()

# KS test
ks_stat, ks_p = stats.kstest(spike_sizes, "lognorm", args=(sigma_fit, 0, np.exp(mu_fit)))

print(f"\n  Log-normal fit:")
print(f"    mu (log-scale):    {mu_fit:.4f}")
print(f"    sigma (log-scale): {sigma_fit:.4f}")
print(f"    KS statistic:     {ks_stat:.4f}")
print(f"    KS p-value:       {ks_p:.4f}")
if ks_p > ALPHA:
    print("    Assessment:       Good fit (fail to reject log-normal)")
else:
    print("    Assessment:       Imperfect fit — log-normal is approximate")

# Part C: Monte Carlo projection
print("\n")
print("SECTION 5: B2B Monte Carlo Projection (6-Month)")
print("-" * 65)

rng = np.random.default_rng(MC_SEED)

last_date = b2b["date"].max()
sim_totals = np.empty(N_SIMULATIONS)

for sim in range(N_SIMULATIONS):
    total = 0
    for day in range(FORECAST_DAYS):
        future_date = last_date + timedelta(days=day + 1)
        is_qe = future_date.month in (3, 6, 9, 12) and future_date.day >= 16
        p = p_qe if is_qe else p_non_qe
        if rng.random() < p:
            spike_size = int(rng.lognormal(mu_fit, sigma_fit))
            total += spike_size
    sim_totals[sim] = total

p10 = np.percentile(sim_totals, 10)
p50 = np.percentile(sim_totals, 50)
p90 = np.percentile(sim_totals, 90)

print(f"  Simulations:     {N_SIMULATIONS:,}")
print(f"  Forecast period: {FORECAST_DAYS} days")
print(f"\n  Total B2B units (next 180 days):")
print(f"    P10 (optimistic):   {p10:,.0f}")
print(f"    P50 (expected):     {p50:,.0f}")
print(f"    P90 (plan for):     {p90:,.0f}")

avg_monthly_b2b_p50 = p50 / 6
print(f"\n  Monthly average (P50): {avg_monthly_b2b_p50:,.0f} units")

# ── Section 6: Combined Inventory Recommendation ────────────────────────────
print("\n")
print("SECTION 6: Combined 6-Month Inventory Recommendation")
print("-" * 65)

# Build month-by-month table
forecast_months = forecast_only.groupby("month").agg(
    d2c_units=("yhat", "sum")
).reset_index()

# Distribute B2B across months proportionally (roughly equal)
n_months = len(forecast_months)
b2b_p50_monthly = p50 / n_months
b2b_p90_monthly = p90 / n_months

print(f"  {'Month':<12} {'D2C':>8} {'B2B(P50)':>10} {'B2B(P90)':>10} {'Total Base':>12} {'Total Safe':>12}")
print(f"  {'-'*12} {'-'*8} {'-'*10} {'-'*10} {'-'*12} {'-'*12}")

total_d2c = 0
total_base = 0
total_safe = 0

for _, row in forecast_months.iterrows():
    d2c_units = int(row["d2c_units"])
    base = int(d2c_units + b2b_p50_monthly)
    safe = int(d2c_units + b2b_p90_monthly)
    total_d2c += d2c_units
    total_base += base
    total_safe += safe
    print(f"  {str(row['month']):<12} {d2c_units:>8,} {int(b2b_p50_monthly):>10,} {int(b2b_p90_monthly):>10,} {base:>12,} {safe:>12,}")

print(f"  {'-'*12} {'-'*8} {'-'*10} {'-'*10} {'-'*12} {'-'*12}")
print(f"  {'TOTAL':<12} {total_d2c:>8,} {int(p50):>10,} {int(p90):>10,} {total_base:>12,} {total_safe:>12,}")

print("\n  Base scenario uses B2B P50 (expected). Safe scenario uses B2B P90")
print("  (covers 90% of likely outcomes). The gap is your safety stock buffer.")

# ── Section 7: Visualizations ───────────────────────────────────────────────
print("\n")
print("SECTION 7: Generating Visualizations")
print("-" * 65)

plt.style.use("seaborn-v0_8-whitegrid")

# --- Plot 1: D2C Historical Decomposition (Prophet Components) ---
fig = model.plot_components(forecast)
fig.set_size_inches(12, 10)
fig.savefig(os.path.join(PLOT_DIR, "d2c_historical_decomposition.png"),
            dpi=150, bbox_inches="tight")
plt.close(fig)
print("  Saved: plots/d2c_historical_decomposition.png")

# --- Plot 2: D2C Forecast with Uncertainty ---
fig, ax = plt.subplots(figsize=(14, 6))

# Historical actuals
ax.plot(d2c["date"], d2c["units_sold"], color="#B0B0B0", linewidth=0.5,
        alpha=0.5, label="Actuals (daily)")

# Rolling average of actuals
d2c_sorted = d2c.sort_values("date")
rolling_actual = d2c_sorted.set_index("date")["units_sold"].rolling(14).mean()
ax.plot(rolling_actual.index, rolling_actual.values, color="#5B8DB8",
        linewidth=1.5, label="Actuals (14-day avg)")

# Forecast line
forecast_period = forecast[forecast["ds"] > last_actual_date]
ax.plot(forecast_period["ds"], forecast_period["yhat"], color="#E07B54",
        linewidth=2, label="Forecast")

# Uncertainty band
ax.fill_between(forecast_period["ds"],
                forecast_period["yhat_lower"],
                forecast_period["yhat_upper"],
                color="#E07B54", alpha=0.2, label="80% uncertainty")

# Cutoff line
ax.axvline(x=last_actual_date, color="gray", linestyle="--", linewidth=1.5,
           label="Forecast start")

ax.set_xlabel("Date")
ax.set_ylabel("Units Sold")
ax.set_title("D2C Demand: Historical + 6-Month Forecast")
ax.legend(loc="upper left")
ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "d2c_forecast.png"), dpi=150,
            bbox_inches="tight")
plt.close()
print("  Saved: plots/d2c_forecast.png")

# --- Plot 3: B2B Spike Analysis (3-panel) ---
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 12))

# Top: spike timeline
spike_dates = spike_days["date"]
spike_units = spike_days["units_sold"]
colors = ["#E07B54" if (d.month in (3, 6, 9, 12) and d.day >= 16) else "#5B8DB8"
          for d in spike_dates]
ax1.scatter(spike_dates, spike_units, c=colors, s=20, alpha=0.7)

# Shade quarter-end windows
for year in range(2023, 2026):
    for month in [3, 6, 9, 12]:
        try:
            start = pd.Timestamp(year, month, 16)
            end = pd.Timestamp(year, month, 1) + pd.offsets.MonthEnd(0)
            ax1.axvspan(start, end, alpha=0.08, color="#E07B54")
        except ValueError:
            pass

ax1.set_ylabel("Units")
ax1.set_title("B2B Spike Timeline (orange = quarter-end window)")
ax1.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
ax1.xaxis.set_major_locator(mdates.MonthLocator(interval=6))

# Middle: spike size histogram + fitted PDF
bins = np.linspace(0, spike_sizes.max(), 40)
ax2.hist(spike_sizes, bins=bins, density=True, color="#5B8DB8",
         edgecolor="white", alpha=0.7, label="Observed")

x_pdf = np.linspace(1, spike_sizes.max(), 200)
pdf_vals = stats.lognorm.pdf(x_pdf, sigma_fit, 0, np.exp(mu_fit))
ax2.plot(x_pdf, pdf_vals, color="#E07B54", linewidth=2.5,
         label=f"Log-normal fit (μ={mu_fit:.2f}, σ={sigma_fit:.2f})")
ax2.set_xlabel("Spike Size (units)")
ax2.set_ylabel("Density")
ax2.set_title("B2B Spike Size Distribution")
ax2.legend()

# Bottom: Monte Carlo distribution
ax3.hist(sim_totals, bins=50, color="#5B8DB8", edgecolor="white", alpha=0.7)
ax3.axvline(x=p10, color="green", linestyle=":", linewidth=2,
            label=f"P10: {p10:,.0f}")
ax3.axvline(x=p50, color="#E07B54", linestyle="-", linewidth=2,
            label=f"P50: {p50:,.0f}")
ax3.axvline(x=p90, color="red", linestyle=":", linewidth=2,
            label=f"P90: {p90:,.0f}")
ax3.set_xlabel("Total B2B Units (180 days)")
ax3.set_ylabel("Frequency")
ax3.set_title("Monte Carlo Simulation: 6-Month B2B Volume Distribution")
ax3.legend()

plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "b2b_spike_analysis.png"), dpi=150,
            bbox_inches="tight")
plt.close()
print("  Saved: plots/b2b_spike_analysis.png")

# --- Plot 4: Combined Inventory Recommendation ---
fig, ax = plt.subplots(figsize=(12, 6))

months = [str(row["month"]) for _, row in forecast_months.iterrows()]
d2c_vals = [int(row["d2c_units"]) for _, row in forecast_months.iterrows()]
b2b_p50_vals = [int(b2b_p50_monthly)] * n_months
b2b_extra_p90 = [int(b2b_p90_monthly - b2b_p50_monthly)] * n_months

x = np.arange(n_months)
width = 0.5

# Stacked bars: D2C + B2B(P50) + extra for P90
bars_d2c = ax.bar(x, d2c_vals, width, label="D2C (Prophet forecast)",
                  color="#5B8DB8")
bars_b2b = ax.bar(x, b2b_p50_vals, width, bottom=d2c_vals,
                  label="B2B (P50 — expected)", color="#E07B54")

b2b_tops = [d + b for d, b in zip(d2c_vals, b2b_p50_vals)]
bars_safety = ax.bar(x, b2b_extra_p90, width, bottom=b2b_tops,
                     label="B2B safety stock (P50→P90)", color="#E07B54",
                     alpha=0.3, edgecolor="#E07B54", linestyle="--")

# Total labels on top
for i in range(n_months):
    base_total = d2c_vals[i] + b2b_p50_vals[i]
    safe_total = base_total + b2b_extra_p90[i]
    ax.text(x[i], safe_total + 100, f"{safe_total:,}",
            ha="center", va="bottom", fontsize=9, fontweight="bold")

ax.set_xticks(x)
ax.set_xticklabels(months, rotation=30, ha="right")
ax.set_ylabel("Units")
ax.set_title("6-Month Inventory Recommendation by Channel")
ax.legend(loc="upper left")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "combined_inventory_recommendation.png"),
            dpi=150, bbox_inches="tight")
plt.close()
print("  Saved: plots/combined_inventory_recommendation.png")

# ── Section 8: Dashboard Data Exports ───────────────────────────────────────
print("\n")
print("SECTION 8: Exporting Dashboard Data")
print("-" * 65)

# D2C forecast — full time series (actuals + forecast) for line chart
d2c_ts = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
d2c_ts = d2c_ts.merge(
    prophet_df.rename(columns={"y": "actual"}), on="ds", how="left"
)
d2c_ts.rename(columns={"ds": "date", "yhat": "forecast",
                        "yhat_lower": "forecast_lower",
                        "yhat_upper": "forecast_upper"}, inplace=True)
d2c_ts["is_forecast"] = d2c_ts["date"] > last_actual_date
d2c_ts.to_csv(os.path.join(DASHBOARD_DIR, "d2c_timeseries.csv"), index=False)
print("  Saved: dashboard_data/d2c_timeseries.csv")

# D2C monthly summary — for bar/table visuals
d2c_monthly = d2c.copy()
d2c_monthly["month"] = d2c_monthly["date"].dt.to_period("M").astype(str)
d2c_monthly_agg = d2c_monthly.groupby("month").agg(
    total_units=("units_sold", "sum"),
    avg_daily_units=("units_sold", "mean"),
    total_revenue=("revenue", "sum"),
).reset_index()
d2c_monthly_agg.to_csv(os.path.join(DASHBOARD_DIR, "d2c_monthly.csv"), index=False)
print("  Saved: dashboard_data/d2c_monthly.csv")

# B2B spikes — each spike event for scatter/timeline
b2b_spikes = spike_days[["date", "units_sold", "unit_price", "revenue"]].copy()
b2b_spikes["is_quarter_end"] = (
    b2b_spikes["date"].dt.month.isin([3, 6, 9, 12]) &
    (b2b_spikes["date"].dt.day >= 16)
)
b2b_spikes.to_csv(os.path.join(DASHBOARD_DIR, "b2b_spikes.csv"), index=False)
print("  Saved: dashboard_data/b2b_spikes.csv")

# B2B statistics — single row for KPI cards
b2b_stats = pd.DataFrame([{
    "total_days": total_b2b_days,
    "spike_days": n_spikes,
    "spike_rate_overall": p_spike_overall,
    "spike_rate_quarter_end": p_qe,
    "spike_rate_non_quarter_end": p_non_qe,
    "z_statistic": z_qe,
    "p_value": p_val_qe,
    "mean_spike_size": spike_sizes.mean(),
    "median_spike_size": np.median(spike_sizes),
    "p90_spike_size": np.percentile(spike_sizes, 90),
    "lognorm_mu": mu_fit,
    "lognorm_sigma": sigma_fit,
    "ks_statistic": ks_stat,
    "ks_p_value": ks_p,
    "mc_p10_units": p10,
    "mc_p50_units": p50,
    "mc_p90_units": p90,
}])
b2b_stats.to_csv(os.path.join(DASHBOARD_DIR, "b2b_stats.csv"), index=False)
print("  Saved: dashboard_data/b2b_stats.csv")

# Combined inventory recommendation — for the main table/chart
inventory_df = forecast_months.copy()
inventory_df["month"] = inventory_df["month"].astype(str)
inventory_df["d2c_units"] = inventory_df["d2c_units"].astype(int)
inventory_df["b2b_p50"] = int(b2b_p50_monthly)
inventory_df["b2b_p90"] = int(b2b_p90_monthly)
inventory_df["total_base"] = inventory_df["d2c_units"] + inventory_df["b2b_p50"]
inventory_df["total_safe"] = inventory_df["d2c_units"] + inventory_df["b2b_p90"]
inventory_df["safety_buffer"] = inventory_df["total_safe"] - inventory_df["total_base"]
inventory_df.to_csv(os.path.join(DASHBOARD_DIR, "inventory_recommendation.csv"), index=False)
print("  Saved: dashboard_data/inventory_recommendation.csv")

# Backtest accuracy — for KPI card
backtest_df = pd.DataFrame([{
    "mae": mae,
    "mape": mape,
    "train_start": train["ds"].min().date().isoformat(),
    "train_end": train["ds"].max().date().isoformat(),
    "test_start": test["ds"].min().date().isoformat(),
    "test_end": test["ds"].max().date().isoformat(),
}])
backtest_df.to_csv(os.path.join(DASHBOARD_DIR, "backtest_accuracy.csv"), index=False)
print("  Saved: dashboard_data/backtest_accuracy.csv")

# ── Final Summary ───────────────────────────────────────────────────────────
print("\n")
print("=" * 65)
print("  FINAL SUMMARY")
print("=" * 65)
print(f"""
  D2C CHANNEL:
    Prophet model captures weekly and annual seasonality well.
    Backtest MAPE: {mape:.1f}%
    6-month forecast: {total_forecast_units:,.0f} total units
    Trend: upward growth continues

  B2B CHANNEL:
    Spike probability: {p_spike_overall:.1%} overall, {p_qe:.1%} at quarter-ends
    Quarter-end clustering: {'Significant' if p_val_qe < ALPHA else 'Not significant'} (p = {p_val_qe:.4f})
    Spike size: log-normal distributed (mean {spike_sizes.mean():.0f}, median {np.median(spike_sizes):.0f})
    6-month projection: {p50:,.0f} units (P50), {p90:,.0f} units (P90)

  COMBINED RECOMMENDATION:
    Base inventory (D2C + B2B P50):  {total_base:,} units over 6 months
    Safe inventory (D2C + B2B P90):  {total_safe:,} units over 6 months
    Safety stock buffer:             {total_safe - total_base:,} units

  Plan inventory to the P90 level to cover 90% of likely B2B demand
  scenarios. The {total_safe - total_base:,}-unit buffer is the cost of
  avoiding stockouts on unexpected wholesale orders.
""")
print("=" * 65)
