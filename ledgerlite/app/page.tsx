"use client";

import Image from "next/image";
import HomeNav from "@/components/homeNav";
import Footer from "@/components/footer";
import data from "@/components/accordian";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Check,
  ShoppingBag,
  Receipt,
  ChartNoAxesCombined,
  SquareChartGantt,
  Zap,
  Smartphone,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSingleSelection = (getCurrentId: number) => {
    setSelected(getCurrentId === selected ? null : getCurrentId);
  };

  const features = [
    {
      title: "Record Sales",
      description: "Quickly log sales in seconds. No fuss just fill and go.",
      icon: <ShoppingBag />,
    },
    {
      title: "Track Expense",
      description:
        "Know where your money goes and clear categorised expense record.",
      icon: <Receipt />,
    },
    {
      title: "Inventory System",
      description:
        "Manage stocks and get alerts when your stocks are running low.",
      icon: <SquareChartGantt />,
    },
    {
      title: "Business Insight",
      description:
        "Understand daily and weekly perfomance at a glance. No accountant required.",
      icon: <ChartNoAxesCombined />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HomeNav />

      <main className="relative overflow-hidden">
        <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-20 lg:px-10">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0B7A75]/10 px-4 py-2 text-sm text-[#0B7A75] shadow-sm shadow-[#0B7A75]/20">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#0B7A75] animate-pulse" />
              <Sparkles size={15} />
              Finance operations built for your workflow
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#032523] sm:text-5xl lg:text-6xl">
                Book keeping made simple for every small business
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                Record sales, track expenses, monitor profits and stay on top of
                your business without spreadsheets or accounting experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#0B7A75] px-15 py-4 text-base font-semibold text-white shadow-lg shadow-[#0B7A75]/30 transition hover:-translate-y-0.5 hover:bg-[#0d8d84] sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/signin"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#0B7A75] bg-white px-15 py-4 text-base font-semibold text-[#0B7A75] transition hover:-translate-y-0.5 hover:border-[#0B7A75] hover:text-[#0B7A75] sm:w-auto"
              >
                Log in
              </Link>
            </div>

            <div className="">
              <div className="flex items-center gap-5 py-4">
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-[#0B7A75] " />
                  <p className="text-sm text-gray-700">Free to start</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-[#0B7A75] " />
                  <p className="text-sm text-gray-700">No card required</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Check size={15} className="text-[#0B7A75] " />
                <p className="text-sm text-gray-700">Works on all devices</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-3xl lg:mx-0">
            <div className="relative mx-auto aspect-4/3 w-full overflow-hidden  border border-gray-200 bg-slate-100 shadow-2xl sm:aspect-video">
              <Image
                src="/desktopImg.png"
                alt="Dashboard preview"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="pointer-events-none absolute -right-4 top-0 hidden h-44 w-44 overflow-hidden border border-gray-200 bg-slate-100 shadow-2xl sm:block md:h-115 md:w-60 lg:-right-8 lg:top-2">
              <Image
                src="/mobileImg.png"
                alt="Mobile preview"
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </section>

        <section className="my-20 mt-20">
          <div className="flex flex-col justify-center items-center  ">
            <div className="flex justify-center items-center">
              <h3 className="text-sm  md:text-2xl font-extrabold text-[#0B7A75] py-6">
                Trusted By Small Businesses Everywhere
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-10 px-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto1.jpeg"
                    alt="Amara studio"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  Amara Foods
                </span>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto2.jpeg"
                    alt="Kofi Buildings"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  Bode Grocery
                </span>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto3.jpeg"
                    alt="JFE Fashion"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  Koficuts
                </span>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto4.jpeg"
                    alt="Western Coffee"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  MarketPro
                </span>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto5.jpeg"
                    alt="MarketPro"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  Nia Tailor
                </span>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="relative w-full max-w-45 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    className="object-cover"
                    src="/Cphoto6.jpeg"
                    alt="Nia Tailor"
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 160px, 100vw"
                  />
                </div> */}
                <span className="mt-3 text-sm font-medium text-slate-900">
                  Chidi POS
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* features */}
        <section
          id="features"
          className="mx-auto max-w-7xl space-y-10 px-6 pb-16 my-10 lg:px-10"
        >
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-sm text-[#0B7A75] font-extrabold">Features</p>
            <h2 className="text-center text-[#032523] text-xl md:text-2xl font-bold">
              Everything you need to manage your business
            </h2>
            <p className="text-center text-sm text-gray-700">
              A focused toolkit designed for the way real small business
              actually works
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-[28px] border border-gray-100 shadow-sm bg-white p-8 transition  "
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B7A75]/15 text-[#0B7A75] shadow-sm shadow-[#0B7A75]/20 transition group-hover:bg-[#0B7A75]/20">
                  <span className="text-lg font-semibold">{feature.icon}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#032523]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-700">{feature.description}</p>
              </article>
            ))}
          </div>

          {/* how it works */}
          <section
            id="how-it-works"
            className="border border-gray-100 p-6 rounded-4xl shadow-sm"
          >
            <div className="flex flex-col justify-center items-center gap-4 my-6">
              <p className="text-sm text-[#0B7A75] font-extrabold">
                How it Works
              </p>
              <h2 className="text-[#032523] text-lg md:text-2xl font-bold">
                Get started in three simple steps
              </h2>
            </div>

            <div className="py-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B7A75] text-white font-bold">
                    1
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[#032523]">
                    Create your business
                  </h3>
                  <p className="mt-3 text-sm text-slate-700">
                    Set up your business in minutes by adding your business
                    name, and you are in.
                  </p>
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B7A75] text-white font-bold">
                    2
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[#032523]">
                    Record Sales and Expenses
                  </h3>
                  <p className="mt-3 text-sm text-slate-700">
                    Log transactions as they happen to stay organized and up to
                    date.
                  </p>
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B7A75] text-white font-bold">
                    3
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[#032523]">
                    Track profit and grow
                  </h3>
                  <p className="mt-3 text-sm text-slate-700">
                    See how your business is performing over time and make
                    informed decisions with confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full overflow-hidden rounded-4xl border border-[#0B7A75] bg-slate-100 shadow-2xl aspect-video lg:w-1/2">
                  <div className="relative h-full w-full">
                    <Image
                      src="/homeImg.png"
                      alt="home img"
                      fill
                      loading="eager"
                      className="object-cover rounded-4xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <p className="text-center text-[#0B7A75] text-sm font-bold  tracking-[0.24em] py-5">
                    Why LedgerLite
                  </p>
                  <h3 className="text-center text-[#032523] text-lg md:text-3xl font-bold leading-tight py-4">
                    Built for the way small business actually works.
                  </h3>
                  <p className="text-center text-base text-slate-700 leading-8">
                    You don't start your business to become an accountant.
                    LedgerLite handles the numbers so you can focus on the work.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Zap className="text-[#0B7A75] mt-1" size={18} />
                        <p className="text-sm text-slate-700">
                          Designed for busy traders
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Sparkles className="text-[#0B7A75] mt-1" size={18} />
                        <p className="text-sm text-slate-700">
                          Fast transaction recording
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <SquareChartGantt
                          className="text-[#0B7A75] mt-1"
                          size={18}
                        />
                        <p className="text-sm text-slate-700">
                          Easy inventory management
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <ShieldCheck
                          className="text-[#0B7A75] mt-1"
                          size={18}
                        />
                        <p className="text-sm text-slate-700">
                          No accounting knowledge required
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ChartNoAxesCombined
                          className="text-[#0B7A75] mt-1"
                          size={18}
                        />
                        <p className="text-sm text-slate-700">
                          Clean easy-to-read reports
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Smartphone className="text-[#0B7A75] mt-1" size={18} />
                        <p className="text-sm text-slate-700">
                          Works well on desktop and mobile
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials">
            <div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-[#0B7A75]">
                  Loved by business owners
                </p>
                <h2 className="text-[#032523] text-2xl font-bold py-4">
                  Real business, real results
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="border border-gray-100  rounded-2xl shadow-sm p-6">
                  <div>
                    <div className="flex gap-1">
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                    </div>
                    <div className="py-4">
                      <p className="text-sm text-gray-700">
                        "Keeping track of my daily sales used to be stressful.
                        Now i can record everything in seconds and always know
                        how my business is doing."
                      </p>
                    </div>
                    <div className="flex items-center border-t border-gray-100 gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          className="rounded-full object-cover w-10 h-10"
                          src="/Pcard1.jpg"
                          alt="user profile photo"
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="py-4 ">
                        <h4 className="text-[#032523] font-bold text-sm ">
                          Amina Yusuf
                        </h4>
                        <p className="text-xs text-gray-700">Market Trader</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100  rounded-2xl shadow-sm p-6">
                  <div>
                    <div className="flex gap-1">
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                    </div>
                    <div className="py-4">
                      <p className="text-sm text-gray-700">
                        "I no loner forget the small expenses that eat into my
                        income. Everything is in one place, and it's so easy to
                        use."
                      </p>
                    </div>
                    <div className="flex items-center border-t border-gray-100 gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          className="rounded-full object-cover w-10 h-10"
                          src="/Pcard2.jpg"
                          alt="user profile photo"
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="py-4 ">
                        <h4 className="text-[#032523] font-bold text-sm ">
                          David Okafor
                        </h4>
                        <p className="text-xs text-gray-700">POS Operator</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100  rounded-2xl shadow-sm p-6">
                  <div>
                    <div className="flex gap-1">
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                    </div>
                    <div className="py-4">
                      <p className="text-sm text-gray-700">
                        "Ledgerlite has helped me keep proper record without
                        needing accounting knowledge. It's simple, clean and
                        exactly what my business needs."
                      </p>
                    </div>
                    <div className="flex items-center border-t border-gray-100 gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          className="rounded-full object-cover w-10 h-10"
                          src="/Pcard3.jpg"
                          alt="user profile photo"
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="py-4 ">
                        <h4 className="text-[#032523] font-bold text-sm ">
                          Chioma Eze
                        </h4>
                        <p className="text-xs text-gray-700">
                          Fashion Designer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100  rounded-2xl shadow-sm p-6">
                  <div>
                    <div className="flex gap-1">
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                      <Star className="text-[#0B7A75]" size={15} />
                    </div>
                    <div className="py-4">
                      <p className="text-sm text-gray-700">
                        "Keeping track of my daily sales used to be stressful.
                        Now i can record everything in seconds and always know
                        how my business is doing."
                      </p>
                    </div>
                    <div className="flex items-center border-t border-gray-100 gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          className="rounded-full object-cover w-10 h-10"
                          src="/Pcard4.jpg"
                          alt="user profile photo"
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="py-4 ">
                        <h4 className="text-[#032523] font-bold text-sm ">
                          Tunde Adeyemi
                        </h4>
                        <p className="text-xs text-gray-700">Barber</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="faq">
            <div>
              <div>
                <div className="flex flex-col items-center">
                  <p className="text-[#0B7A75] font-bold text-sm">FAQ</p>
                  <h3 className="text-[#032523] font-bold text-xl">
                    Questions answered
                  </h3>
                  <p className="text-gray-700">
                    Can't find what you are looking for?{" "}
                    <span className="text-[#0B7A75]">contact us</span>
                  </p>
                </div>
                {/* accordian */}
                <div>
                  <div className="w-full py-10">
                    {data && data.length > 0 ? (
                      data.map((dataItem) => (
                        <div
                          key={dataItem.id}
                          className="border border-gray-200 rounded-2xl"
                        >
                          <div key={dataItem.id} className="">
                            <div
                              onClick={() => handleSingleSelection(dataItem.id)}
                              className="flex justify-between font-semibold items-center cursor-pointer   p-4 mb-2"
                            >
                              <h3 className="text-md  text-gray-700">
                                {dataItem.question}
                              </h3>
                              <span className="text-2xl text-gray-700]">
                                {selected ? (
                                  <ChevronUp size={18} />
                                ) : (
                                  <ChevronDown size={18} />
                                )}
                              </span>
                            </div>
                            {selected === dataItem.id ? (
                              <div className="text-gray-700 py-2 px-4">
                                {dataItem.answer}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No Data Found</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-[#074946]  py-20 rounded-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col mx-auto px-4 items-center ">
                  <h3 className="text-center text-sm md:text-2xl text-white font-bold py-3">
                    Ready to keep better business records?
                  </h3>
                  <p className="text-center text-white text-xs md:text-sm">
                    Start using Ledgerlite today and take control of your
                    business
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="bg-white text-[#074946] px-10 py-3 rounded-2xl hover:opacity-80"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
