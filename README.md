# Strength Training App

A progressive web app for tracking barbell strength workouts using an A/B split with automatic weight progression.

## Live App

[![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://erikwiffin.github.io/strength-training-app/)](https://erikwiffin.github.io/strength-training-app/)

**https://erikwiffin.github.io/strength-training-app/**

## Features

- **A/B workout split** — alternates between two routines each session
- **Progressive overload** — automatically calculates next target weight based on your last performance
- **Live workout tracking** — log reps per set, adjust weight on the fly, resume interrupted sessions
- **Workout history** — review all past sessions and individual exercise performance
- **Flexible units** — switch between pounds and kilograms; all weights convert automatically
- **Data portability** — export and import your full workout history as JSON
- **PWA** — installable on mobile for a native app feel, works offline

## Workout Program

| | Workout A | Workout B |
|---|---|---|
| **Exercise 1** | Squat | Squat |
| **Exercise 2** | Bench Press | Overhead Press |
| **Exercise 3** | Barbell Row | Deadlift |

Sessions alternate A → B → A → B. Each exercise targets 3 sets of 5 reps. If you complete all sets successfully, the weight increases next session. If not, the weight stays the same.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + DaisyUI v5
- PWA via vite-plugin-pwa
