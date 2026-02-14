import fs from 'fs'
import path from 'path'

interface PromptConfig {
  model_settings: {
    provider: string
    model: string
    temperature: number
    max_tokens: number
  }
  safety_protocol: string
  system_prompt: string
  user_prompt_single: string
  user_prompt_couple_person: string
  user_prompt_couple_relationship: string
}

let cachedConfig: PromptConfig | null = null

export function getPromptConfig(): PromptConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  const configPath = path.join(process.cwd(), 'config', 'prompt_settings.json')
  const configContent = fs.readFileSync(configPath, 'utf-8')
  cachedConfig = JSON.parse(configContent)

  return cachedConfig!
}

export function fillPromptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}
