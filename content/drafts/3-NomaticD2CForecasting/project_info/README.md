# Nomatic Multi-Channel Inventory Forecasting

A demand forecasting and inventory planning analysis for [Nomatic](https://www.nomatic.com/), a premium travel bag and gear brand. This project tackles the challenge of forecasting inventory needs when your two sales channels — D2C and B2B — behave completely differently.

## The Problem

D2C sales are smooth and seasonal — predictable with standard time-series methods. B2B wholesale orders are erratic: most days have zero volume, then a retailer suddenly orders 1,500 units. A single forecast model can't handle both. This analysis uses **different strategies for each channel** and combines them into a unified inventory recommendation with explicit risk trade-offs.

## Key Findings

- **D2C forecast** — Prophet captures weekly + annual seasonality with 13.3% MAPE; 6-month projection: ~28,500 units with continued growth
- **B2B orders cluster at quarter-ends** — 17.8% spike rate vs 7.5% otherwise (z = 4.44, p < 0.00001)
- **B2B spike sizes follow a log-normal distribution** — mean 884 units, KS test confirms fit (p = 0.52)
- **6-month B2B projection** — 9,500 units (P10) to 20,000 units (P90) via Monte Carlo simulation
- **Combined inventory recommendation:** ~42,900 units (base) to ~48,500 units (safe) over 6 months

## Visualizations

### D2C Prophet Decomposition
![D2C Decomposition](plots/d2c_historical_decomposition.png)

### D2C Forecast with Uncertainty
![D2C Forecast](plots/d2c_forecast.png)

### B2B Spike Analysis
![B2B Analysis](plots/b2b_spike_analysis.png)

### Combined Inventory Recommendation
![Inventory Recommendation](plots/combined_inventory_recommendation.png)

## Methodology

- **D2C:** Facebook Prophet with weekly + annual seasonality, backtested on held-out year 3
- **B2B:** Log-normal distribution fit for spike sizes, Monte Carlo simulation (1,000 runs) for 6-month projections
- **Combined:** D2C forecast + B2B P50/P90 scenarios for base and safety-stock inventory levels

See [METHODOLOGY.md](METHODOLOGY.md) for a detailed explanation of each method and how to interpret every output.

## How to Run

### Python

```bash
pip install pandas numpy scipy matplotlib prophet

python data_generator.py
python forecast_analysis.py
```

### R Notebook

```r
# Requires: readr, dplyr, ggplot2, prophet, scales, gridExtra
# Open forecast_analysis.Rmd in RStudio and knit to HTML
```

Both produce the same analysis. The Python version saves plots to `plots/` and prints results to the terminal. The R notebook renders as an interactive HTML report.

## Project Structure

```
data_generator.py        — Generates nomatic_daily_sales.csv (3 years, 2 channels)
forecast_analysis.py     — Full Python analysis and visualizations
forecast_analysis.Rmd    — R Notebook version of the same analysis
METHODOLOGY.md           — Plain-English explanation of methods and outputs
plots/                   — Generated visualizations (PNGs)
```

## Dependencies

**Python:** pandas, numpy, scipy, matplotlib, prophet

**R:** readr, dplyr, ggplot2, prophet, scales, gridExtra
