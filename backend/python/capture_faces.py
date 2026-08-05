import cv2
import os
import sys

# ============================
# Usage:
# python capture_faces.py OFF001
# ============================

if len(sys.argv) != 2:
    print("Usage: python capture_faces.py <OfficerID>")
    sys.exit(1)

officer_id = sys.argv[1]

# ----------------------------------------
# Project Paths
# ----------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Go one level up (backend/)
PROJECT_DIR = os.path.dirname(BASE_DIR)

# Save into backend/face_dataset
DATASET_DIR = os.path.join(PROJECT_DIR, "face_dataset")

OFFICER_DIR = os.path.join(DATASET_DIR, officer_id)

os.makedirs(OFFICER_DIR, exist_ok=True)

print("Saving Images To:")
print(OFFICER_DIR)
print()

# ----------------------------------------
# Haar Cascade
# ----------------------------------------

cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

# ----------------------------------------
# Camera
# ----------------------------------------

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("Unable to open camera.")
    sys.exit(1)

count = 0
MAX_IMAGES = 30

print("==============================")
print(" Face Registration Started")
print("==============================")
print("Look at the camera")
print("Move your head slowly")
print("Press Q to Quit")
print()

while True:

    ret, frame = cap.read()

    if not ret:
        print("Failed to capture frame.")
        continue

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(120, 120)
    )

    for (x, y, w, h) in faces:

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        face = frame[y:y+h, x:x+w]

        filename = os.path.join(
            OFFICER_DIR,
            f"{count + 1}.jpg"
        )

        success = cv2.imwrite(filename, face)

        if success:
            count += 1
            print(f"Saved {count}.jpg")

        cv2.putText(
            frame,
            f"Captured : {count}/{MAX_IMAGES}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        break

    cv2.imshow("Capture Face", frame)

    key = cv2.waitKey(300)

    if key == ord("q"):
        break

    if count >= MAX_IMAGES:
        break

cap.release()
cv2.destroyAllWindows()

print()
print("==============================")
print("Capture Completed")
print("==============================")
print(f"Saved {count} Images")
print(f"Location : {OFFICER_DIR}")