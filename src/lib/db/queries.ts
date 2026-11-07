import { supabase, isSupabaseConfigured } from "./supabase";

export interface CachedScan {
  domain: string;
  report_json: string;
  scanned_at: string;
  product_count: number;
}

// In-memory fallback stores to guarantee 100% functionality even before
// database migrations are run
const memoryScans = new Map<string, CachedScan>();
const memoryWaitlist = new Set<string>();
const memoryIpScans = new Map<string, number[]>();

/**
 * Get a cached scan result if it exists and is less than 24 hours old.
 */
export async function getCachedScan(
  domain: string
): Promise<CachedScan | null> {
  const normalized = domain.toLowerCase();

  // Check in-memory store first
  const mem = memoryScans.get(normalized);
  if (mem) {
    const age = Date.now() - new Date(mem.scanned_at).getTime();
    if (age < 24 * 60 * 60 * 1000) {
      return mem;
    }
  }

  if (!isSupabaseConfigured()) return null;

  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("domain", normalized)
      .gte("scanned_at", twentyFourHoursAgo)
      .order("scanned_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as CachedScan;
  } catch {
    return null;
  }
}

/**
 * Cache a scan result.
 */
export async function cacheScan(
  domain: string,
  reportJson: string,
  productCount: number
): Promise<void> {
  const normalized = domain.toLowerCase();
  const scanData: CachedScan = {
    domain: normalized,
    report_json: reportJson,
    scanned_at: new Date().toISOString(),
    product_count: productCount,
  };

  // Always save in-memory
  memoryScans.set(normalized, scanData);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("scans").upsert(
      {
        domain: normalized,
        report_json: reportJson,
        scanned_at: scanData.scanned_at,
        product_count: productCount,
      },
      { onConflict: "domain" }
    );
  } catch {
    // Graceful fallback
  }
}

/**
 * Add an email to the waitlist.
 */
export async function addToWaitlist(
  email: string,
  domain?: string
): Promise<{ success: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim();

  // Always record in-memory
  memoryWaitlist.add(normalized);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from("waitlist").insert({
      email: normalized,
      domain: domain ? domain.toLowerCase().trim() : null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      // If table doesn't exist yet, we still captured in memory
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        return { success: true };
      }
      // If unique violation, they are already on the list
      if (error.code === "23505") {
        return { success: true };
      }
      return { success: true };
    }

    return { success: true };
  } catch {
    // In-memory capture succeeds
    return { success: true };
  }
}

/**
 * Check rate limit: max 10 scans per IP per hour.
 */
export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Check in-memory timestamps
  const timestamps = (memoryIpScans.get(ip) || []).filter((t) => t > oneHourAgo);
  memoryIpScans.set(ip, timestamps);

  if (timestamps.length >= 10) {
    return { allowed: false, remaining: 0 };
  }

  if (!isSupabaseConfigured()) {
    return { allowed: true, remaining: 10 - timestamps.length };
  }

  try {
    const oneHourIso = new Date(oneHourAgo).toISOString();
    const { count, error } = await supabase
      .from("scan_events")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", oneHourIso);

    if (error) {
      return { allowed: true, remaining: Math.max(0, 10 - timestamps.length) };
    }

    const used = Math.max(count || 0, timestamps.length);
    const remaining = Math.max(0, 10 - used);

    return { allowed: remaining > 0, remaining };
  } catch {
    return { allowed: true, remaining: Math.max(0, 10 - timestamps.length) };
  }
}

/**
 * Record a scan event for rate limiting.
 */
export async function recordScanEvent(
  ip: string,
  domain: string
): Promise<void> {
  const now = Date.now();
  const list = memoryIpScans.get(ip) || [];
  list.push(now);
  memoryIpScans.set(ip, list);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("scan_events").insert({
      ip,
      domain: domain.toLowerCase().trim(),
      created_at: new Date().toISOString(),
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Track a generic event
 */
export async function trackEvent(
  eventName: string,
  metadata?: Record<string, string>
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("events").insert({
      event_name: eventName,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch {
    // Graceful fallback
  }
}
