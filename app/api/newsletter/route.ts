import { NextResponse } from 'next/server';

interface MailchimpError {
  status: number;
  title: string;
  detail: string;
}

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.length) {
    return NextResponse.json(
      { error: 'Please enter a valid email address' },
      { status: 400 }
    );
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const DATACENTER = process.env.MAILCHIMP_API_KEY?.split('-')[1];

    const data = {
      email_address: email,
      status: 'subscribed',
    };

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );

    if (response.status >= 400) {
      const errorData: MailchimpError = await response.json();
      throw new Error(errorData.title);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Member Exists')) {
      return NextResponse.json(
        { error: 'You are already subscribed to our newsletter!' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'There was an error subscribing to the newsletter.' },
      { status: 500 }
    );
  }
} 