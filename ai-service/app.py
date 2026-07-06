from flask import Flask, request, jsonify
from groq import Groq
import os
import json
import re
from dotenv import load_dotenv

# 🔐 Load environment variables
load_dotenv()

app = Flask(__name__)

# 🔑 Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# 🔥 Normalize severity based on score
def normalize_severity(score):
    if score >= 85:
        return "CRITICAL"
    elif score >= 70:
        return "HIGH"
    elif score >= 30:
        return "MEDIUM"
    else:
        return "LOW"


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    description = data.get('description', '')

    prompt = f"""
You are a safety risk classifier.

Analyze the following issue:

"{description}"

STRICT RULES (DO NOT BREAK):

LOW (0-30):
- Minor inconvenience
- No immediate danger
- Examples: water spill, loose cable, flickering light

MEDIUM (30-60):
- Moderate risk
- May cause injury if ignored
- Examples: AC leak, small crack, minor electrical issue

HIGH (60-80):
- Serious hazard
- Immediate attention required
- Examples: gas smell, overheating equipment

CRITICAL (80-100):
- Life-threatening emergency
- Examples: fire, explosion, toxic leak

IMPORTANT:
- A simple water spill MUST be LOW (≤30)
- Do NOT overestimate severity
- Be strict and conservative

Return ONLY JSON:

{{
  "risk_score": number,
  "summary": "...",
  "recommendations": ["...", "..."]
}}
"""
    try:
        # 🔥 Call Groq API
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant"
        )

        text = response.choices[0].message.content

        # 🔥 Extract JSON safely
        try:
            # Case 1: ```json block
            code_block = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)

            if code_block:
                json_str = code_block.group(1)
            else:
                # Case 2: first JSON object
                json_match = re.search(r"\{.*\}", text, re.DOTALL)
                if json_match:
                    json_str = json_match.group()
                else:
                    raise ValueError("No JSON found")

            parsed = json.loads(json_str)

        except Exception as parse_error:
            print("Parsing failed:", parse_error)
            parsed = {
                "risk_score": None,
                "severity": "UNKNOWN",
                "summary": text,
                "recommendations": ["Manual review required"]
            }

        # 🔥 Ensure recommendations is always a clean list
        recs = parsed.get("recommendations")

        if isinstance(recs, str):
            try:
                # Case 1: valid JSON array
                parsed["recommendations"] = json.loads(recs)

            except:
                # Case 2: {"a","b","c"}
                if recs.startswith("{") and recs.endswith("}"):
                    cleaned = recs.strip("{}")
                    items = re.findall(r'"(.*?)"', cleaned)

                    if items:
                        parsed["recommendations"] = items
                    else:
                        parsed["recommendations"] = [
                            r.strip() for r in cleaned.split(",") if r.strip()
                        ]

                # Case 3: numbered list (1) (2)
                elif re.search(r"\(\d+\)", recs):
                    parts = re.split(r"\(\d+\)\s*", recs)
                    parsed["recommendations"] = [
                        p.strip() for p in parts if p.strip()
                    ]

                # Case 4: paragraph → sentences
                else:
                    sentences = re.split(r"\.\s+", recs)
                    parsed["recommendations"] = [
                        s.strip() for s in sentences if s.strip()
                    ]

        # Final safety check
        if not isinstance(parsed.get("recommendations"), list):
            parsed["recommendations"] = ["Manual review required"]

        # 🔥 ALWAYS normalize severity
        score = parsed.get("risk_score")
        if not parsed.get("severity"):
            parsed["severity"] = normalize_severity(parsed.get("risk_score", 0))

        return jsonify({
            "risk_score": parsed.get("risk_score"),
            "severity": parsed.get("severity"),
            "ai_summary": parsed.get("summary"),
            "recommendations": parsed.get("recommendations")
        })

    except Exception as e:
        print("AI ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)