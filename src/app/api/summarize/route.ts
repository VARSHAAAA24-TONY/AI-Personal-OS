import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import { GoogleGenAI } from '@google/genai'

// Use the NEW official SDK logic
const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json()

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // 1. Fetch Transcript
    let transcriptText = ''
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoUrl)
      transcriptText = transcript.map(t => t.text).join(' ')
    } catch (error) {
      console.error('Transcript error:', error)
      return NextResponse.json({ error: 'Could not fetch transcript for this video.' }, { status: 400 })
    }

    // 2. Summarize with Gemini 1.0 Pro (Most compatible baseline)
    try {
      const prompt = `
        Summarize the following YouTube video transcript. 
        Provide a concise summary, key takeaways (bullet points), and a brief conclusion.
        Format the output in clear Markdown.

        Transcript:
        ${transcriptText.substring(0, 20000)}
      `

      // Switched to gemini-flash-latest to resolve the 429/Limit 0 quota on next-gen models
      const result = await client.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      })

      const summaryText = result.text || 'Failed to generate summary'

      return NextResponse.json({ summary: summaryText, transcript: transcriptText })
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError)
      // Provide actionable feedback in the details
      return NextResponse.json({ 
        error: 'Failed to generate summary', 
        details: apiError.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Summarize API Failure:', error.message)
    return NextResponse.json({ 
      error: 'Failed to generate summary', 
      details: error.message 
    }, { status: 500 })
  }
}
