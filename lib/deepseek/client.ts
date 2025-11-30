// DeepSeek API integration for generating specs

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function generateSpec(params: {
  title: string
  description: string
  category: string
  specType: 'markdown' | 'json'
  vibe?: string
  features?: string[]
  pages?: string[]
}): Promise<string> {
  const { title, description, category, specType, vibe, features, pages } = params

  const systemPrompt = `You are an expert at creating detailed specifications for web applications and software projects. 
Your task is to generate a complete, actionable specification in ${specType.toUpperCase()} format.

The specification should be:
- Detailed enough that any AI code generator can build from it
- Well-structured and organized
- Include all necessary pages, components, and features
- Specify technical requirements and architecture
- Include design guidelines and visual requirements
- List out data models and API endpoints if needed

Output ONLY the ${specType.toUpperCase()} content, no additional commentary.`

  const userPrompt = `Create a ${specType} specification for a ${category} project:

Title: ${title}
Description: ${description}
${vibe ? `Vibe/Style: ${vibe}` : ''}
${features && features.length > 0 ? `Features: ${features.join(', ')}` : ''}
${pages && pages.length > 0 ? `Pages: ${pages.join(', ')}` : ''}

Generate a complete, production-ready specification that captures all the details needed to build this project.`

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const data: DeepSeekResponse = await response.json()
    const content = data.choices[0].message.content

    // Clean up the content if it's wrapped in code blocks
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent
        .replace(/^```(?:markdown|json)?\n?/, '')
        .replace(/```\s*$/, '')
        .trim()
    }

    return cleanContent
  } catch (error) {
    console.error('Error generating spec with DeepSeek:', error)
    throw error
  }
}

export async function improveSpec(originalSpec: string, improvements: string): Promise<string> {
  const systemPrompt = `You are an expert at refining and improving software specifications. 
Take the existing specification and apply the requested improvements while maintaining the original structure and format.`

  const userPrompt = `Here is the original specification:

${originalSpec}

Please apply these improvements:
${improvements}

Return the improved specification in the same format.`

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const data: DeepSeekResponse = await response.json()
    const content = data.choices[0].message.content

    // Clean up the content
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent
        .replace(/^```(?:markdown|json)?\n?/, '')
        .replace(/```\s*$/, '')
        .trim()
    }

    return cleanContent
  } catch (error) {
    console.error('Error improving spec with DeepSeek:', error)
    throw error
  }
}
