const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requestLog = new Map();

function getClientIp(req) {
    const forwardedFor = req.headers["x-forwarded-for"];

    if (typeof forwardedFor === "string") {
        return forwardedFor.split(",")[0].trim();
    }

    return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(req) {
    const clientIp = getClientIp(req);
    const now = Date.now();
    const recentRequests = (requestLog.get(clientIp) || []).filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    recentRequests.push(now);
    requestLog.set(clientIp, recentRequests);
    return false;
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    if (isRateLimited(req)) {
        res.setHeader("Retry-After", "60");
        return res.status(429).json({
            error: "Too many requests. Please wait a minute and try again."
        });
    }

    try {

        const { prompt } = req.body;

        if (typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        if (prompt.length > 4000) {
            return res.status(400).json({
                error: "Prompt is too long. Please keep it under 4,000 characters."
            });
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GROQ_API_KEY not found. Add your Groq API key and restart the server."
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You write high-quality social media posts. Follow the user's requested platform, tone, length, emoji, and hashtag preferences."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.8
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            const message =
                data?.error?.message ||
                data?.error ||
                "The AI provider could not generate content. Please try again.";

            console.error("AI provider API error:", data);

            return res.status(response.status).json({
                error: typeof message === "string" ? message : "AI provider request failed."
            });
        }

        return res.status(200).json({
            result:
                data.choices?.[0]?.message?.content ||
                "No response."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });

    }

}
