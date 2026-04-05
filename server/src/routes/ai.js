const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { protect } = require('../middleware/authMiddleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate-bio', protect, async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!keywords) return res.status(400).json({ message: 'Keywords required' });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: 'You are a professional bio writer for developer portfolios. Write concise, confident, modern bios. No buzzwords like "passionate" or "guru". Return ONLY the bio text, nothing else.'
        },
        {
          role: 'user',
          content: `Write a professional portfolio bio (3-4 sentences, first person) for a developer with these keywords/skills: ${keywords}.`
        }
      ]
    });

    const bio = completion.choices[0]?.message?.content || '';
    res.json({ bio });
  } catch (err) {
    console.error('Groq Error:', err.message);
    res.status(500).json({ message: 'Generation failed', error: err.message });
  }
});

module.exports = router;