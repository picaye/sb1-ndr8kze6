interface EmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const WEB3FORMS_ACCESS_KEY = '5a600c4e-0dc9-4925-a13a-89d2e2e3bfb5';

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        from_name: data.name,
        botcheck: false
      })
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}