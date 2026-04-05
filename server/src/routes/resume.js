const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');
const { protect } = require('../middleware/authMiddleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Store file in memory (no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only PDF and Word files are allowed'))
  }
});

router.post('/parse', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let text = ''

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      const parsed = await pdfParse(req.file.buffer)
      text = parsed.text
    } else {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer })
      text = parsed.value
    }

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from file. Try a different format.' })
    }

    // Send to Groq for structured parsing
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract information from resumes and return ONLY a valid JSON object with no extra text, no markdown, no backticks. The JSON must follow this exact structure:
{
  "hero": {
    "name": "Full name",
    "tagline": "Job title or professional headline",
    "bio": "2-3 sentence professional summary"
  },
  "skills": [
    { "name": "Skill name", "level": 80 }
  ],
  "projects": [
    { "name": "Project name", "desc": "Description", "tech": "Tech stack", "url": "" }
  ],
  "experience": [
    { "company": "Company", "role": "Role", "period": "Duration", "desc": "Description" }
  ],
  "contact": {
    "email": "email",
    "github": "github url or empty string",
    "linkedin": "linkedin url or empty string"
  }
}
Rules:
- skill level should be between 60-95 based on how prominently the skill appears
- If info is missing use empty string
- Return ONLY the JSON, nothing else`
        },
        {
          role: 'user',
          content: 'Parse this resume:\n\n' + text.slice(0, 8000)
        }
      ]
    })

    const raw = completion.choices[0]?.message?.content || ''

    // Clean and parse JSON
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    res.json(parsed)
  } catch (err) {
    console.error('Resume parse error:', err.message)
    if (err.message.includes('JSON')) {
      res.status(500).json({ message: 'AI could not parse resume. Try again.' })
    } else {
      res.status(500).json({ message: 'Parse failed', error: err.message })
    }
  }
});

module.exports = router;