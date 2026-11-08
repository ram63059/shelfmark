import {
  FileText,
  Sliders,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Tag,
  ImageIcon,
  Cpu,
  ArrowRight,
} from "lucide-react";

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
      {/* Tile 1: Title Clarity (Spans 7 cols on lg) */}
      <div className="lg:col-span-7 glass-panel rounded-3xl p-7 border border-line space-y-5 hover:border-line-strong transition-all shadow-lg flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-light text-brand border border-brand/20">
              Weight: 25% &bull; Primary Anchor
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Title Clarity & Product Nouns
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            AI language models treat product titles as primary semantic anchors.
            When a merchant uses only creative branding without a product noun,
            AI assistants literally do not know what the item is.
          </p>
        </div>

        {/* Live Bad vs Good visual comparison */}
        <div className="space-y-2.5 pt-2">
          <div className="p-3 rounded-xl bg-fail-bg/40 border border-fail/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <XCircle className="w-4 h-4 text-fail shrink-0" aria-hidden="true" />
              <span className="text-muted line-through truncate">&ldquo;The Luna&rdquo;</span>
            </div>
            <span className="text-[11px] font-semibold text-fail shrink-0">
              Fails: No product noun
            </span>
          </div>

          <div className="p-3 rounded-xl bg-pass-bg/40 border border-pass/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle className="w-4 h-4 text-pass shrink-0" aria-hidden="true" />
              <span className="text-ink font-semibold truncate">
                &ldquo;Luna Matte Ceramic Dinner Plate, 10.5-Inch&rdquo;
              </span>
            </div>
            <span className="text-[11px] font-semibold text-pass shrink-0">
              Passes: Noun + 2 specs
            </span>
          </div>
        </div>
      </div>

      {/* Tile 2: Key Details & Specifications (Spans 5 cols on lg) */}
      <div className="lg:col-span-5 glass-panel rounded-3xl p-7 border border-line space-y-5 hover:border-line-strong transition-all shadow-lg flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-surface border border-line text-muted">
              Weight: 20%
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Concrete Specifications
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            AI shoppers ask technical questions. We scan for 6 specification categories.
          </p>
        </div>

        {/* Spec Pill Tags */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface border border-line flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-ink font-medium">Materials</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-line flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-ink font-medium">Dimensions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-line flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-ink font-medium">Net Weight</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-line flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-ink font-medium">Care Guide</span>
          </div>
        </div>
      </div>

      {/* Tile 3: Description Depth (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 glass-panel rounded-3xl p-7 border border-line space-y-4 hover:border-line-strong transition-all shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
          <Cpu className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Description Depth</h3>
            <span className="text-xs font-bold text-muted">25% Weight</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Filters HTML tags and flags empty copy, under-40-word stubs, and
            marketing fluff (&ldquo;mind-blowing, revolutionary&rdquo;) that offers no
            factual facts for AI citation.
          </p>
        </div>
      </div>

      {/* Tile 4: Variant & Option Legibility (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 glass-panel rounded-3xl p-7 border border-line space-y-4 hover:border-line-strong transition-all shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Sliders className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Variant Naming</h3>
            <span className="text-xs font-bold text-muted">10% Weight</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Identifies lazy defaults like &ldquo;Option 1&rdquo; or internal warehouse SKU
            strings that crash conversational multi-attribute queries in ChatGPT.
          </p>
        </div>
      </div>

      {/* Tile 5: Multimodal Image Coverage (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 glass-panel rounded-3xl p-7 border border-line space-y-4 hover:border-line-strong transition-all shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ImageIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Multimodal Imagery</h3>
            <span className="text-xs font-bold text-muted">10% Weight</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Verifies multiple photo angles and descriptive alternative text so
            vision-capable AI models can visually inspect colors and craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
}
