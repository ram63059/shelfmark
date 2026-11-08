export function AiAssistantsBanner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand/20 text-brand text-xs font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
        </span>
        <span>Actively indexing Shopify product feeds in 2026</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
        {/* ChatGPT Badge */}
        <div className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface/80 border border-line hover:border-line-strong transition-all duration-300 shadow-sm hover:scale-[1.02]">
          <div className="w-6 h-6 rounded-lg bg-[#10A37F]/10 flex items-center justify-center text-[#10A37F]">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1638a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.686zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.909 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.6606v-.0015zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.1448-2.5857l2.8717-1.6558 2.8716 1.6558v3.3117L12.323 15.2447l-2.8717-1.6557V10.2773z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold text-ink leading-none">
              ChatGPT Search
            </span>
            <span className="text-[10px] text-muted">OpenAI</span>
          </div>
        </div>

        {/* Microsoft Copilot Badge */}
        <div className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface/80 border border-line hover:border-line-strong transition-all duration-300 shadow-sm hover:scale-[1.02]">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2L14.4 7.6L20 8.4L15.8 12.4L17 18L12 15.2L7 18L8.2 12.4L4 8.4L9.6 7.6L12 2Z"
                fill="url(#copilot-grad)"
              />
              <defs>
                <linearGradient
                  id="copilot-grad"
                  x1="4"
                  y1="2"
                  x2="20"
                  y2="18"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0078D4" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold text-ink leading-none">
              Copilot Shopping
            </span>
            <span className="text-[10px] text-muted">Microsoft</span>
          </div>
        </div>

        {/* Google AI Mode / Gemini Badge */}
        <div className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface/80 border border-line hover:border-line-strong transition-all duration-300 shadow-sm hover:scale-[1.02]">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="url(#gemini-grad)"
              />
              <defs>
                <linearGradient
                  id="gemini-grad"
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1A73E8" />
                  <stop offset="0.5" stopColor="#8AB4F8" />
                  <stop offset="1" stopColor="#C58AF9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold text-ink leading-none">
              Google AI Mode
            </span>
            <span className="text-[10px] text-muted">Gemini Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
