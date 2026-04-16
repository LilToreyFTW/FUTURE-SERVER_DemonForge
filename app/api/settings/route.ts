import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  return NextResponse.json({
    companyName: 'DemonForge',
    timezone: 'UTC-7',
    darkMode: true,
    emailNotifications: true,
    discordNotifications: false,
    slackNotifications: false,
    webhookUrl: 'https://discord.com/api/webhooks/1494308253528621177/4BFwRz8RTkH9GIsK_U8qfWonrZzcvxzHXMbVpBzkXg_Zhiyuh_iJLHxsfUkLVOnJ0iuj',
    twoFactorEnabled: false,
    apiKey: 'df_sk_1234567890abcdef',
  });
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  
  // Update settings in database or config
  console.log('Updating settings:', body);

  return NextResponse.json({ success: true });
}
