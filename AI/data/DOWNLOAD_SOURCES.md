# Dataset Download Sources & Public Access Instructions

This document provides exact public source URLs, descriptions, and instructions for retrieving or updating the agricultural datasets used by the AI engine.

---

## 1. AGMARKNET Mandi Prices (Daily & Historical)
- **Official Portal**: [https://agmarknet.gov.in](https://agmarknet.gov.in)
- **Open Data Portal**: [https://data.gov.in/dataset-group-name/agmarknet](https://data.gov.in/dataset-group-name/agmarknet)
- **Kaggle Mirror**: `Daily Market Prices of Commodity India (2001–2026)`
- **Download Instructions**:
  1. Visit the Agmarknet custom query page.
  2. Select Commodity (e.g. Tomato, Onion, Potato), State, and Date Range.
  3. Export results to CSV format.
  4. Place files in `Datasets/csv/` or `AI/data/raw/`.

---

## 2. e-NAM Trade Details & Arrivals
- **Official Portal**: [https://enam.gov.in](https://enam.gov.in)
- **Data Sections**: e-NAM Trade Details / APMC Arrivals by Commodity
- **Fields Available**: State, APMC, Commodity, Arrivals (Tonnes), Traded (Tonnes), Min Price, Modal Price, Max Price.

---

## 3. IMD Daily District Rainfall
- **Official Portal**: [https://mausam.imd.gov.in](https://mausam.imd.gov.in) & [https://imdpune.gov.in](https://imdpune.gov.in)
- **iRAINS Portal**: [https://hydro.imd.gov.in/hydrometweb/](https://hydro.imd.gov.in/hydrometweb/)
- **National Water Data Portal**: [https://indiawris.gov.in](https://indiawris.gov.in)
- **Download Instructions**:
  1. Navigate to Rainfall Statistics -> District-wise Daily Rainfall.
  2. Select state, district, and time period.
  3. Download table containing Actual (mm), Normal (mm), and Departure (%).
