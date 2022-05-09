# ExploreCourses

This module will be used to query all courses from ExploreCourses, format the
data, and upload it to Firestore.

It will be written in Python and be manually run from the command line.

## Setup

```sh
pip install --upgrade firebase-admin
```

Setup the emulator:
```sh
export FIRESTORE_EMULATOR_HOST="localhost:8080"
export GCLOUD_PROJECT="cs194w-team4"
```

## Usage

Start the emulator:

```sh
cd ../CloudFunctions
firebase emulators:start
```

Run the script:

```sh
cd ../ExploreCourses
python3 main.py
```