
export const sendEmail = async (formData) => {
    // API Key provided by user
    const PUBLIC_KEY = 'R0WdsKQ9Dl1R9T2Ks';

    // Note: These IDs usually need to be configured in EmailJS dashboard.
    // Using common default names, but they might need to be updated.
    const SERVICE_ID = 'service_ye7n05a';
    const TEMPLATE_ID = 'template_7ybhegg';

    const data = {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Admin', // Default recipient name in template
        }
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.text();
            console.error('EmailJS Error:', errorData);
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Email API Error:', error);
        return { success: false, error: error.message };
    }
};
