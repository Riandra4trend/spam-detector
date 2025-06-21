import { IncomingForm } from 'formidable-serverless'
import fs from 'fs'
import Tesseract from 'tesseract.js'

// Turn off Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = new IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err)
      return res.status(500).json({ error: 'Failed to parse form' })
    }

    const file = files.image  || files.file
    const imagePath = file.filepath || file.path
    try {
      // Run OCR (use 'ind' model if installed for Bahasa Indonesia)
      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, 'eng', { logger: m => console.log(m) })

      // Delete temp file
      fs.unlinkSync(imagePath)

      return res.status(200).json({ text })
    } catch (e) {
      console.error('OCR error:', e)
      return res.status(500).json({ error: 'OCR processing failed' })
    }
  })
}