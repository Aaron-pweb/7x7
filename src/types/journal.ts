export interface QuestionPrompt {
  id: number;
  prompt: string;
  category: string;
  placeholder: string;
}

export const SEVEN_PROMPTS: QuestionPrompt[] = [
  {
    id: 1,
    category: "Gratitude",
    prompt: "What is one small thing you are genuinely grateful for today?",
    placeholder: "A warm cup of coffee, a quiet morning, a kind word...",
  },
  {
    id: 2,
    category: "Clarity",
    prompt: "What is the single most important priority on your mind right now?",
    placeholder: "Focusing on completing the project, finding peace...",
  },
  {
    id: 3,
    category: "Learning",
    prompt: "What did you learn about yourself or the world recently?",
    placeholder: "I realized I work best in short sprints...",
  },
  {
    id: 4,
    category: "Release",
    prompt: "What is one thought or tension you need to let go of today?",
    placeholder: "Letting go of things outside my control...",
  },
  {
    id: 5,
    category: "Connection",
    prompt: "Who brought value, support, or inspiration to your day?",
    placeholder: "A friend who reached out, a mentor's advice...",
  },
  {
    id: 6,
    category: "Intention",
    prompt: "How do you want to show up for yourself and others today?",
    placeholder: "With patience, focus, and quiet confidence...",
  },
  {
    id: 7,
    category: "Insight",
    prompt: "If you could summarize today's mindset in one sentence, what is it?",
    placeholder: "One step at a time produces extraordinary clarity...",
  },
];

export interface DailyEntryData {
  id: string;
  dayNumber: number;
  completedAt: string | null;
  responses: {
    promptIndex: number;
    promptText: string;
    answerText: string;
  }[];
}

export interface ChallengeData {
  id: string;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  currentDay: number; // 1-10
  completedDays: number;
  template: { duration: number; title: string };
  entries: DailyEntryData[];
}
