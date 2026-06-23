import csv
import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    # Generate for 100 NodeIds
    node_ids = [str(i) for i in range(101, 201)]
    
    # 6 months of historical data
    start_time = datetime(2023, 6, 1, 0, 0, 0)
    end_time = datetime(2023, 11, 30, 23, 59, 59)
    
    # Activity labels chosen strictly from the allowed list
    labels = ["REL", "RUS", "MOV", "FEP", "DRN", "LCK", "URI", "DEF", "ATT", "OTH"]
    
    # Probability weights for each label based on hour of day
    def get_probabilities(hour):
        # Order: REL, RUS, MOV, FEP, DRN, LCK, URI, DEF, ATT, OTH
        if 20 <= hour or hour < 5:  # Night: more REL
            return [0.68, 0.15, 0.03, 0.01, 0.01, 0.02, 0.03, 0.03, 0.01, 0.03]
        elif 6 <= hour <= 8:       # Morning Feeding: high FEP, more MOV
            return [0.02, 0.12, 0.22, 0.52, 0.05, 0.02, 0.02, 0.01, 0.01, 0.01]
        elif 9 <= hour <= 15:      # Daytime: high MOV, steady DRN, moderate FEP
            return [0.12, 0.20, 0.35, 0.18, 0.06, 0.02, 0.02, 0.02, 0.01, 0.02]
        elif 16 <= hour <= 18:     # Evening Feeding: high FEP, more MOV
            return [0.02, 0.12, 0.22, 0.52, 0.05, 0.02, 0.02, 0.01, 0.01, 0.01]
        else:                      # Transitions (5-6 AM, 7-8 PM)
            return [0.38, 0.25, 0.15, 0.10, 0.04, 0.02, 0.02, 0.02, 0.01, 0.01]

    filename = "activity_logs.csv"
    print(f"Generating synthetic data to {filename}...")
    
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Output schema must contain only: NodeId, ActivityLabel, TimeStamp
        writer.writerow(["NodeId", "ActivityLabel", "TimeStamp"])
        
        records_count = 0
        
        # Process cow by cow to ensure logical timestamp progression for each node
        for node_id in node_ids:
            # Stagger start times slightly for each cow
            current_time = start_time + timedelta(seconds=random.randint(0, 1800))
            
            while current_time <= end_time:
                hour = current_time.hour
                probs = get_probabilities(hour)
                activity = random.choices(labels, weights=probs, k=1)[0]
                
                # Format: 2023-11-25 05:30:19
                timestamp_str = current_time.strftime("%Y-%m-%d %H:%M:%S")
                writer.writerow([node_id, activity, timestamp_str])
                records_count += 1
                
                # Time delta: average 20 minutes (so that 100 cows * 183 days * 72 records/day = 1.3M records)
                delta_minutes = random.randint(15, 25)
                current_time += timedelta(minutes=delta_minutes)
                
    print(f"Data generation complete. Total records: {records_count}")

if __name__ == "__main__":
    generate_synthetic_data()
