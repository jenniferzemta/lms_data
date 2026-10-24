import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/features/auth';
import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-brand-canvas text-brand-text antialiased min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
