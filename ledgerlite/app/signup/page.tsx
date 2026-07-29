"use client";
import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import HomeNav from "@/components/homeNav";
import { useRouter } from 'next/navigation';


import {
  CheckSquare,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  ChevronLeft,
  Store,
  BarChart3,
  Package,
  ClipboardList,
} from "lucide-react";

/**
 * LedgerLite Onboarding Flow
 * Steps: Welcome -> Create Account -> Verify Account -> Business Setup
 */

type Step = "welcome" | "create" | "verify" | "business";

const STEP_META: Record<
  Exclude<Step, "welcome">,
  { label: string; index: number }
> = {
  create: { label: "Step 1 of 3", index: 1 },
  verify: { label: "Step 2 of 3", index: 2 },
  business: { label: "Step 3 of 3", index: 3 },
};

function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* logo */}
      <div>
        <Link href="/">
          <div>
            <svg
              className="w-30 h-10 md:w-40 md:"
              viewBox="0 0 167 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_136_10)">
                <rect
                  width="32.6667"
                  height="32.6667"
                  rx="6.80556"
                  fill="#0B7A75"
                />
                <path
                  d="M16.3493 28.5833L42.6615 1.97439L40.0896 -5.44446L16.2504 18.4937L9.12831 11.3716L4.0835 16.3175L16.3493 28.5833Z"
                  fill="#FDFDFD"
                />
              </g>
              <path
                d="M43.4749 24.3334V7.36367H47.0627V21.3753H54.3378V24.3334H43.4749ZM62.4477 24.582C61.1386 24.582 60.0117 24.3168 59.0671 23.7865C58.128 23.2507 57.4043 22.4939 56.8961 21.5161C56.3879 20.5329 56.1338 19.3701 56.1338 18.0277C56.1338 16.7186 56.3879 15.5696 56.8961 14.5808C57.4043 13.592 58.1197 12.8214 59.0422 12.269C59.9702 11.7166 61.0585 11.4404 62.3069 11.4404C63.1465 11.4404 63.9282 11.5757 64.6518 11.8464C65.381 12.1115 66.0162 12.512 66.5576 13.0479C67.1045 13.5837 67.5298 14.2576 67.8336 15.0696C68.1375 15.8761 68.2894 16.8207 68.2894 17.9034V18.8729H57.5424V16.6854H64.9667C64.9667 16.1772 64.8562 15.727 64.6352 15.3348C64.4143 14.9426 64.1077 14.636 63.7155 14.415C63.3288 14.1886 62.8786 14.0753 62.3649 14.0753C61.8291 14.0753 61.354 14.1996 60.9397 14.4482C60.5309 14.6912 60.2105 15.0199 59.9785 15.4342C59.7465 15.843 59.6277 16.2987 59.6222 16.8014V18.8812C59.6222 19.5109 59.7382 20.055 59.9702 20.5135C60.2078 20.972 60.542 21.3256 60.9728 21.5741C61.4037 21.8227 61.9147 21.947 62.5057 21.947C62.8979 21.947 63.257 21.8918 63.5829 21.7813C63.9088 21.6708 64.1878 21.5051 64.4198 21.2841C64.6518 21.0632 64.8286 20.7925 64.9501 20.4721L68.2148 20.6875C68.0491 21.4719 67.7093 22.1569 67.1956 22.7425C66.6874 23.3225 66.03 23.7755 65.2235 24.1014C64.4226 24.4218 63.4973 24.582 62.4477 24.582ZM75.2827 24.5405C74.316 24.5405 73.4405 24.2919 72.6561 23.7948C71.8772 23.2921 71.2585 22.5546 70.8 21.5824C70.347 20.6047 70.1206 19.406 70.1206 17.9863C70.1206 16.528 70.3553 15.3155 70.8249 14.3488C71.2944 13.3765 71.9186 12.6501 72.6975 12.1695C73.4819 11.6834 74.3409 11.4404 75.2744 11.4404C75.987 11.4404 76.5809 11.5619 77.0559 11.805C77.5365 12.0425 77.9232 12.3408 78.216 12.6998C78.5143 13.0534 78.7408 13.4014 78.8954 13.7439H79.0031V7.36367H82.5247V24.3334H79.0446V22.295H78.8954C78.7297 22.6486 78.4949 22.9993 78.1911 23.3473C77.8928 23.6898 77.5034 23.9743 77.0228 24.2008C76.5477 24.4273 75.9677 24.5405 75.2827 24.5405ZM76.4013 21.7316C76.9703 21.7316 77.4509 21.5769 77.8431 21.2676C78.2408 20.9527 78.5446 20.5135 78.7546 19.9501C78.97 19.3866 79.0777 18.7265 79.0777 17.9697C79.0777 17.213 78.9728 16.5556 78.7628 15.9977C78.5529 15.4397 78.2491 15.0089 77.8514 14.7051C77.4537 14.4012 76.9703 14.2493 76.4013 14.2493C75.8213 14.2493 75.3324 14.4068 74.9347 14.7216C74.537 15.0365 74.2359 15.4729 74.0315 16.0308C73.8272 16.5887 73.725 17.235 73.725 17.9697C73.725 18.71 73.8272 19.3645 74.0315 19.9335C74.2415 20.497 74.5425 20.9389 74.9347 21.2593C75.3324 21.5741 75.8213 21.7316 76.4013 21.7316ZM91.1608 29.3713C90.0173 29.3713 89.0368 29.2138 88.2192 28.899C87.4072 28.5896 86.7609 28.167 86.2803 27.6312C85.7997 27.0954 85.4876 26.4933 85.344 25.8249L88.6087 25.3857C88.7081 25.6398 88.8655 25.8773 89.081 26.0983C89.2964 26.3192 89.5809 26.496 89.9344 26.6286C90.2935 26.7667 90.7299 26.8357 91.2436 26.8357C92.0114 26.8357 92.6439 26.6479 93.1411 26.2723C93.6438 25.9022 93.8951 25.2807 93.8951 24.4079V22.0796H93.746C93.5913 22.4331 93.3593 22.7673 93.05 23.0822C92.7406 23.3971 92.3429 23.6539 91.8568 23.8528C91.3707 24.0517 90.7906 24.1511 90.1167 24.1511C89.1611 24.1511 88.291 23.9301 87.5066 23.4882C86.7278 23.0408 86.1063 22.3585 85.6423 21.4416C85.1838 20.5191 84.9546 19.3535 84.9546 17.9449C84.9546 16.5031 85.1893 15.2989 85.6589 14.3322C86.1284 13.3655 86.7526 12.6418 87.5315 12.1613C88.3159 11.6807 89.1749 11.4404 90.1084 11.4404C90.821 11.4404 91.4176 11.5619 91.8982 11.805C92.3788 12.0425 92.7655 12.3408 93.0582 12.6998C93.3565 13.0534 93.5858 13.4014 93.746 13.7439H93.8786V11.6061H97.3835V24.4577C97.3835 25.5404 97.1184 26.4463 96.5881 27.1755C96.0578 27.9046 95.3231 28.4515 94.384 28.8161C93.4504 29.1862 92.376 29.3713 91.1608 29.3713ZM91.2353 21.4996C91.8043 21.4996 92.2849 21.3587 92.6771 21.077C93.0748 20.7897 93.3786 20.381 93.5885 19.8507C93.804 19.3148 93.9117 18.674 93.9117 17.9283C93.9117 17.1826 93.8067 16.5363 93.5968 15.9894C93.3869 15.437 93.0831 15.0089 92.6854 14.7051C92.2876 14.4012 91.8043 14.2493 91.2353 14.2493C90.6553 14.2493 90.1664 14.4068 89.7687 14.7216C89.371 15.031 89.0699 15.4618 88.8655 16.0142C88.6611 16.5666 88.559 17.2047 88.559 17.9283C88.559 18.663 88.6611 19.2983 88.8655 19.8341C89.0754 20.3644 89.3765 20.7759 89.7687 21.0687C90.1664 21.3559 90.6553 21.4996 91.2353 21.4996ZM105.993 24.582C104.683 24.582 103.557 24.3168 102.612 23.7865C101.673 23.2507 100.949 22.4939 100.441 21.5161C99.9328 20.5329 99.6787 19.3701 99.6787 18.0277C99.6787 16.7186 99.9328 15.5696 100.441 14.5808C100.949 13.592 101.665 12.8214 102.587 12.269C103.515 11.7166 104.603 11.4404 105.852 11.4404C106.691 11.4404 107.473 11.5757 108.197 11.8464C108.926 12.1115 109.561 12.512 110.103 13.0479C110.649 13.5837 111.075 14.2576 111.379 15.0696C111.682 15.8761 111.834 16.8207 111.834 17.9034V18.8729H101.087V16.6854H108.512C108.512 16.1772 108.401 15.727 108.18 15.3348C107.959 14.9426 107.653 14.636 107.26 14.415C106.874 14.1886 106.424 14.0753 105.91 14.0753C105.374 14.0753 104.899 14.1996 104.485 14.4482C104.076 14.6912 103.755 15.0199 103.523 15.4342C103.291 15.843 103.173 16.2987 103.167 16.8014V18.8812C103.167 19.5109 103.283 20.055 103.515 20.5135C103.753 20.972 104.087 21.3256 104.518 21.5741C104.949 21.8227 105.46 21.947 106.051 21.947C106.443 21.947 106.802 21.8918 107.128 21.7813C107.454 21.6708 107.733 21.5051 107.965 21.2841C108.197 21.0632 108.374 20.7925 108.495 20.4721L111.76 20.6875C111.594 21.4719 111.254 22.1569 110.741 22.7425C110.232 23.3225 109.575 23.7755 108.768 24.1014C107.967 24.4218 107.042 24.582 105.993 24.582ZM114.138 24.3334V11.6061H117.56V13.8267H117.692C117.924 13.0368 118.314 12.4402 118.861 12.037C119.408 11.6282 120.037 11.4238 120.75 11.4238C120.927 11.4238 121.117 11.4349 121.322 11.457C121.526 11.479 121.706 11.5094 121.86 11.5481V14.6802C121.695 14.6305 121.465 14.5863 121.173 14.5476C120.88 14.509 120.612 14.4896 120.369 14.4896C119.85 14.4896 119.386 14.6029 118.977 14.8293C118.574 15.0503 118.253 15.3597 118.016 15.7574C117.784 16.1551 117.668 16.6136 117.668 17.1329V24.3334H114.138Z"
                fill="#0B7A75"
              />
              <path
                d="M127.786 24.3334V7.36367H128.822V23.3722H137.108V24.3334H127.786ZM140.605 24.3334V11.6061H141.607V24.3334H140.605ZM141.11 9.35231C140.889 9.35231 140.696 9.27497 140.53 9.1203C140.37 8.96563 140.29 8.77782 140.29 8.55686C140.29 8.3359 140.37 8.14808 140.53 7.99341C140.69 7.83874 140.884 7.7614 141.11 7.7614C141.331 7.7614 141.522 7.83874 141.682 7.99341C141.847 8.14808 141.93 8.3359 141.93 8.55686C141.93 8.77782 141.85 8.96563 141.69 9.1203C141.53 9.27497 141.336 9.35231 141.11 9.35231ZM150.341 11.6061V12.5093H144.781V11.6061H150.341ZM146.662 8.55686H147.664V21.3256C147.664 21.8448 147.764 22.2702 147.963 22.6016C148.167 22.9275 148.432 23.1706 148.758 23.3308C149.089 23.4854 149.443 23.5628 149.819 23.5628C150.001 23.5628 150.158 23.549 150.291 23.5213C150.429 23.4937 150.559 23.4578 150.68 23.4136L150.929 24.3334C150.774 24.3886 150.603 24.4356 150.415 24.4742C150.227 24.5184 150.006 24.5405 149.752 24.5405C149.222 24.5405 148.719 24.4218 148.244 24.1842C147.775 23.9467 147.394 23.6014 147.101 23.1485C146.808 22.6955 146.662 22.1486 146.662 21.5079V8.55686ZM158.917 24.5985C157.768 24.5985 156.768 24.314 155.917 23.7451C155.066 23.1761 154.409 22.3972 153.945 21.4084C153.481 20.4196 153.249 19.2927 153.249 18.0277C153.249 16.7572 153.481 15.6248 153.945 14.6305C154.415 13.6362 155.058 12.8518 155.876 12.2773C156.693 11.7028 157.627 11.4155 158.676 11.4155C159.389 11.4155 160.063 11.5591 160.698 11.8464C161.339 12.1281 161.902 12.5369 162.388 13.0727C162.88 13.6085 163.264 14.2549 163.54 15.0116C163.822 15.7684 163.963 16.6191 163.963 17.5637V18.1935H153.887V17.2737H162.952C162.952 16.3512 162.764 15.5198 162.388 14.7796C162.013 14.0394 161.502 13.4511 160.856 13.0147C160.209 12.5783 159.483 12.3601 158.676 12.3601C157.831 12.3601 157.077 12.5977 156.414 13.0727C155.757 13.5423 155.235 14.1775 154.848 14.9785C154.467 15.7795 154.268 16.6744 154.252 17.6632V18.0775C154.252 19.1381 154.437 20.0909 154.807 20.9361C155.182 21.7758 155.718 22.4414 156.414 22.933C157.11 23.4192 157.944 23.6622 158.917 23.6622C159.613 23.6622 160.206 23.5462 160.698 23.3142C161.195 23.0767 161.601 22.7894 161.916 22.4525C162.231 22.1155 162.469 21.7896 162.629 21.4747L163.548 21.8476C163.355 22.2729 163.054 22.6983 162.645 23.1236C162.242 23.5434 161.728 23.8942 161.104 24.1759C160.485 24.4577 159.756 24.5985 158.917 24.5985Z"
                fill="#0B7A75"
              />
              <defs>
                <clipPath id="clip0_136_10">
                  <rect
                    width="32.6667"
                    height="32.6667"
                    rx="6.80556"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: Exclude<Step, "welcome"> }) {
  const { label, index } = STEP_META[step];
  const pct = (index / 3) * 100;
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="ml-4 whitespace-nowrap text-xs font-medium text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Left illustration/marketing panel shared across desktop layout */
function HeroPanel() {
  return (
    <div>
      <div className="relative hidden h-full flex-col justify-center overflow-hidden  px-12 lg:flex">
        <h1 className="max-w-sm text-4xl font-bold leading-tight text-slate-900">
          Book keeping made simple for your business.
        </h1>
        <p className="mt-4 max-w-sm text-slate-500">
          Record sales, track expenses, manage inventory and stay on top of your
          business with ease.
        </p>

        <div className="relative h-96 w-full  ">
          <Image
            src="/signinImg.png"
            alt="Dashboard preview"
            loading="eager"
            className="object-cover py-4"
            fill
            sizes="(max-width: 568px) 100vw, 50vw"
          />
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-slate-400">
          <Store className="h-4 w-4" />
          <span>
            Built for market sellers, shops, and small business owners
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function TextInput({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  rightAdornment,
}: {
  icon?: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  rightAdornment?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className=" w-full border bg-white border-slate-200 rounded-xl px-12 py-2.5 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-sky-200 "
      />
      <div className="absolute  bottom-[25%] left-[90%] cursor-pointer">
        {rightAdornment}
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ---------------- Screens ---------------- */

function WelcomeScreen({
  onCreate,
  onLogin,
}: {
  onCreate: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col justify-center">
      <Logo />
      <h2 className="mt-8 text-2xl font-bold text-slate-900">
        Welcome to LedgerLite
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Create an account to start managing your business or log in to continue
        where you left off.
      </p>

      <div className=" mt-10 space-y-3">
        <PrimaryButton onClick={onCreate}>Create Account</PrimaryButton>
        <div>
          <Link
            href="/newsignin"
            className="block text-center rounded-full border border-slate-200 px-4 py-3.5 font-semibold text-sm text-teal-700 hover:opacity-80"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

interface AccountForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

// back icon button 
 function BackIconButton(){
   const router = useRouter();

   // Typed click handler function
   const handleBack = (event: React.MouseEvent<HTMLButtonElement>): void => {
     event.preventDefault();
     router.back();
   };
   return (
     <button
       className="bg-[#F4F8F8] py-5 rounded-lg text-teal-700 cursor-pointer"
       type="button"
       onClick={handleBack}
       aria-label="Go back"
     >
       <ChevronLeft />
     </button>
   );
 }

function CreateAccountScreen({
  form,
  setForm,
  onContinue,
  onLogin,
  loading,
}: {
  form: AccountForm;
  setForm: React.Dispatch<React.SetStateAction<AccountForm>>;
  onContinue: () => void;
  onLogin: () => void;
  loading: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const canContinue =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.agreed &&
    !loading;

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <ProgressBar step="create" />
      <BackIconButton />

      <h2 className="text-2xl font-bold text-slate-900">Create Your Account</h2>
      <p className="mt-1.5 mb-6 text-sm text-slate-500">
        Let's get your business set up in just a few steps
      </p>

      <Field label="Full Name">
        <TextInput
          icon={<User className="h-4 w-4" />}
          placeholder="eg. John Doe"
          value={form.fullName}
          onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
        />
      </Field>

      <Field label="Email">
        <TextInput
          icon={<Mail className="h-4 w-4" />}
          placeholder="eg. you@email.com"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
      </Field>

      <Field label="Phone Number">
        <div className="relative">
          <span className="text-base leading-none pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            🇳🇬
          </span>
          <span className=" pointer-events-none absolute inset-y-0 left-9 flex items-center text-slate-400 text-sm ">
            +234
          </span>
          <input
            type="number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder=""
            className=" w-full border bg-white border-slate-200 rounded-xl px-18 py-2.5 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </Field>

      <Field
        label="Password"
        hint="Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character (!@%&*)"
      >
        <TextInput
          icon={
            <span className="text-base leading-none">
              <Lock className="h-4 w-4" />{" "}
            </span>
          }
          placeholder="Enter your password"
          type={showPw ? "text" : "password"}
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />
      </Field>

      <Field label="Confirm Password">
        <TextInput
          icon={
            <span className="text-base leading-none">
              <Lock className="h-4 w-4" />
            </span>
          }
          placeholder="Confirm your password"
          type={showConfirmPw ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
          rightAdornment={
            <button
              type="button"
              onClick={() => setShowConfirmPw((s) => !s)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showConfirmPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />
      </Field>

      <label className="mb-6 mt-1 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => setForm((f) => ({ ...f, agreed: e.target.checked }))}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 accent-[#0B7A75] focus:ring-teal-500"
        />
        <span>
          By creating account, you agree to LedgerLite's{" "}
          <span className="font-medium text-teal-600">Terms of Service</span>{" "}
          and <span className="font-medium text-teal-600">Privacy Policy</span>.
        </span>
      </label>

      <PrimaryButton onClick={onContinue} disabled={!canContinue}>
        {loading ? "Creating Account..." : "Continue"}
      </PrimaryButton>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-teal-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

function VerifyAccountScreen({
  onVerify,
  contact,
  loading,
}: {
  onVerify: (codeString: string) => void;
  contact: string;
  loading: boolean;
}) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    },
    [code],
  );

  const isComplete = code.every((d) => d !== "");

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <ProgressBar step="verify" />
      <BackIconButton />
      <h2 className="text-2xl font-bold text-slate-900">Verify Your Account</h2>
      <p className="mt-1.5 mb-8 text-sm leading-relaxed text-slate-500">
        We&apos;ve sent a verification Otp code to your{" "}
        {contact || "phone number"}. Enter the code below to continue.
      </p>

      <div className="mb-6 flex justify-between gap-2">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputsRef.current[idx] = el; }}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-12 rounded-xl border border-slate-200 text-center text-lg font-semibold text-slate-800 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        ))}
      </div>

      <p className="mb-10 text-sm text-slate-500">
        Didn&apos;t receive code?{" "}
        <button className="font-medium text-teal-600 hover:underline">
          Resend
        </button>
      </p>

      <PrimaryButton onClick={() => onVerify(code.join(""))} disabled={!isComplete || loading}>
        {loading ? "Verifying OTP..." : "Verify Account"}
      </PrimaryButton>
    </div>
  );
}

const BUSINESS_TYPES = [
  "Retail / Shop",
  "Restaurant / Food Vendor",
  "Fashion & Apparel",
  "Grocery / Market Stall",
  "Services",
  "Wholesale / Distribution",
  "Other",
];

function BusinessSetupScreen({
  onFinish,
  loading,
}: {
  onFinish: (data: {
    businessName: string;
    businessType: string;
    hasInventory: boolean | null;
  }) => void;
  loading: boolean;
}) {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const [hasInventory, setHasInventory] = useState<boolean | null>(null);

  const filteredTypes = BUSINESS_TYPES.filter((t) =>
    t.toLowerCase().includes(typeQuery.toLowerCase()),
  );

  const canSubmit =
    businessName.trim() !== "" && businessType !== "" && hasInventory !== null && !loading;

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <ProgressBar step="business" />
      <BackIconButton />
      <h2 className="text-2xl font-bold text-slate-900">
        Tell Us About Your Business
      </h2>
      <p className="mt-1.5 mb-6 text-sm leading-relaxed text-slate-500">
        Let&apos;s set up your business so we can start recording transactions.
      </p>

      <Field label="Business Name">
        <TextInput
          icon={<Store className="h-4 w-4" />}
          placeholder="eg. ledgerlite"
          value={businessName}
          onChange={setBusinessName}
        />
      </Field>

      <div className="relative mb-5">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Business Type
        </label>
        <button
          type="button"
          onClick={() => setTypeOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <span
            className={`flex-1 text-sm ${businessType ? "text-slate-800" : "text-slate-400"}`}
          >
            {businessType || "Select Business Type"}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${typeOpen ? "rotate-180" : ""}`}
          />
        </button>

        {typeOpen && (
          <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                value={typeQuery}
                onChange={(e) => setTypeQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredTypes.length === 0 && (
                <li className="px-3.5 py-2 text-sm text-slate-400">
                  No matches
                </li>
              )}
              {filteredTypes.map((t) => (
                <li key={t}>
                  <button
                     type="button"
                     onClick={() => {
                       setBusinessType(t);
                       setTypeOpen(false);
                       setTypeQuery("");
                     }}
                     className="w-full px-3.5 py-2.5 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-8">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Package className="h-4 w-4 text-slate-400" />
          Does your business keep inventory?
        </label>
        <div className="space-y-2.5">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map((opt) => (
            <label
              key={opt.label}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-colors ${
                hasInventory === opt.value
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  hasInventory === opt.value
                    ? "border-teal-600"
                    : "border-slate-300"
                }`}
              >
                {hasInventory === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-teal-600" />
                )}
              </span>
              <input
                type="radio"
                name="inventory"
                className="sr-only"
                checked={hasInventory === opt.value}
                onChange={() => setHasInventory(opt.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <PrimaryButton
        disabled={!canSubmit}
        onClick={() => onFinish({ businessName, businessType, hasInventory })}
      >
        {loading ? "Saving settings..." : "Finish Setup"}
      </PrimaryButton>
    </div>
  );
}

function DoneScreen({ businessName }: { businessName: string }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
        <CheckSquare className="h-8 w-8 text-teal-600" strokeWidth={2.5} />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        You&apos;re all set!
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {businessName ? `${businessName} is` : "Your business is"} ready to go
        on LedgerLite.
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Redirecting you to dashboard...
      </p>
    </div>
  );
}

/* ---------------- Root ---------------- */

export default function LedgerLiteOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [account, setAccount] = useState<AccountForm>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [businessName, setBusinessName] = useState("");
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contact =
    account.email || (account.phone ? `+234${account.phone}` : "");

  // Handler for creating the account (Step 1)
  const handleCreateAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const normalizePhoneNumber = (phone: string) => {
        let clean = phone.trim().replace(/\s+/g, "");
        if (clean.startsWith("+")) {
          return clean;
        }
        if (clean.startsWith("234")) {
          return "+" + clean;
        }
        if (clean.startsWith("0")) {
          clean = clean.substring(1);
        }
        return "+234" + clean;
      };

      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.fullName,
          email: account.email,
          phoneNumber: normalizePhoneNumber(account.phone),
          password: account.password,
          confirmPassword: account.confirmPassword,
          buisnessName: account.fullName + "'s Business" // required placeholder for schema
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      setStep("verify");
    } catch (err: any) {
      console.error("Sign up failed:", err);
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for verifying OTP (Step 2)
  const handleVerifyOtp = async (codeString: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeString,
          email: account.email
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code.");
      }

      setStep("business");
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "Verification code is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for saving business details (Step 3)
  const handleBusinessSetup = async (setupData: {
    businessName: string;
    businessType: string;
    hasInventory: boolean | null;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buisnessName: setupData.businessName
        })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to save business settings.");
      }

      setBusinessName(setupData.businessName);
      setFinished(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      });
    } catch (err: any) {
      console.error("Business setup failed:", err);
      setError(err.message || "Could not complete business settings setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HomeNav />
      <div className="min-h-screen w-full bg-slate-50">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
          <HeroPanel />
          <div className="flex items-center justify-center px-6 py-12 sm:px-10">
            <div className="w-full max-w-sm">
              {error && (
                <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}
              {step === "welcome" && !finished && (
                <WelcomeScreen
                  onCreate={() => setStep("create")}
                  onLogin={() => setStep("create")}
                />
              )}
              {step === "create" && !finished && (
                <CreateAccountScreen
                  form={account}
                  setForm={setAccount}
                  onContinue={handleCreateAccount}
                  onLogin={() => setStep("welcome")}
                  loading={loading}
                />
              )}
              {step === "verify" && !finished && (
                <VerifyAccountScreen
                  contact={contact}
                  onVerify={handleVerifyOtp}
                  loading={loading}
                />
              )}
              {step === "business" && !finished && (
                <BusinessSetupScreen
                  onFinish={handleBusinessSetup}
                  loading={loading}
                />
              )}
              {finished && <DoneScreen businessName={businessName} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
