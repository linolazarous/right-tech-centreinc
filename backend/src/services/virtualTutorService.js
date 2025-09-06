import OpenAI from 'openai';
import logger from '../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000
});

class VirtualTutorService {
  static async provideTutoring(userId, question) {
    try {
      if (!userId || !question) {
        throw new Error('User ID and question are required');
      }

      const prompt = `User ${userId} asked: ${question}\n\nProvide a detailed explanation suitable for a student:`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful tutor that explains concepts clearly and provides examples." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from AI tutor');
      }

      logger.info(`Tutoring response generated for user ${userId}`);
      return response.choices[0].message.content;
    } catch (error) {
      logger.error(`Tutoring failed: ${error.message}`);
      throw new Error('Failed to get tutoring response');
    }
  }
}

export default VirtualTutorService;
