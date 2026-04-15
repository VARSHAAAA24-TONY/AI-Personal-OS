import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { role, locationType, jobListings } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const jobDataString = JSON.stringify(jobListings || [], null, 2)

    // Using the exact prompt and structure requested by the user
    const prompt = `
      Based on the following job listings for ${role}, analyze:
      - Demand level
      - Average salary range
      - Most required skills
      - Career advice

      Job Data:
      ${jobDataString}

      Context Region: ${locationType === 'india' ? 'India' : 'Global / International'}
      
      Provide a concise JSON response with the following fields:
      - demandStrength: A string (High / Medium / Low) followed by a 1-sentence reason.
      - salaryBenchmark: A string describing the estimated average salary band for this specific region.
      - skillsInDemand: An array of key technical skill clusters distilled from the job data.
      - growthAdvice: An AI-generated strategic suggestion for career growth in this role.

      Ensure the output is valid JSON. ONLY return the JSON object.
    `

    const result = await client.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    })

    const text = result.text || '{}'
    
    // Clean JSON if Gemini adds markdown blocks
    const cleanJson = text.replace(/```json|```/g, '').trim()
    const parsedData = JSON.parse(cleanJson)

    return NextResponse.json({ insights: parsedData })
  } catch (error: any) {
    console.error('Market Insights Failure:', error)
    return NextResponse.json({ 
      error: 'Unable to fetch jobs. Please try again',
      details: error.message 
    }, { status: 500 })
  }
}
