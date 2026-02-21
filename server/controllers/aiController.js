const asyncHandler = require('express-async-handler');
const { HfInference } = require('@huggingface/inference');

// @desc    Generate course description using AI
// @route   POST /api/ai/generate-description
// @access  Private/Instructor
const generateCourseDescription = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Course title is required');
  }

  if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('HUGGINGFACE_API_KEY is missing in backend environment variables');
      res.status(500);
      throw new Error('Server configuration error: AI service not configured');
  }

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const prompt = `Write a professional, engaging, and detailed course description for a course titled "${title}"${category ? ` in the category of ${category}` : ''}. The description should highlight what students will learn and why they should enroll.`;
    
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [
        { role: "system", content: "You are an expert curriculum designer and copywriter for an online learning platform. Write professional and engaging course descriptions." },
        { role: "user", content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const generatedText = response.choices[0].message.content || 'No description generated.';
    const finalDescription = generatedText.trim();

    res.json({ description: finalDescription });
  } catch (error) {
    console.error('AI Generation Error:', JSON.stringify(error, null, 2));
    if (error.message?.includes('loading')) {
        res.status(503);
        throw new Error('Model is currently loading on Hugging Face. Please try again in 30 seconds.');
    }
    res.status(500); 
    throw new Error(`AI Service Error: ${error.message || 'Unknown error'}`);
  }
});

module.exports = {
  generateCourseDescription
};
