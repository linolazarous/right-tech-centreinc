// services/aiContentGenerator.js

import OpenAI from "openai";
import logger from '../utils/logger.js';
import { validateTopic } from '../validators/contentValidator.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate AI-powered course content
 * @param {Object} options
 * @param {string} options.topic - Course topic
 * @param {string} [options.audience='beginners'] - Target audience
 * @param {string} [options.depth='intermediate'] - Content depth
 * @returns {Promise<Object>} Structured course content
 */
const generateCourseContent = async ({ topic, audience = 'beginners', depth = 'intermediate' }) => {
  try {
    const validation = validateTopic(topic);
    if (!validation.valid) throw new Error(validation.message);

    logger.info(`Generating course content for topic: ${topic}`);

    const prompt = `
      You are an expert instructional designer.
      Create a detailed course on "${topic}" for ${audience} learners at a ${depth} level.
      Include:
        1. Learning objectives
        2. Module breakdown (titles & descriptions)
        3. Key concepts per module
        4. Optional references
      Provide output in a structured format.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You generate structured educational content." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const rawContent = response.choices?.[0]?.message?.content?.trim();
    if (!rawContent) throw new Error("No content returned from OpenAI");

    const structuredContent = parseGeneratedContent(rawContent);

    logger.info('Successfully generated course content');

    return {
      topic,
      audience,
      depth,
      content: structuredContent,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Course content generation failed: ${error.message}`);
    throw new Error('Failed to generate course content');
  }
};

/**
 * Parse AI-generated content into structured JSON
 * @param {string} content - Raw AI content
 * @returns {Object} Parsed course content
 */
const parseGeneratedContent = (content) => {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const result = { objectives: [], modules: [] };
  let currentModule = null;

  lines.forEach(line => {
    if (/^Learning Objectives:?/i.test(line)) {
      const index = lines.indexOf(line);
      for (let i = index + 1; i < lines.length && !/^Module/i.test(lines[i]); i++) {
        result.objectives.push(lines[i].replace(/^[-*]\s?/, '').trim());
      }
    } else if (/^Module\s*\d+[:.-]?/i.test(line)) {
      if (currentModule) result.modules.push(currentModule);
      currentModule = { title: line, content: '' };
    } else if (currentModule) {
      currentModule.content += (currentModule.content ? '\n' : '') + line;
    }
  });

  if (currentModule) result.modules.push(currentModule);

  return result;
};

export { generateCourseContent };
