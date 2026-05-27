



import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def generate_cover_letter(resume_text: str, job_description: str, tone: str = "professional") -> dict:
    print(f"[cover_letter] Generating with tone={tone}")
    print(f"[cover_letter] API key present: {'YES' if API_KEY else 'NO'}")

    prompt = f"""
You are an expert career coach and professional writer.

Write a compelling cover letter based on this resume and job description.

RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{job_description[:1000]}

TONE: {tone}

Rules:
- 250-300 words, 4 paragraphs: opening hook, relevant experience, why this company, call to action
- Be specific to THIS candidate's actual experience
- Tone should be {tone}
- Opening line must NOT start with "I am writing to apply for"

Return ONLY this JSON, no markdown, no extra text:
{{
    "cover_letter": "full letter text with paragraphs separated by \\n\\n",
    "subject_line": "Application for [Role] - [Name]",
    "key_points": ["key highlight 1", "key highlight 2", "key highlight 3"],
    "word_count": 270
}}
"""

    headers = {"Content-Type": "application/json"}
    data = {"contents": [{"parts": [{"text": prompt}]}]}

    response = requests.post(
        f"{GEMINI_URL}?key={API_KEY}",
        headers=headers,
        json=data
    )

    print(f"[cover_letter] Status code: {response.status_code}")

    if response.status_code != 200:
        print(f"[cover_letter] Error response: {response.text[:300]}")
        raise Exception(f"Gemini API error {response.status_code}: {response.text[:200]}")

    result = response.json()
    raw = result['candidates'][0]['content']['parts'][0]['text']
    print(f"[cover_letter] Raw response: {raw[:100]}")

    # Clean markdown fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    data_parsed = json.loads(raw)

    return {
        "cover_letter": data_parsed.get("cover_letter", ""),
        "subject_line": data_parsed.get("subject_line", ""),
        "key_points": data_parsed.get("key_points", []),
        "word_count": data_parsed.get("word_count", 0),
    }