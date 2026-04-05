const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');
const { protect } = require('../middleware/authMiddleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only PDF and Word files are allowed'))
  }
});

async function extractTextFromPDF(buffer) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
  const pdf = await loadingTask.promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(' ') + '\n'
  }
  return text
}

router.post('/parse', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let text = ''

    if (req.file.mimetype === 'application/pdf') {
      text = await extractTextFromPDF(req.file.buffer)
    } else {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer })
      text = parsed.value
    }

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text. Try a different format.' })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract information and return ONLY valid JSON with this structure:
{
  "hero": { "name": "", "tagline": "", "bio": "" },
  "skills": [{ "name": "", "level": 80 }],
  "projects": [{ "name": "", "desc": "", "tech": "", "url": "" }],
  "experience": [{ "company": "", "role": "", "period": "", "desc": "" }],
  "contact": { "email": "", "github": "", "linkedin": "" }
}
Rules: skill level 60-95, empty string if missing, ONLY JSON no markdown`
        },
        {
          role: 'user',
          content: 'Parse this resume:\n\n' + text.slice(0, 8000)
        }
      ]
    })

    const raw = completion.choices[0]?.message?.content || ''
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    res.json(parsed)
  } catch (err) {
    console.error('Resume parse error:', err.message)
    res.status(500).json({ message: 'Parse failed: ' + err.message })
  }
});

module.exports = router;