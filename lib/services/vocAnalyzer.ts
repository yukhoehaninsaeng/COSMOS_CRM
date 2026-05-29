export type VocResult = { sentiment: 'positive' | 'neutral' | 'negative'; tags: string[] }

export async function analyzeReview(content: string): Promise<VocResult> {
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey || apiKey === 'dummy') return { sentiment: 'neutral', tags: [] }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: `아래 화장품 리뷰를 분석하라.\n1. 감성: positive/neutral/negative 중 하나\n2. 키워드 태그: 최대 5개 (한국어)\nJSON으로만 응답: {"sentiment":"...","tags":[...]}\n리뷰: ${content}` }],
      }),
    })
    if (!res.ok) return { sentiment: 'neutral', tags: [] }
    const data = await res.json() as { content: Array<{ text: string }> }
    return JSON.parse(data.content[0]?.text ?? '{}') as VocResult
  } catch { return { sentiment: 'neutral', tags: [] } }
}
