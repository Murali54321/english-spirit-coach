# English Spirit Coach

English Spirit Coach is a free, personal learning app inspired by Duolingo, designed to help you practice high-level English vocabulary while reflecting on philosophy, spirituality and personal growth.

## Features

- **Five Levels**: Beginner -> Builder -> Explorer -> Orator -> Sage.
- **Micro-Exercises**: Each lesson mixes reading, listening (TTS), speaking (speech recognition) and writing.
- **Progress Tracking**: Earn XP, maintain your streak, and unlock higher levels by completing 80% of lessons in the current level.
- **Motivational UX**: Streak counters, daily goal reminders, badges, and inline affirmations keep you engaged.
- **Vocabulary Bank**: Advanced words like resilience, equanimity, discernment, integrity, and more.
- **Privacy-First**: All data is stored locally in your browser; export/import your progress as JSON.

## Installation & Usage

This app is a static site. You can use it directly from the [live site](https://your-username.github.io/english-spirit-coach/) or run it locally:

    # Clone the repository
    git clone https://github.com/your-username/english-spirit-coach.git
    cd english-spirit-coach
    # Install dependencies (optional if developing)
    npm install
    # Run locally with Vite
    npm run dev

Then open http://localhost:5173 in your browser. The site works offline after the first visit thanks to service worker caching (optional PWA).

## Project Structure

    english-spirit-coach/
        index.html            Main HTML file
        style.css             Styles for the app
        script.js             Exercise engine and app logic
        content/
            level-1.json      Beginner level lessons
            level-2.json      Builder level lessons
            level-3.json      Explorer level lessons
            level-4.json      Orator level lessons
            level-5.json      Sage level lessons
        docs/
            blueprint.md      Architecture & design guide
            contributing.md   Contribution guidelines
        LICENSE               MIT license
        README.md             Project overview (this file)

## Adding New Lessons

To add your own lessons:

1. Open the `content/level-N.json` file for the desired level (or create a new one for a new level).
2. Each lesson entry has fields: `title`, `passage`, `vocab` (array of target words), `quote`, `speakingPrompt`, and `writingPrompt`.
3. Append a new lesson object following the existing schema. Keep passages short and positive. Include 8-12 advanced vocabulary words.
4. Commit your changes. On refresh, the app will load your new lessons.

See [`docs/blueprint.md`](docs/blueprint.md) for more details on the schema and lesson design guidelines.

## Roadmap

- Initial release with five levels, offline support, and motivational UX.
- Dark mode and high-contrast toggle.
- Progressive Web App (installable on mobile).
- Simple grammar hints for writing exercises.
- GitHub OAuth sync (optional & free) to save progress across devices.

## Contributing

Contributions are welcome! Please read [`docs/contributing.md`](docs/contributing.md) for our guidelines. Whether you want to add more content, improve accessibility, fix bugs, or enhance features, your help is appreciated.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as long as you include the original license and copyright notice.
