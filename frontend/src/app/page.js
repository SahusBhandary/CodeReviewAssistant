import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.7-1.384 2.29l-3.28-.913M5 14.5l-1.402 1.402c-1 1-.03 2.7 1.384 2.29l3.28-.913" />
      </svg>
    ),
    title: "AI-Powered Reviews",
    description: "Powered by qwen2.5-coder via Ollama, the assistant analyzes your commit diffs and suggests improvements across performance, syntax, and structure.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Real-Time Feedback",
    description: "Reviews are delivered instantly via WebSockets the moment a commit is pushed — no polling, no page refreshes.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "Codebase Context via RAG",
    description: "Your entire repo is vectorized with ChromaDB so the LLM understands the broader context of each change — not just the diff.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
    title: "GitHub Integration",
    description: "Connect any public GitHub repository. Browse the file tree, switch branches, and trigger reviews via webhook on every push.",
  },
];

const steps = [
  { step: "01", title: "Sign up & connect your repo", description: "Create an account and add any GitHub repository to your dashboard." },
  { step: "02", title: "Set up the webhook", description: "Point your GitHub repo's webhook at the server to enable push-triggered reviews." },
  { step: "03", title: "Push your code", description: "The assistant vectorizes your repo, analyzes the diff, and streams back a review in real time." },
];

export default function Index() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <span className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          AI-Powered · Real-Time · Context-Aware
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
          Code reviews that{" "}
          <span className="text-red-500">actually understand</span>{" "}
          your codebase
        </h1>

        <p className="mt-6 max-w-xl text-neutral-400 text-lg leading-relaxed">
          Connect a GitHub repository, push a commit, and get an intelligent review — powered by a local LLM with full codebase context — delivered in real time.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/repos"
            className="px-6 py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-lg hover:shadow-red-600/40 transition-all duration-200"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-sm font-medium transition-all duration-200"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold tracking-tight mb-2">Everything you need for smarter reviews</h2>
        <p className="text-center text-neutral-400 text-sm mb-12">Built on open-source models — runs entirely on your machine.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-red-500/40 hover:bg-neutral-900 transition-all duration-200"
            >
              <div className="mb-4 w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm text-neutral-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-neutral-800/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold tracking-tight mb-2">How it works</h2>
          <p className="text-center text-neutral-400 text-sm mb-14">Three steps from setup to your first AI review.</p>

          <div className="flex flex-col gap-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 text-xs font-bold">
                  {s.step}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-sm text-neutral-100 mb-1">{s.title}</h3>
                  <p className="text-sm text-neutral-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/80 px-10 py-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-red-600/10 rounded-full blur-3xl" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3">Ready to review smarter?</h2>
          <p className="text-neutral-400 text-sm mb-8 max-w-sm mx-auto">Add your first repository and let the AI handle the code review grunt work.</p>
          <Link
            href="/repos"
            className="inline-block px-7 py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-semibold shadow-lg hover:shadow-red-600/40 transition-all duration-200"
          >
            Go to Repos
          </Link>
        </div>
      </section>

    </main>
  );
}
