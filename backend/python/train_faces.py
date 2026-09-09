import os
import pickle
import face_recognition

# ==========================================
# Project Paths
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Move from backend/python -> backend
PROJECT_DIR = os.path.dirname(BASE_DIR)

# Use the SAME folders used by the whole project
DATASET_DIR = os.path.join(PROJECT_DIR, "face_dataset")
OUTPUT_DIR = os.path.join(PROJECT_DIR, "encodings")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "officers.pkl")

os.makedirs(OUTPUT_DIR, exist_ok=True)

known_encodings = []
known_ids = []

print("===================================")
print("Training Face Recognition Model")
print("===================================")
print(f"Dataset : {DATASET_DIR}")
print(f"Output  : {OUTPUT_FILE}")
print()

if not os.path.exists(DATASET_DIR):
    print("Dataset folder not found!")
    exit()

for officer_id in os.listdir(DATASET_DIR):

    officer_path = os.path.join(DATASET_DIR, officer_id)

    if not os.path.isdir(officer_path):
        continue

    print(f"Processing {officer_id}...")

    for image_name in os.listdir(officer_path):

        image_path = os.path.join(officer_path, image_name)

        try:

            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) == 0:
                print(f"Skipped: {image_name} (No face found)")
                continue

            known_encodings.append(encodings[0])
            known_ids.append(officer_id)

        except Exception as e:
            print(f"Error reading {image_name}: {e}")

data = {
    "encodings": known_encodings,
    "ids": known_ids
}

with open(OUTPUT_FILE, "wb") as f:
    pickle.dump(data, f)

print()
print("===================================")
print("Training Complete!")
print("===================================")
print(f"Total Face Encodings : {len(known_encodings)}")
print(f"Saved To             : {OUTPUT_FILE}")