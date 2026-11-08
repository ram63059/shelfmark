import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface CheckSummary {
  name: string;
  weight: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  total: number;
  description: string;
}

interface CheckTableProps {
  checks: CheckSummary[];
}

export function CheckTable({ checks }: CheckTableProps) {
  return (
    <div className="table-scroll">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold text-muted uppercase tracking-wider">
            <th className="py-3.5 pr-4">Check Signal</th>
            <th className="py-3.5 px-3 text-center w-20">Weight</th>
            <th className="py-3.5 px-3 text-center w-24">
              <span className="inline-flex items-center gap-1 text-pass font-bold">
                <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Pass
              </span>
            </th>
            <th className="py-3.5 px-3 text-center w-24">
              <span className="inline-flex items-center gap-1 text-warn font-bold">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                Warn
              </span>
            </th>
            <th className="py-3.5 px-3 text-center w-24">
              <span className="inline-flex items-center gap-1 text-fail font-bold">
                <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Fail
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {checks.map((check) => (
            <tr key={check.name} className="hover:bg-surface/50 transition-colors">
              <td className="py-4 pr-4">
                <p className="font-bold text-ink">{check.name}</p>
                <p className="text-xs text-muted mt-0.5 max-w-lg leading-relaxed">
                  {check.description}
                </p>
              </td>
              <td className="py-4 px-3 text-center tabular-nums font-semibold text-muted">
                {check.weight}%
              </td>
              <td className="py-4 px-3 text-center tabular-nums font-bold text-pass">
                {check.passCount}
              </td>
              <td className="py-4 px-3 text-center tabular-nums font-bold text-warn">
                {check.warnCount}
              </td>
              <td className="py-4 px-3 text-center tabular-nums font-bold text-fail">
                {check.failCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
