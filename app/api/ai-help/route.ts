import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "कृपया अपना प्रश्न दर्ज करें।" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `आप 5tarResult के वरिष्ठ परीक्षा मार्गदर्शक (Exam & Career Mentor) हैं। 
छात्रों को भारतीय सरकारी नौकरियों (SSC, Railway, UP Police, Banking, Defense), नवोदय विद्यालय प्रवेश, बोर्ड परीक्षाओं और अध्ययन तकनीकों पर प्रामाणिक, उत्साहवर्धक और बिंदुवार हिंदी में उत्तर दें। 
छात्र का प्रश्न: ${prompt}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "क्षमा करें, AI उत्तर तैयार करने में असमर्थ रहा। कृपया पुनः प्रयास करें।";

        return NextResponse.json({ reply });
      } catch (geminiError) {
        console.warn("Gemini API call failed, using intelligent assistant fallback:", geminiError);
      }
    }

    // Intelligent educational fallback responses
    const query = prompt.toLowerCase();
    let fallbackReply = "";

    if (query.includes("ssc gd") || query.includes("जीडी")) {
      fallbackReply = `**SSC GD Constable 2026 भर्ती की मुख्य जानकारी:**\n\n1. **शैक्षणिक योग्यता:** किसी भी मान्यता प्राप्त बोर्ड से कक्षा 10वीं पास।\n2. **आयु सीमा:** 18 से 23 वर्ष (OBC को 3 वर्ष तथा SC/ST को 5 वर्ष की छूट)।\n3. **परीक्षा पैटर्न:** कंप्यूटर आधारित परीक्षा (CBT) जिसमें 80 प्रश्न, 160 अंक, 60 मिनट समय और 0.25 नेगेटिव मार्किंग होती है।\n4. **शारीरिक मानक:** पुरुष ऊंचाई 170 सेमी (ST: 162.5 सेमी), 5 किमी दौड़ 24 मिनट में। महिला ऊंचाई 157 सेमी (ST: 150 सेमी), 1.6 किमी दौड़ 8.5 मिनट में।\n\n5tarResult पर फ्री मॉक टेस्ट और पिछले वर्षों के पेपर उपलब्ध हैं!`;
    } else if (query.includes("navodaya") || query.includes("नवोदय") || query.includes("jnvst")) {
      fallbackReply = `**जवाहर नवोदय विद्यालय (JNVST) प्रवेश 2026-27:**\n\n1. **कक्षा 6 प्रवेश:** छात्र सरकारी या मान्यता प्राप्त स्कूल में कक्षा 5 में अध्ययनरत होना चाहिए।\n2. **परीक्षा पैटर्न:** कुल 80 प्रश्न, 100 अंक, 2 घंटे।\n   - मानसिक योग्यता (Mental Ability): 40 प्रश्न (50 अंक)\n   - अंकगणित (Arithmetic): 20 प्रश्न (25 अंक)\n   - भाषा (Language): 20 प्रश्न (25 अंक)\n3. **विशेषता:** नवोदय में शिक्षा, आवास, भोजन और खेलकूद पूर्णतः निःशुल्क हैं।\n\nअध्ययन सामग्री सेक्शन से फॉर्मूला शीट और मॉक टेस्ट अवश्य हल करें।`;
    } else if (query.includes("police") || query.includes("पुलिस")) {
      fallbackReply = `**UP Police SI एवं कांस्टेबल भर्ती 2026:**\n\n1. **योग्यता:** कांस्टेबल हेतु 12वीं पास; सब-इंस्पेक्टर (SI) हेतु किसी भी विषय में स्नातक (Graduation)।\n2. **आयु:** 18 से 25 वर्ष (नियमानुसार आरक्षित वर्गों को छूट)।\n3. **मुख्य विषय:** सामान्य ज्ञान, हिंदी व्याकरण, संख्यात्मक योग्यता (Maths), और मानसिक अभिरुचि/तर्कशक्ति (Reasoning)।\n4. 5tarResult पर प्रतिदिन करंट अफेयर्स और हिंदी व्याकरण के स्पेशल कैप्सूल डाउनलोड करें।`;
    } else if (query.includes("railway") || query.includes("रेलवे") || query.includes("rrb")) {
      fallbackReply = `**रेलवे (RRB) भर्ती 2026 (ALP, Technician, Group D):**\n\n1. **योग्यता:** Group D हेतु 10वीं पास या ITI; Technician हेतु ITI/Diploma/12th PCM; ALP हेतु ITI/Diploma.\n2. **चयन प्रक्रिया:** Stage-1 CBT (स्क्रीनिंग), Stage-2 CBT (टेक्निकल), CBAT (केवल ALP हेतु) एवं डॉक्यूमेंट वेरिफिकेशन।\n3. विज्ञान (Science) पर विशेष ध्यान दें — 9वीं व 10वीं NCERT भौतिकी और रसायन से सीधे प्रश्न आते हैं।`;
    } else {
      fallbackReply = `नमस्ते विद्यार्थी! **5tarResult** में आपका स्वागत है।\n\nआपकी परीक्षा की तैयारी के लिए महत्वपूर्ण सुझाव:\n1. सबसे पहले आधिकारिक सिलेबस और परीक्षा पैटर्न को समझें।\n2. पिछले 5 वर्षों के प्रश्न पत्र (PYQs) हल करें ताकि प्रश्नों का स्तर समझ आ सके।\n3. प्रतिदिन कम से कम 1 ऑनलाइन मॉक टेस्ट देकर अपनी गलतियों का विश्लेषण करें।\n4. कमजोर विषयों (जैसे गणित या रीजनिंग) के लिए शॉर्टकट फॉर्मूला नोट्स बनाएं।\n\nआप हमसे SSC, UP Police, Railway, Navodaya Vidyalaya या किसी भी बोर्ड परीक्षा से जुड़ा विशिष्ट सवाल पूछ सकते हैं!`;
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    return NextResponse.json(
      { error: "सर्वर त्रुटि। कृपया थोड़ी देर बाद पुनः प्रयास करें।" },
      { status: 500 }
    );
  }
}
