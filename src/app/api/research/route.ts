import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Simulating deep research by asking the model to break it down
    const prompt = `
      Perform a deep research analysis on the following topic: "${query}".
      
      Structure your response as follows:
      1. Executive Summary
      2. Comprehensive Analysis (break it down into sub-topics)
      3. Key Findings & Data Points
      4. Pros & Cons (if applicable)
      5. Conclusion & Recommendations
      
      Provide a highly detailed, professional, and insightful response in Markdown.
    `

    const response = await client.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    })

    const analysis = response.text || 'Neural analysis returned empty results.'

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Research API Failure:', error)
    return NextResponse.json({ 
      error: 'Neural Analysis Failed', 
      details: error.message 
    }, { status: 500 })
  }
}
