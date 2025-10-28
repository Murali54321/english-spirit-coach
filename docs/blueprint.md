# App Blueprint

## Architecture

This is a fully client‑side web application with no backend. It consists of static HTML, CSS and JavaScript served by GitHub Pages.

- **Frontend**: Vanilla JavaScript, no frameworks. Single‑page app that dynamically renders views for the home screen and lesson exercises.
- **Speech**: Uses the Web Speech API for text‑to‑speech and speech recognition. If a feature is not supported in the browser, a graceful message is shown.
- **Storage**: Uses `localStorage` to persist user progress (XP, streak, completed lessons). Data can be exported and imported via JSON files.
- **Build & Deploy**: Built using simple project scripts (npm scripts or direct bundling). Deployed via GitHub Actions to GitHub Pages.

## Data Schema

The application’s data is stored locally in the browser as JSON. Here is the high‑level schema:

```json
{
  "levels": [
    {
      "level": 1,
      "name": "Beginner",
      "lessons": [
        {
          "id": "beginner-1",
          "passage": "...",          
          "quote": "...",
          "vocab": ["resilience", "equanimity", ...],
          "speakingPrompt": "...",
          "writingPrompt": "..."
        },
        ...
      ]
    },
    ...
  ],
  "userData": {
    "xp": 0,
    "streak": 0,
    "completedLessons": {
      "beginner-1": true,
      ...
    },
    "lastPracticeDate": "2025-10-28"
  }
}
```

## Lesson Design

Each level contains 10–15 lessons. Lessons are intentionally short (3–6 micro‑exercises) to encourage daily practice. Every lesson includes:

- **Passage**: A short uplifting reading on philosophy, spirituality or positive psychology.
- **Quote**: A concise inspirational line aligned with the lesson’s theme (public domain or original).
- **Vocabulary**: 8–12 advanced (C1/C2) words to learn or reinforce.
- **Speaking Prompt**: Encourages self‑reflection and oral expression using vocabulary words.
- **Writing Prompt**: Encourages longer form expression and opinion. Client‑side checks ensure a minimum length and vocabulary usage.

## Exercise Engine

The app includes several exercise types:

1. **Reading**: Displays the passage with key vocabulary highlighted. The user reads silently or aloud. A simple check ensures the page is viewed for a minimum time.
2. **Listening**: Uses the Web Speech API to read the passage aloud. A fallback message appears if speech synthesis is not supported.
3. **Speaking**: Prompts the user to record themselves reading a passage or answering a question. Uses the Web Speech API’s `SpeechRecognition` when supported. Otherwise, the user self‑assesses by listening to their recording.
4. **Multiple Choice / Reorder / Fill‑in‑the‑blank**: Quick interactive questions about the passage or vocabulary. Instant feedback is provided.
5. **Writing**: Presents the writing prompt and records user input. Client‑side checks ensure a minimum length and inclusion of target vocabulary words. Users can revise their answer until it meets criteria.

The exercise engine manages progression through exercises, updates XP, and persists progress in `localStorage`.

## Progression & Motivation

- **Levels**: Users start at Level 1 (Beginner). To unlock the next level, they must complete at least 80 % of the current level’s lessons.
- **XP & Streaks**: Each micro‑exercise grants XP. Completing a lesson yields a bonus. A daily practice streak encourages consistency.
- **Badges**: Achieved at milestones (e.g., completing a level, maintaining a 7‑day streak). Badges are displayed in the profile.
- **Affirmations**: Encouraging messages appear after each exercise (e.g., “Keep going!”, “Your voice is getting clearer!”).
- **Positive Vocabulary Bank**: A list of uplifting words is displayed on the home screen for inspiration.

## Adding New Lessons

To add or edit lessons, modify the JSON files under `/content/level‑N.json`. Each file contains an array of lesson objects for that level. When adding a new lesson:

1. Assign a unique `id` (e.g., `builder-11`).
2. Write an original passage and quote.
3. Choose 8–12 vocabulary words (C1/C2 level).
4. Create a speaking prompt that encourages reflection and uses vocabulary words.
5. Create a writing prompt with a recommended length and vocabulary usage.
6. Save the JSON file. The app will automatically load the new lessons on refresh.

## Local Development & Deployment

1. **Install dependencies**: (if using a build tool like Vite or webpack) run `npm install`.
2. **Run dev server**: `npm run dev` to start a local server with hot reloading.
3. **Build**: `npm run build` to generate production assets.
4. **Deploy**: Push to the `main` branch. GitHub Actions is configured to build and deploy to GitHub Pages automatically.
5. **Visit**: The live site will be available at `https://<username>.github.io/english-spirit-coach/`.

## Contributing Guide (Summary)

- Keep passages and prompts original or from the public domain.
- Use inclusive and uplifting language.
- Ensure accessibility: provide alt text, sufficient contrast, and keyboard navigation.
- Avoid adding third‑party trackers or ads.
- Follow the project’s coding style and write clear commit messages.
