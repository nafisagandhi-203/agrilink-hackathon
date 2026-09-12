"""
Synthetic Farmer-Buyer Transaction Dataset Generator.
Generates 10,000 realistic records with grounded price, distance, and grade relationships,
plus calibrated anomalies for anomaly detection training.
"""
import random
import csv
from datetime import datetime, timedelta
from pathlib import Path

def generate_transactions(num_records: int = 10000, output_path: str = None):
    if output_path is None:
        base_dir = Path(__file__).resolve().parent.parent.parent
        output_path = base_dir / "data" / "generated" / "farmer_buyer_transactions.csv"
    else:
        output_path = Path(output_path)
        
    output_path.parent.mkdir(parents=True, exist_ok=True)
    random.seed(42)

    commodities_data = {
        "Tomato": {"base_price": 28.0, "qty_range": (300, 3000), "varieties": ["Local", "Hybrid", "Desi"]},
        "Potato": {"base_price": 22.0, "qty_range": (500, 6000), "varieties": ["Jyoti", "Lauvkar", "Kufri"]},
        "Onion": {"base_price": 30.0, "qty_range": (400, 5000), "varieties": ["Red", "White", "Garhwa"]},
        "Wheat": {"base_price": 25.0, "qty_range": (800, 8000), "varieties": ["Lokwan", "Sharbati", "Kalyan"]},
        "Rice": {"base_price": 36.0, "qty_range": (500, 7000), "varieties": ["Basmati", "Sona Masoori", "Common"]},
        "Cotton": {"base_price": 72.0, "qty_range": (500, 4000), "varieties": ["BT Cotton", "Medium Staple", "Long Staple"]},
        "Mustard": {"base_price": 54.0, "qty_range": (300, 3500), "varieties": ["Black", "Yellow", "Pusa Bold"]},
        "Soyabean": {"base_price": 46.0, "qty_range": (400, 4500), "varieties": ["JS-335", "Yellow", "NRC-37"]}
    }

    districts_dist = {
        ("Rajkot", "Rajkot"): 15.0,
        ("Rajkot", "Gondal"): 40.0,
        ("Rajkot", "Ahmedabad"): 215.0,
        ("Rajkot", "Surat"): 440.0,
        ("Ahmedabad", "Ahmedabad"): 18.0,
        ("Ahmedabad", "Sanand"): 25.0,
        ("Ahmedabad", "Baroda"): 110.0,
        ("Nashik", "Nashik"): 20.0,
        ("Nashik", "Lasalgaon"): 55.0,
        ("Nashik", "Pune"): 210.0,
        ("Pune", "Pune"): 22.0,
        ("Pune", "Baramati"): 100.0,
        ("Indore", "Indore"): 18.0,
        ("Indore", "Ujjain"): 55.0,
        ("Agra", "Agra"): 20.0,
        ("Agra", "Mathura"): 58.0
    }
    
    district_list = ["Rajkot", "Gondal", "Ahmedabad", "Surat", "Nashik", "Lasalgaon", "Pune", "Indore", "Ujjain", "Agra"]

    grades = [
        ("Grade A", 1.08, 0.40),
        ("Grade B", 1.00, 0.45),
        ("Grade C", 0.88, 0.15)
    ]

    start_date = datetime(2025, 1, 1)
    rows = []

    for i in range(1, num_records + 1):
        tx_id = f"TX-{i:06d}"
        farmer_id = f"FARMER-{random.randint(100, 999)}"
        buyer_id = f"BUYER-{random.randint(50, 250)}"
        
        commodity = random.choice(list(commodities_data.keys()))
        c_info = commodities_data[commodity]
        variety = random.choice(c_info["varieties"])
        
        # Grade sampling
        rand_g = random.random()
        if rand_g < 0.40:
            grade, grade_mult = "Grade A", 1.08
        elif rand_g < 0.85:
            grade, grade_mult = "Grade B", 1.00
        else:
            grade, grade_mult = "Grade C", 0.88

        # Quantity
        min_q, max_q = c_info["qty_range"]
        quantity = round(random.uniform(min_q, max_q), 0)

        # District & distance
        farmer_dist = random.choice(district_list)
        buyer_dist = random.choice(district_list)
        dist_key = (farmer_dist, buyer_dist)
        if dist_key in districts_dist:
            distance_km = round(districts_dist[dist_key] + random.uniform(-5, 5), 1)
        elif (buyer_dist, farmer_dist) in districts_dist:
            distance_km = round(districts_dist[(buyer_dist, farmer_dist)] + random.uniform(-5, 5), 1)
        else:
            distance_km = round(random.uniform(30, 250), 1)

        # Baseline market price with seasonal jitter
        day_offset = random.randint(0, 400)
        tx_date = start_date + timedelta(days=day_offset)
        seasonal_factor = 1.0 + 0.12 * (0.5 - random.random())
        market_price = round(c_info["base_price"] * seasonal_factor * grade_mult, 2)

        # Normal offered price
        distance_factor = max(0.95, 1.0 - (distance_km / 1000.0) * 0.05)
        normal_offer = market_price * distance_factor * random.uniform(0.97, 1.06)
        
        # Controlled Anomaly injection (~4.5% rate)
        is_anomaly = False
        anomaly_type = "NORMAL"
        rand_anom = random.random()
        
        if rand_anom < 0.02:  # Extreme lowball offer
            offered_price = round(market_price * random.uniform(0.35, 0.60), 2)
            final_price = offered_price
            payment_status = "PENDING"
            tx_status = "REJECTED"
            is_anomaly = True
            anomaly_type = "EXTREME_LOW_OFFER"
        elif rand_anom < 0.035:  # Suspiciously high offer (possible fraud bait)
            offered_price = round(market_price * random.uniform(1.50, 1.95), 2)
            final_price = offered_price
            payment_status = random.choice(["DEFAULTED", "DISPUTED"])
            tx_status = "DISPUTED"
            is_anomaly = True
            anomaly_type = "EXTREME_HIGH_OFFER"
        elif rand_anom < 0.045:  # Extreme quantity anomaly
            quantity = quantity * 10
            offered_price = round(market_price * 0.90, 2)
            final_price = offered_price
            payment_status = "COMPLETED"
            tx_status = "COMPLETED"
            is_anomaly = True
            anomaly_type = "ABNORMAL_QUANTITY"
        else:  # Normal transaction
            offered_price = round(normal_offer, 2)
            # Final price settles within 2% of offer
            final_price = round(offered_price * random.uniform(0.98, 1.02), 2)
            payment_status = random.choices(["COMPLETED", "PENDING"], weights=[0.92, 0.08])[0]
            tx_status = "COMPLETED" if payment_status == "COMPLETED" else "IN_NEGOTIATION"

        rows.append({
            "Transaction_ID": tx_id,
            "Farmer_ID": farmer_id,
            "Buyer_ID": buyer_id,
            "Commodity": commodity,
            "Variety": variety,
            "Grade": grade,
            "Quantity": quantity,
            "Farmer_District": farmer_dist,
            "Buyer_District": buyer_dist,
            "Distance_KM": distance_km,
            "Market_Price": market_price,
            "Offered_Price": offered_price,
            "Final_Price": final_price,
            "Transaction_Date": tx_date.strftime("%Y-%m-%d"),
            "Payment_Status": payment_status,
            "Transaction_Status": tx_status,
            "Is_Synthetic": True,
            "Is_Anomaly": is_anomaly,
            "Anomaly_Type": anomaly_type
        })

    fieldnames = list(rows[0].keys())
    with open(output_path, "w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully generated {len(rows)} synthetic transactions at {output_path}")
    print(f"Anomalies count: {sum(1 for r in rows if r['Is_Anomaly'])} ({sum(1 for r in rows if r['Is_Anomaly'])/len(rows)*100:.1f}%)")

if __name__ == "__main__":
    generate_transactions()
