import cv2
import pickle
import face_recognition
import numpy as np
import sys
import time
import os

# -----------------------------
# Check Arguments
# -----------------------------
if len(sys.argv) != 2:
    print("AUTH_FAILED")
    sys.exit()

expected_officer = sys.argv[1]

# -----------------------------
# Project Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

ENCODING_FILE = os.path.join(
    PROJECT_DIR,
    "encodings",
    "officers.pkl"
)

# -----------------------------
# Load Encodings
# -----------------------------
if not os.path.exists(ENCODING_FILE):
    print("AUTH_FAILED")
    sys.exit()

with open(ENCODING_FILE, "rb") as f:
    data = pickle.load(f)

known_encodings = data["encodings"]
known_ids = data["ids"]

# -----------------------------
# Open Camera
# -----------------------------
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("AUTH_FAILED")
    sys.exit()

verified = False
status = "Align your face..."
status_color = (0, 255, 255)

start_time = time.time()
TIMEOUT = 10

while True:

    ret, frame = cap.read()

    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    locations = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, locations)

    for (top, right, bottom, left), encoding in zip(locations, encodings):

        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        status = "Verifying..."
        status_color = (0, 255, 255)

        if len(known_encodings) == 0:
            continue

        distances = face_recognition.face_distance(
            known_encodings,
            encoding
        )

        best = np.argmin(distances)

        if distances[best] < 0.50:

            recognized = known_ids[best]

            if recognized == expected_officer:

                verified = True
                status = "VERIFIED"
                status_color = (0, 255, 0)

                cv2.putText(
                    frame,
                    "ACCESS GRANTED",
                    (20, 120),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    3
                )

                break

        else:

            status = "Face Not Matched"
            status_color = (0, 0, 255)

    cv2.putText(
        frame,
        "Voice Assisted Voting",
        (20, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (255, 255, 255),
        2
    )

    cv2.putText(
        frame,
        f"Officer : {expected_officer}",
        (20, 70),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    cv2.putText(
        frame,
        f"Status : {status}",
        (20, 100),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        status_color,
        2
    )

    cv2.imshow("Officer Face Verification", frame)

    if verified:
        cv2.waitKey(2000)
        break

    if time.time() - start_time > TIMEOUT:

        cv2.putText(
            frame,
            "AUTHENTICATION FAILED",
            (20, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 0, 255),
            3
        )

        cv2.imshow("Officer Face Verification", frame)
        cv2.waitKey(2000)
        break

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q") or key == 27:
        break

cap.release()
cv2.destroyAllWindows()

if verified:
    print("AUTH_SUCCESS")
else:
    print("AUTH_FAILED")