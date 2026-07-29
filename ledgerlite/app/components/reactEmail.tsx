import * as React from 'react';
import { Html, Head, Body, Container, Text } from '@react-email/components';

export function EmailTemplate({ code }: { code: string }) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Text style={titleStyle}>
            Verify your email
          </Text>
          
          <Text style={descriptionStyle}>
            Thank you for signing up! Use the verification code below:
          </Text>
          
          {/* Verification Code Box */}
          <div style={codeBoxWrapper}>
            <div style={codeBoxStyle}>
              {code}
            </div>
          </div>

          <Text style={footerStyle}>
            This code will expire in 24 hours.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Inline CSS styles (100% compatible with all email clients)
const mainStyle = {
  backgroundColor: '#f5f9fd',
  padding: '40px 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const containerStyle = {
  backgroundColor: '#080000', // Clean white card
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '40px 30px',
  maxWidth: '480px',
  margin: '0 auto',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const titleStyle = {
  color: '#f7f9fc', // Dark slate
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  textAlign: 'center' as const,
};

const descriptionStyle = {
  color: '#b1b7c0', // Slate gray
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const codeBoxWrapper = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const codeBoxStyle = {
  fontSize: '32px',
  fontWeight: '800',
  letterSpacing: '6px',
  color: '#4f46e5', // Indigo-600
  backgroundColor: '#f3f4f6', // Slate-100
  padding: '16px 24px',
  borderRadius: '8px',
  border: '1px dashed #cbd5e1',
  display: 'inline-block',
  margin: '0 auto',
};

const footerStyle = {
  color: '#9ca3af', // Muted gray
  fontSize: '13px',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};