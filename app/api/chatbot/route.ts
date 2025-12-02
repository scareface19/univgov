import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language = 'fr' } = body;

    // Simulated chatbot responses
    const responses: Record<string, any> = {
      fr: {
        greeting: "Bonjour ! Comment puis-je vous aider ?",
        courses: "Pour vous inscrire à un cours, rendez-vous dans la section 'Services Étudiants' puis 'Inscription'.",
        grades: "Vous pouvez consulter vos notes dans 'Services Étudiants' > 'Notes & Suivi'.",
        payment: "Pour effectuer un paiement, allez dans la section 'Paiements'.",
        appointment: "Pour prendre rendez-vous, utilisez la section 'Rendez-vous' dans le menu.",
        default: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?",
      },
      ar: {
        greeting: "مرحبا! كيف يمكنني مساعدتك؟",
        courses: "للتسجيل في دورة، انتقل إلى قسم 'الخدمات الطلابية' ثم 'التسجيل'.",
        grades: "يمكنك الاطلاع على درجاتك في 'الخدمات الطلابية' > 'الدرجات والمتابعة'.",
        payment: "لإجراء الدفع، انتقل إلى قسم 'المدفوعات'.",
        appointment: "لحجز موعد، استخدم قسم 'المواعيد' في القائمة.",
        default: "لست متأكدا من فهمي. هل يمكنك إعادة صياغة سؤالك؟",
      },
      en: {
        greeting: "Hello! How can I help you?",
        courses: "To enroll in a course, go to 'Student Services' then 'Enrollment'.",
        grades: "You can check your grades in 'Student Services' > 'Grades & Progress'.",
        payment: "To make a payment, go to the 'Payments' section.",
        appointment: "To book an appointment, use the 'Appointments' section in the menu.",
        default: "I'm not sure I understand. Could you rephrase your question?",
      },
    };

    // Simple keyword matching (in production, use OpenAI or similar)
    const lowerMessage = message.toLowerCase();
    let response = responses[language].default;

    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('مرحبا')) {
      response = responses[language].greeting;
    } else if (lowerMessage.includes('cours') || lowerMessage.includes('inscription') || lowerMessage.includes('دورة') || lowerMessage.includes('تسجيل')) {
      response = responses[language].courses;
    } else if (lowerMessage.includes('note') || lowerMessage.includes('résultat') || lowerMessage.includes('درجة')) {
      response = responses[language].grades;
    } else if (lowerMessage.includes('paiement') || lowerMessage.includes('payer') || lowerMessage.includes('دفع')) {
      response = responses[language].payment;
    } else if (lowerMessage.includes('rendez-vous') || lowerMessage.includes('appointment') || lowerMessage.includes('موعد')) {
      response = responses[language].appointment;
    }

    return NextResponse.json({
      response,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
