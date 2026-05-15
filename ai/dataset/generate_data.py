import csv
import random

def generate_dataset(filename, num_rows=2000):
    # Food types: 1: Veg, 2: Non-Veg, 3: Mixed
    # Function types: Wedding (0.35), Corporate (0.15), Social (0.25)
    
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['expectedGuests', 'foodType', 'freshnessHours', 'surplusEstimate']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for _ in range(num_rows):
            guests = random.randint(50, 1000)
            food_type = random.randint(1, 3)
            freshness = random.randint(2, 12)
            
            # Base multiplier based on food type (Non-Veg usually has more waste in large functions)
            multiplier = 0.2 if food_type == 1 else 0.25 if food_type == 2 else 0.22
            
            # Variation based on guest count (economies of scale or lack thereof)
            if guests > 500:
                multiplier += 0.05
            
            # Freshness doesn't necessarily affect "surplus" volume but affects redistribution window
            # But let's add some noise
            noise = random.uniform(-0.05, 0.05)
            
            surplus = int(guests * (multiplier + noise))
            
            writer.writerow({
                'expectedGuests': guests,
                'foodType': food_type,
                'freshnessHours': freshness,
                'surplusEstimate': max(5, surplus)
            })

if __name__ == '__main__':
    generate_dataset('c:\\Users\\jangi\\OneDrive\\Pictures\\Documents\\AI-Smart-Food-Redistribution (2)\\projeect\\ai\\dataset\\food_waste_data.csv')
    print("Dataset generated successfully.")
