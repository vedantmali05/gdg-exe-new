const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const GEMINI_API_URL =
    `${process.env.NEXT_PUBLIC_GEMINI_API_URL
    }?key=${GEMINI_API_KEY}`


export const generateChecklist = async (prompt) => {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key not found")
    }

    const finalPrompt = `
You are an expert assistant that creates **detailed and specific checklists** for design, writing, video, form, or event tasks.

Return your response ONLY in valid JSON format (no markdown):
{
  "name": "<title of the checklist>",
  "items": ["item 1", "item 2", "item 3", ...]
}

Each checklist item must:
- Be a **real, actionable step** (not abstract or general)
- Include **actual content** or **clear instructions**, not just "define", "decide", or "identify"
- Avoid generic actions like "Plan content", "Collect assets", "Choose colors" — instead, specify **actual headlines**, colors, software, or images
- Be ready-to-use by someone starting the task

Examples:
✅ "Set the poster headline to: 'Hackathon 2025 - Code. Create. Conquer.'"
✅ "Add the event time: 'Saturday, Aug 9, 10:00 AM to 4:00 PM' under the title"
✅ "Insert logo: 'assets/logo-techfest.png' at top-right corner"
✅ "Use color palette: #004AAD (blue), #F7F7F7 (white), #FF5722 (orange accent)"
✅ "Export the final design as PDF and share it in the team drive: 'Designs/Posters/August2025'"

❌ Avoid:
- "Define the purpose"
- "Decide fonts"
- "Collect images"
- Markdown (e.g., \`\`\`json)

Checklist should feel like a complete to-do list for someone executing the task directly.

User request: "${prompt}"
`





    try {

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: finalPrompt,
                            }
                        ]
                    }
                ]
            }),
        })


        if (!response.ok) {
            throw new Error("Error response from Gemini: ", await response.text())
        }

        const data = await response.json();
        if (!data || !data.candidates || data.candidates.length === 0) {
            throw new Error("No candidates found in the Gemini response")
        }

        let checklist = data.candidates[0].content.parts[0].text

        return checklist;

    } catch (error) {
        console.log(error)
    }
}