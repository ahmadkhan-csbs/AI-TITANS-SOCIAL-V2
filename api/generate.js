export default async function handler(req, res) {

    // Only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    try {

        const { prompt } = req.body;

        if (!prompt) {

            return res.status(400).json({
                error: "Prompt is required"
            });

        }

        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    contents: [

                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }

                    ]

                })

            }
        );

        const data = await response.json();

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response.";

        res.status(200).json({
            result: text
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });

    }

}