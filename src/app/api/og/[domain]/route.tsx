import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCachedScan } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  let score = 72;
  let grade = "Almost ready";
  let topProblem = "Missing key specifications on product listings";

  try {
    const cached = await getCachedScan(decodedDomain);
    if (cached) {
      const data = JSON.parse(cached.report_json);
      score = data.overallScore ?? score;
      grade = data.grade ?? grade;
      if (data.topProblems?.[0]?.summary) {
        topProblem = String(data.topProblems[0].summary);
      }
    }
  } catch {
    // Default fallback values
  }

  // Grade color
  let gradeColor = "#A86B12";
  let gradeBg = "#FFF8EC";
  if (grade === "Ready") {
    gradeColor = "#1B7F4B";
    gradeBg = "#EEFBF3";
  } else if (grade === "Hard for AI to recommend") {
    gradeColor = "#B4362B";
    gradeBg = "#FEF2F1";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#FFFFFF",
          border: "12px solid #F3F5F7",
        }}
      >
        {/* Top header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "#0E5C4A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "24px",
                marginRight: "12px",
              }}
            >
              S
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#16202E",
              }}
            >
              Shelfmark
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontWeight: 500,
              color: "#5B6675",
            }}
          >
            AI Shopping Readiness Score
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "36px",
              fontWeight: 600,
              color: "#16202E",
              marginBottom: "20px",
            }}
          >
            {decodedDomain}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                marginRight: "28px",
              }}
            >
              <span
                style={{
                  fontSize: "92px",
                  fontWeight: 800,
                  color: "#16202E",
                  lineHeight: 1,
                }}
              >
                {String(score)}
              </span>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 500,
                  color: "#5B6675",
                  marginLeft: "6px",
                }}
              >
                /100
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: gradeBg,
                color: gradeColor,
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              {grade}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#5B6675",
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            {`Top priority: ${topProblem}`}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #E2E6EB",
            paddingTop: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              color: "#5B6675",
            }}
          >
            Audit your store at shelfmark.app
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "15px",
              color: "#5B6675",
            }}
          >
            Independent readiness benchmark
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
