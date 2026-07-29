import { getCurrentUser } from '@/app/lib/authhelper';
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Verification code is required' }, { status: 400 });
    }

    let user = await getCurrentUser();
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User session or email identifier not found' }, { status: 401 });
    }

    if (user.phoneNumberIsVerified) {
      const sessionToken = crypto.randomUUID();
      const isProduction = process.env.NODE_ENV === "production";
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expiresAt
        }
      });

      const response = NextResponse.json({
        success: true,
        message: 'Phone number already verified!',
        profile: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          phoneNumberVerified: true,
          createdAt: user.createdAt,
        }
      });

      response.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24
      });

      return response;
    }

    if (!user.phoneNumber || !user.phoneNumberVerificationToken || !user.phoneNumberVerifiesExpiresAt) {
      return NextResponse.json({
        success: false,
        error: 'No active phone verification request found. Please request a verification code first.'
      }, { status: 400 });
    }

    const now = new Date();

    // 1. Check expiration threshold (3 mins lifespan limit)
    if (now > new Date(user.phoneNumberVerifiesExpiresAt)) {
      // Clear token since it expired
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneNumberVerificationToken: null,
          phoneNumberVerifiesExpiresAt: null,
          phoneNumberVerificatonAttemps: 0,
        },
      });
      return NextResponse.json({
        success: false,
        error: 'The verification code has expired. Please request a new one.'
      }, { status: 400 });
    }

    // 2. Check brute force attempt limit
    if (user.phoneNumberVerificatonAttemps >= 3) {
      return NextResponse.json({
        success: false,
        error: 'Too many verification attempts. Please request a new code.'
      }, { status: 400 });
    }

    // 3. Process matches
    if (code.trim() === user.phoneNumberVerificationToken) {
      // Success! Mark phone and account verified
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneNumberIsVerified: true,
          isVerified: true,
          phoneNumberVerificationToken: null,
          phoneNumberVerifiesExpiresAt: null,
          phoneNumberVerificatonAttemps: 0,
        },
      });

      console.log(`Phone verified successfully for user ${user.email} (Phone: ${updatedUser.phoneNumber})`);

      // Setup login session for onboarding continuity
      const sessionToken = crypto.randomUUID();
      const isProduction = process.env.NODE_ENV === "production";
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expiresAt
        }
      });

      const response = NextResponse.json({
        success: true,
        message: 'Phone number verified successfully!',
        profile: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phoneNumber: updatedUser.phoneNumber,
          phoneNumberVerified: updatedUser.phoneNumberIsVerified,
          createdAt: updatedUser.createdAt,
        }
      });

      response.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24
      });

      return response;
    } else {
      // Incorrect code. Increment verification attempts
      const nextAttempts = (user.phoneNumberVerificatonAttemps ?? 0) + 1;

      if (nextAttempts >= 3) {
        // Brute-force lockout triggered! Immediately invalidate the token
        await prisma.user.update({
          where: { id: user.id },
          data: {
            phoneNumberVerificationToken: null,
            phoneNumberVerifiesExpiresAt: null,
            phoneNumberVerificatonAttemps: 0,
          },
        });
        return NextResponse.json({
          success: false,
          error: 'Too many incorrect attempts. This code has been invalidated for security. Please request a new verification code.'
        }, { status: 400 });
      }

      // Increment attempt count in DB
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneNumberVerificatonAttemps: nextAttempts,
        },
      });

      return NextResponse.json({
        success: false,
        error: `Invalid verification code. You have ${3 - nextAttempts} attempts remaining.`
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Verify phone OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
