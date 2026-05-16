import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DRISHTI AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NVIDIA NIM is OpenAI-compatible. Free personal key from https://build.nvidia.com
# (rate-limited but no token billing). Put it in drishti-ai/.env as NVIDIA_API_KEY.
NVIDIA_API_KEY = os.getenv(
    "NVIDIA_API_KEY",
    "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",
)
MODEL = os.getenv("AI_MODEL", "meta/llama-3.3-70b-instruct")

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_API_KEY,
)

SYSTEM_PROMPT = (
    "You are DRISHTI AI, the assistant for the DRISHTI commerce-education platform.\n"
    "Scope:\n"
    "1. Commerce topics: accounting, business studies, GST, stock market, "
    "economics, finance, Tally, trade.\n"
    "2. The DRISHTI platform itself: how to book online seats, request "
    "institutional visits, quizzes/certificates, dashboards, student vs "
    "institution roles.\n"
    "3. The currently logged-in user's own account details (provided to you "
    "below). You may answer questions about THIS user's name, role, email and "
    "their bookings. Never reveal or invent information about other users.\n"
    "If a question is clearly outside commerce or the DRISHTI platform, politely "
    "steer the conversation back. Answer concisely and helpfully."
)


class ChatRequest(BaseModel):
    message: str
    # Optional context about the signed-in user, sent by the frontend.
    userName: str | None = None
    userRole: str | None = None
    userEmail: str | None = None


class ChatResponse(BaseModel):
    reply: str


def build_user_context(req: ChatRequest) -> str:
    if not (req.userName or req.userRole or req.userEmail):
        return "The user is browsing as a guest (not logged in)."
    return (
        "Currently logged-in user — "
        f"name: {req.userName or 'unknown'}, "
        f"role: {req.userRole or 'unknown'}, "
        f"email: {req.userEmail or 'unknown'}."
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": build_user_context(req)},
                {"role": "user", "content": req.message},
            ],
            temperature=0.6,
            top_p=0.95,
            max_tokens=2048,
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print(f"AI error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {e}")


@app.get("/")
def read_root():
    return {"status": "ok", "model": MODEL, "message": "DRISHTI AI is running."}
