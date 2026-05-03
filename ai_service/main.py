from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
from typing import List
import colorsys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MediaPipe Initialization (DISABLED)
# from mediapipe.solutions import pose as mp_pose
# pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

def hex_to_hsv(hex_color):
    hex_color = hex_color.lstrip('#')
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return colorsys.rgb_to_hsv(rgb[0]/255, rgb[1]/255, rgb[2]/255)

@app.get("/")
def read_root():
    return {"status": "AI Styling Service Online", "version": "1.2.0 (MediaPipe Disabled)"}

@app.post("/try-on")
async def try_on(user_image: UploadFile = File(...)):
    """
    Simulates pose-aware try-on (MOCKED).
    """
    import base64
    user_bytes = await user_image.read()
    
    # Mocking successful detection and body shape
    body_shape = "Athletic"
    
    encoded_image = base64.b64encode(user_bytes).decode('utf-8')

    return {
        "status": "Success",
        "body_shape": body_shape,
        "fit_recommendation": f"For your {body_shape} body type, we recommend tailored fits that highlight your proportions.",
        "processed_image": f"data:image/jpeg;base64,{encoded_image}",
        "note": "Body analysis is currently running in mock mode (MediaPipe disabled)."
    }

@app.post("/analyze-body")
async def analyze_body(file: UploadFile = File(...)):
    """
    MOCKED body analysis.
    """
    return {
        "detected": True, 
        "body_shape": "Athletic", 
        "confidence": 0.95,
        "note": "MediaPipe is disabled. Returning mock data."
    }

import io
import json
from groq import Groq
import base64

# Configure Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

@app.post("/analyze-clothing")
async def analyze_clothing(file: UploadFile = File(...)):
    """
    Analyzes clothing image and returns category, type, color, and styling suggestions.
    """
    if not GROQ_API_KEY:
        return {
            "category": "Top",
            "type": "T-Shirt",
            "color": "White",
            "suggestions": "Pair with blue jeans and white sneakers for a classic look.",
            "warning": "GROQ_API_KEY not found. Returning mock data."
        }

    try:
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        prompt = """
        Analyze this clothing image and return a JSON object with the following fields:
        - category: One of ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory']
        - type: Specific type (e.g., 'Denim Jacket', 'Pleated Skirt', 'Oxford Shirt')
        - color: Dominant color (e.g., 'Navy Blue', 'Forest Green')
        - suggestions: A 2-sentence styling suggestion on what to wear with this item.
        
        Return ONLY the JSON object.
        """
        
        response = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.2,
        )
        
        text = response.choices[0].message.content.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}

@app.post("/recommend-outfit")
async def recommend_outfit(data: dict):
    weather = data.get("weather", "Mild")
    occasion = data.get("occasion", "Casual")
    gender = data.get("gender", "Unisex")

    prompt = f"""
    You are a professional fashion stylist. 
    Suggest exactly 5 complete, trendy outfit ideas for a {gender} attending a {occasion} in {weather} weather.
    
    Return the response ONLY as a valid JSON object in this exact format:
    {{
      "outfits": [
        {{
          "name": "Catchy Outfit Name",
          "description": "A short 1-sentence description of why it works.",
          "items": ["Specific Item 1", "Specific Item 2", "Specific Item 3"]
        }}
      ]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        import json
        return {"recommendation": json.loads(response.choices[0].message.content.strip())}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
