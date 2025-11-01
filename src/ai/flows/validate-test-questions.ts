'use server';

/**
 * @fileOverview Validates the format and content of test questions uploaded via JSON.
 *
 * - validateTestQuestions - A function that validates test questions.
 * - ValidateTestQuestionsInput - The input type for the validateTestQuestions function.
 * - ValidateTestQuestionsOutput - The return type for the validateTestQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  question: z.string().describe('The text of the question.'),
  options: z.object({
    A: z.string().describe('Option A'),
    B: z.string().describe('Option B'),
    C: z.string().describe('Option C'),
    D: z.string().describe('Option D'),
  }).describe('The multiple choice options for the question.'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']).describe('The correct answer for the question.'),
  solution: z.string().describe('The explanation of the correct answer.'),
});

const SubjectSchema = z.array(QuestionSchema).describe('An array of questions for a subject.');

const ValidateTestQuestionsInputSchema = z.object({
  physics: SubjectSchema.optional().describe('An array of physics questions.'),
  chemistry: SubjectSchema.optional().describe('An array of chemistry questions.'),
  mathematics: SubjectSchema.optional().describe('An array of mathematics questions.'),
});
export type ValidateTestQuestionsInput = z.infer<typeof ValidateTestQuestionsInputSchema>;

const ValidationErrorSchema = z.object({
  subject: z.string().describe('The subject where the error occurred (physics, chemistry, or mathematics).'),
  question_index: z.number().describe('The index of the question in the subject array where the error occurred.'),
  error_message: z.string().describe('A detailed message describing the validation error.'),
});

const ValidateTestQuestionsOutputSchema = z.object({
  is_valid: z.boolean().describe('Whether the test questions are valid or not.'),
  errors: z.array(ValidationErrorSchema).describe('An array of validation errors, if any.'),
});
export type ValidateTestQuestionsOutput = z.infer<typeof ValidateTestQuestionsOutputSchema>;

export async function validateTestQuestions(input: ValidateTestQuestionsInput): Promise<ValidateTestQuestionsOutput> {
  return validateTestQuestionsFlow(input);
}

const validateTestQuestionsPrompt = ai.definePrompt({
  name: 'validateTestQuestionsPrompt',
  input: {schema: ValidateTestQuestionsInputSchema},
  output: {schema: ValidateTestQuestionsOutputSchema},
  prompt: `You are an expert test validator for the MHT CET exam. You will receive a JSON object containing questions for Physics, Chemistry, and Mathematics. Your task is to validate these questions and identify any errors. Ensure that each question has a valid format (question text, four options A, B, C, D, a correct answer, and a solution). Also, verify that the content adheres to typical MHT CET standards. Return a JSON object indicating whether the test questions are valid and including an array of detailed error messages for any invalid questions. Always check that the correct answer matches one of the given options. If a subject array is not given, skip the validation step for that subject.

Here is the JSON object containing the test questions:
{{{input}}}
`,
});

const validateTestQuestionsFlow = ai.defineFlow(
  {
    name: 'validateTestQuestionsFlow',
    inputSchema: ValidateTestQuestionsInputSchema,
    outputSchema: ValidateTestQuestionsOutputSchema,
  },
  async input => {
    const {output} = await validateTestQuestionsPrompt({input});
    return output!;
  }
);
