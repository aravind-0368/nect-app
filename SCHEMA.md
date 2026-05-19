# Database Schema Reference

This document describes the Firebase Realtime Database structure used by `nect-app`.

> The app uses Firebase Realtime Database, but the structure is analogous to Firestore collections.

## Root Paths

- `/tasks`
- `/foodLog`
- `/foodDatabase`
- `/exercisePlans`

## tasks

Stores the user tasks.

### Fields

- `name` – string
- `status` – string (`"Completed"` or `"Not Completed"`)
- `points` – number or string
- `createdAt` – timestamp in milliseconds

### Example

```json
"tasks": {
  "-Nw1a2B3cD4e5F6G7H8I": {
    "name": "Buy groceries",
    "status": "Not Completed",
    "points": "10",
    "createdAt": 1716300000000
  }
}
```

## foodLog

Stores individual food log entries.

### Fields

- `name` – string
- `calories` – number
- `protein` – number
- `carbs` – number
- `fat` – number
- `date` – string (`YYYY-MM-DD`)
- `quantity` – string or number

### Example

```json
"foodLog": {
  "-Nw2x3Y4zA5b6C7D8E9F": {
    "name": "Apple",
    "calories": 95,
    "protein": 0.5,
    "carbs": 25,
    "fat": 0.3,
    "date": "2026-05-19",
    "quantity": "150"
  }
}
```

## foodDatabase

Stores the shared food database used for meal entry suggestions.

### Fields

- `name` – string
- `calories_per_100g` – number
- `protein_per_100g` – number
- `carbs_per_100g` – number
- `fat_per_100g` – number

### Example

```json
"foodDatabase": {
  "-Nw3z4A5b6C7D8E9F0G1H": {
    "name": "Rice (cooked)",
    "calories_per_100g": 130,
    "protein_per_100g": 2.7,
    "carbs_per_100g": 28,
    "fat_per_100g": 0.3
  }
}
```

## exercisePlans

Stores saved exercise templates.

### Fields

- `day` – string
- `exercises` – array of exercise objects
- `notes` – optional string

### Example

```json
"exercisePlans": {
  "-Nw4A5b6C7D8E9F0G1H2I": {
    "day": "Monday",
    "exercises": [
      { "name": "Push-ups", "reps": 15, "sets": 3 },
      { "name": "Jogging", "duration": 20 }
    ],
    "notes": "Upper body and cardio"
  }
}
```

## Expiration Behavior

The app automatically deletes tasks older than 30 days using the `createdAt` timestamp.

## Security Rules

### Test mode

For early development, use a test rule that allows reads and writes:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Production mode

In production, restrict access to authenticated users only.

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

> Adjust rules further to limit access to user-owned data as needed.
