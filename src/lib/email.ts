export async function sendWelcomeEmail(email: string, name: string | null) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || 'noreply@privacyaudit.app';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://privacyaudit.app';

  await resend.emails.send({
    from,
    to: email,
    subject: 'Welcome to PrivacyAudit — your privacy compliance helper',
    html: '<h1>Welcome' + (name ? ', ' + name : '') + '!</h1><p>Thanks for signing up. You are now ready to run your first privacy audit.</p><p><a href="' + appUrl + '/app/dashboard">Go to your dashboard</a></p>',
  });
}

export async function sendWeeklyDigest(email: string, name: string | null, overdueTasks: number, projectsNeedingScan: number) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || 'noreply@privacyaudit.app';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://privacyaudit.app';

  await resend.emails.send({
    from,
    to: email,
    subject: 'PrivacyAudit weekly digest — ' + overdueTasks + ' overdue tasks',
    html: '<h1>Your weekly privacy compliance digest</h1><p>Hi' + (name ? ' ' + name : '') + ',</p><ul><li><strong>' + overdueTasks + '</strong> overdue tasks</li><li><strong>' + projectsNeedingScan + '</strong> projects need scanning</li></ul><p><a href="' + appUrl + '/app/dashboard">View your dashboard</a></p>',
  });
}
