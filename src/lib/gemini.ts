import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Lesson } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const hasGeminiKey = Boolean(apiKey);

const bloomLevels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"];

const buildDemoCurriculum = (params: {
  topic: string;
  audience: string;
  duration: string;
  goals: string;
}) => {
  const { topic, audience, duration, goals } = params;
  const normalizedTopic = topic.trim() || "Your Course";

  return {
    learningOutcomes: bloomLevels.slice(0, 5).map((level, idx) => ({
      level,
      outcome:
        idx === 0
          ? `Describe the core ideas behind ${normalizedTopic} for ${audience}.`
          : idx === 1
            ? `Explain how the key concepts support the course goals: ${goals}.`
            : idx === 2
              ? `Apply the framework to real-world scenarios with confidence.`
              : idx === 3
                ? `Analyze learner progress and identify areas that need reinforcement.`
                : `Design a practical deliverable that demonstrates measurable mastery.`,
    })),
    modules: [
      {
        title: "Foundations and context",
        lessons: [
          { title: `What ${normalizedTopic} covers`, description: `Set the scope, language, and outcomes for the course.`, duration: "20 min" },
          { title: "Learner profile and success criteria", description: `Clarify who the course is for and what success looks like.`, duration: "25 min" },
          { title: "Baseline concepts", description: `Introduce the essential ideas that unlock the rest of the curriculum.`, duration: "30 min" },
        ],
        assignment: "Draft a one-page learner profile and define three measurable success criteria.",
      },
      {
        title: "Core practice and application",
        lessons: [
          { title: "Guided walkthrough", description: `Demonstrate a complete workflow learners can follow with confidence.`, duration: "35 min" },
          { title: "Structured practice", description: `Use exercises that build speed, accuracy, and retention.`, duration: "40 min" },
          { title: "Feedback loop", description: `Create checkpoints to reinforce the most important skills.`, duration: "25 min" },
        ],
        assignment: "Create a practice lab or worksheet that reinforces the core workflow.",
      },
      {
        title: "Assessment and polish",
        lessons: [
          { title: "Capstone review", description: `Summarize the most important takeaways and connect them to the goals.`, duration: "30 min" },
          { title: "Assessment design", description: `Build an evaluation that measures real performance, not memorization.`, duration: "30 min" },
          { title: "Launch-ready refinement", description: `Tighten the course flow and prepare it for delivery.`, duration: "20 min" },
        ],
        assignment: "Publish a final assessment rubric and a course launch checklist.",
      },
    ],
    syllabus: `# ${normalizedTopic}\n\n**Audience:** ${audience}\n\n**Duration:** ${duration}\n\n**Learning Focus:** ${goals}\n\n## Syllabus Summary\n- Clear learning outcomes aligned to Bloom's Taxonomy\n- A progressive sequence from foundations to application\n- Practical checkpoints, assignments, and assessment design\n- A launch-ready structure for professional delivery`,
  };
};

const buildDemoGuides = (lessons: Lesson[]) => ({
  lessons: lessons.map((lesson, index) => ({
    title: lesson.title,
    videoGuide: `### Lesson ${index + 1}: ${lesson.title}\n\n- Open with the problem this lesson solves.\n- Demonstrate the workflow step by step using a clean screen recording.\n- End with a recap and one reflection prompt.\n- Keep the tone calm, clear, and practical.`,
    quizGuide: `### Quick Check\n\n1. What is the primary objective of this lesson?\n2. Which step in the workflow is most important to remember?\n3. How would you apply this idea in a real classroom or project?\n\n**Answer key:** The key idea is to connect the lesson to the stated objective and apply it in context.`,
  })),
});

const buildDemoChatResponse = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes("outcome") || lower.includes("taxonomy")) {
    return `Use a stronger outcome structure:\n\n- Start with an action verb from Bloom's Taxonomy.\n- Add the content area or task.\n- Define the success condition.\n\nExample: **Learners will analyze case studies and defend a practical solution using evidence.**`;
  }

  if (lower.includes("module") || lower.includes("lesson")) {
    return `A polished module usually follows this rhythm:\n\n1. Context and motivation\n2. Guided demonstration\n3. Learner practice\n4. Reflection or assessment\n\nThat sequence keeps the course moving from clarity to confidence.`;
  }

  return `Here is a clean refinement pass:\n\n- Tighten the learner outcome.\n- Reduce each module to one job.\n- Add one practical deliverable per section.\n- End with a rubric or checklist so the course feels complete.\n\nIf you want, I can turn your topic into a launch-ready outline next.`;
};

export const generateCurriculum = async (params: {
  topic: string;
  audience: string;
  duration: string;
  goals: string;
}) => {
  if (!hasGeminiKey) {
    return buildDemoCurriculum(params);
  }

  const { topic, audience, duration, goals } = params;

  const prompt = `
    Generate a professional, learner outcome-focused curriculum for a course on "${topic}".
    
    Target Audience: ${audience}
    Course Duration: ${duration}
    Course Goals: ${goals}
    
    Requirements:
    1. Learning Outcomes: Provide at least 5 measurable learning outcomes aligned with Bloom's Taxonomy (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating).
    2. Modules: Break down the course into logical modules. Each module should have 3-5 lessons.
    3. Lessons: Each lesson should have a title, brief description, and estimated duration.
    4. Assignments: Include at least one practical assignment or assessment per module.
    5. Syllabus: Provide a structured syllabus summary in Markdown format.
    
    The output MUST be in JSON format matching the following schema:
    {
      "learningOutcomes": [
        { "level": "string", "outcome": "string" }
      ],
      "modules": [
        {
          "title": "string",
          "lessons": [
            { "title": "string", "description": "string", "duration": "string" }
          ],
          "assignment": "string"
        }
      ],
      "syllabus": "string (Markdown)"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          learningOutcomes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                outcome: { type: Type.STRING },
              },
              required: ["level", "outcome"],
            },
          },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                lessons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      duration: { type: Type.STRING },
                    },
                    required: ["title", "description", "duration"],
                  },
                },
                assignment: { type: Type.STRING },
              },
              required: ["title", "lessons"],
            },
          },
          syllabus: { type: Type.STRING },
        },
        required: ["learningOutcomes", "modules", "syllabus"],
      },
      tools: [{ googleSearch: {} }],
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateModuleGuides = async (moduleTitle: string, lessons: Lesson[]) => {
  if (!hasGeminiKey) {
    return buildDemoGuides(lessons);
  }

  const prompt = `
    For the course module titled "${moduleTitle}", generate detailed content preparation guides for each lesson.
    
    Lessons:
    ${lessons.map((l, i) => `${i + 1}. ${l.title}: ${l.description}`).join("\n")}
    
    For EACH lesson, provide:
    1. Video Content Guide: A detailed outline or script for a video lesson.
    2. Quiz/Assessment Guide: At least 3 multiple-choice or short-answer questions with correct answers.
    
    The output MUST be in JSON format matching the following schema:
    {
      "lessons": [
        {
          "title": "string (must match the input title)",
          "videoGuide": "string (Markdown)",
          "quizGuide": "string (Markdown)"
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                videoGuide: { type: Type.STRING },
                quizGuide: { type: Type.STRING },
              },
              required: ["title", "videoGuide", "quizGuide"],
            },
          },
        },
        required: ["lessons"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const createChatSession = (systemInstruction: string) => {
  if (!hasGeminiKey) {
    return {
      sendMessage: async ({ message }: { message: string }) => ({
        text: buildDemoChatResponse(message),
      }),
    };
  }

  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
  });
};
