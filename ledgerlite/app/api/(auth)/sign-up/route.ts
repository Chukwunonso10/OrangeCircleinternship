import { HashPassword } from "@/app/lib/hashpassword";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { VerificationEmail } from "@/app/lib/verificationEmail";
import { Sendsms } from "@/app/lib/sendSms";

export async function POST(req: NextRequest) {
  try {
    const {
      buisnessName,
      email,
      password,
      confirmPassword,
      name,
      phoneNumber,
    } = await req.json();

    if (
      !buisnessName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required.",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        }, { status: 400 }
      );
    }

    // Phone validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    const standardizedPhone = phoneNumber.trim().replace(/\s+/g, "");

    if (!e164Regex.test(standardizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must be in E.164 format (e.g. +2348012345678).",
        }, { status: 400 });
    }

    // Password validation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await HashPassword(password);

    const verificationToken = crypto.randomInt(100000, 1000000).toString();
    const otp = crypto.randomInt(100000, 1000000).toString();

    const expiry = new Date(Date.now() + 3 * 60 * 1000);

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Defaults for new users
    let dailyCount = 0;
    let dailyReset = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (userExist) {
      // Check if phone belongs to another verified account
      const phoneIsTaken = await prisma.user.findFirst({
        where: {
          id: {
            not: userExist.id,
          },
          phoneNumber: standardizedPhone,
          phoneNumberIsVerified: true,
        },
      });

      if (phoneIsTaken) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This phone number is already verified by another account.",
          },
          { status: 409 }
        );
      }

      // Cooldown
      if (userExist.lastPhoneSmsSent) {
        const elapsedSeconds =
          (Date.now() -
            new Date(userExist.lastPhoneSmsSent).getTime()) /
          1000;

        if (elapsedSeconds < 60) {
          const remaining = Math.ceil(60 - elapsedSeconds);

          return NextResponse.json(
            {
              success: false,
              message: `Please wait ${remaining} seconds before requesting another OTP.`,
            },
            { status: 429 }
          );
        }
      }

      dailyCount = userExist.dailySmsCount;

      dailyReset =
        userExist.dailyPhoneSmsReset ??
        new Date(Date.now() + 24 * 60 * 60 * 1000);

      if (new Date() > new Date(dailyReset)) {
        dailyCount = 0;
        dailyReset = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      if (dailyCount >= 5) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You have reached today's verification SMS limit.",
          },
          { status: 429 }
        );
      }
    }

    let userId: string;
    let user;
    if (userExist) {
      if (userExist.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "A user with this email already exists.",
          },
          { status: 409 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userExist.id,
        },
        data: {
          passwordHash: hashedPassword,
          verificationToken,
          phoneNumber: standardizedPhone,
          phoneNumberVerificationToken: otp,
          phoneNumberVerifiesExpiresAt: expiry,
          phoneNumberVerificatonAttemps: 0,
          lastPhoneSmsSent: new Date(),
          dailyPhoneSmsReset: dailyReset,
          dailySmsCount: dailyCount + 1,
        },
      });

      userId = updatedUser.id;
      user = updatedUser
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          buisnessName,
          passwordHash: hashedPassword,
          name,
          isVerified: false,
          verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          phoneNumber: standardizedPhone,
          phoneNumberVerificationToken: otp,
          phoneNumberVerifiesExpiresAt: expiry,
          phoneNumberVerificatonAttemps: 0,
          lastPhoneSmsSent: new Date(),
          dailyPhoneSmsReset: dailyReset,
          dailySmsCount: dailyCount + 1,
        },
      });

      userId = newUser.id;
      user = newUser
    }

    // Send Email
    let emailSent = false;

    try {
      await VerificationEmail(email, verificationToken);
      emailSent = true;
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    // Send SMS
    let smsSent = false;

    try {
      const messageBody = `Your verification code is: ${otp}. It expires in 3 minutes.`;

      await Sendsms(standardizedPhone, messageBody);

      smsSent = true;
    } catch (err) {
      console.error("SMS sending failed:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId,
        emailSent,
        smsSent,
        cooldown: 60,
        user
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false, message: "Internal server error.",
    },
      { status: 500 });
  }
}






// import { HashPassword } from "@/app/lib/hashpassword";
// import prisma from "@/app/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto"
// import { VerificationEmail } from "@/app/lib/verificationEmail";
// import { Sendsms } from "@/app/lib/sendSms";

// export async function POST(req: NextRequest) {
//     try {
//         const { buisnessName, email, password, confirmPassword, name, phoneNumber } = await req.json()

//         if (!buisnessName || !password || !email || !confirmPassword || !phoneNumber) {
//             return NextResponse.json({
//                 success: false, message: "Bad Request: credentials is required!"
//             }, { status: 400 })
//         }

//         const e164Regex = /^\+[1-9]\d{1,14}$/;
//         const standardizedPhone = phoneNumber.trim().replace(/\s+/g, '');

//         if (!e164Regex.test(standardizedPhone)) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Invalid phone number format. Must use E.164 standard (e.g. +14155552671 with country prefix).'
//             }, { status: 400 });
//         }

//         if (password !== confirmPassword) {
//             return NextResponse.json({
//                 success: false, message: "password do not match"
//             }, { status: 400 })
//         }
//         //validating that the email conforms to standard
//         const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!regexPattern.test(email)) {
//             return NextResponse.json({
//                 success: false, message: "invalid email address"
//             }, { status: 400 })
//         }

//         if (password < 8) {
//             return NextResponse.json({
//                 success: false, message: "password must be atleast 8 characters"
//             }, { status: 400 })
//         }

//         const hashedPassword = await HashPassword(password)

//         const verificationToken = crypto.randomInt(100000, 1000000).toString()
//         const otp = crypto.randomInt(100000, 1000000).toString()
//         const expiry = new Date(new Date().getTime() + 3 * 60 * 1000)

//         const userExist = await prisma.user.findUnique({
//             where: { email }
//         })

//         let dailyCount;
//         let dailyReset;

//         if (userExist) {
//             const phoneIsTaken = await prisma.user.findFirst({
//                 where: {
//                     id: { not: userExist.id },
//                     phoneNumberIsVerified: true,
//                     phoneNumber: standardizedPhone
//                 }
//             })

//             if (!phoneIsTaken) {
//                 return NextResponse.json({
//                     success: true, message: `This Phone number ${userExist.phoneNumber} is already verified by another account `
//                 })
//             }

//             if (userExist.lastPhoneSmsSent) {
//                 const elapsedSeconds = (new Date().getTime() - new Date(userExist.lastPhoneSmsSent).getTime()) / 1000
//                 if (elapsedSeconds < 60) {
//                     const remaining = Math.ceil(60 - elapsedSeconds)
//                     return NextResponse.json({
//                         success: false, message: `you still have ${remaining}secs remaining before the next attempt`
//                     }, { status: 429 })
//                 }
//             }

//             dailyCount = userExist.dailySmsCount;
//             dailyReset = userExist.dailyPhoneSmsReset

//             if (!dailyReset || new Date() > new Date(dailyReset)) {
//                 dailyCount = 0
//                 dailyReset = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
//             }

//             if (dailyCount >= 5) {
//                 return NextResponse.json({
//                     success: false, message: "you have reached the maximum of 5 verification attempts allowed per day, try again tomorrow"
//                 }, { status: 429 })
//             }

//         }
//         let userId;
//         if (userExist) {
//             if (userExist.isVerified) {
//                 return NextResponse.json({
//                     success: false, message: "A user with this account already Exists"
//                 }, { status: 400 })
//             }

//             console.log(`user with email ${email} is unverified and retry has been initiated`)

//             const updatedUser = await prisma.user.update({
//                 where: { id: userExist.id },
//                 data: {
//                     passwordHash: hashedPassword,
//                     verificationToken: verificationToken,
//                     phoneNumber: standardizedPhone,
//                     phoneNumberVerificationToken: otp,
//                     phoneNumberVerifiesExpiresAt: expiry,
//                     phoneNumberVerificatonAttemps: 0,
//                     lastPhoneSmsSent: new Date(),
//                     dailyPhoneSmsReset: dailyReset,
//                     dailySmsCount: dailyCount
//                 }
//             })

//             userId = updatedUser.id
//         } else {
//             const user = await prisma.user.create({
//                 data: {
//                     email: email,
//                     buisnessName: buisnessName,
//                     passwordHash: hashedPassword,
//                     name: name,
//                     isVerified: false,
//                     verificationToken,
//                     expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//                     phoneNumber: standardizedPhone,
//                     phoneNumberVerificationToken: otp,
//                     phoneNumberVerifiesExpiresAt: expiry,
//                     phoneNumberVerificatonAttemps: 0,
//                     lastPhoneSmsSent: new Date(),
//                     dailyPhoneSmsReset: dailyReset,
//                     dailySmsCount: dailyCount
//                 }
//             })
//             userId = user.id

//         }
//         let sendMail;
//         try {
//             sendMail = await VerificationEmail(email, verificationToken)
//         } catch (error) {
//             console.error("failed to send emails")
//         }

//         const messageBody = `Your verification code is: ${otp}. It will expire in 3 minutes.`

//         await Sendsms(standardizedPhone, messageBody)

//         return NextResponse.json({
//             success: true,
//             message: `Verification code successfully sent to ${standardizedPhone}.`,
//             messages: "user Account successfully created. verification email sent!", userId, sendMail, cooldown: 60,
//         },{status: 201});

//     } catch (error) {
//         console.error("failed to create an account", error)
//         return NextResponse.json({
//             success: false, message: "internal server error"
//         }, { status: 500 })
// }

// }
