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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="text-left py-3 pr-4 font-medium text-muted text-xs">
              Check
            </th>
            <th className="text-center py-3 px-3 font-medium text-muted text-xs w-16">
              Weight
            </th>
            <th className="text-center py-3 px-3 font-medium text-muted text-xs w-16">
              <span className="flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-pass" aria-hidden="true" />
                Pass
              </span>
            </th>
            <th className="text-center py-3 px-3 font-medium text-muted text-xs w-16">
              <span className="flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-warn" aria-hidden="true" />
                Warn
              </span>
            </th>
            <th className="text-center py-3 px-3 font-medium text-muted text-xs w-16">
              <span className="flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-fail" aria-hidden="true" />
                Fail
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.name} className="border-b border-line last:border-b-0">
              <td className="py-3 pr-4">
                <p className="font-medium text-ink">{check.name}</p>
                <p className="text-xs text-muted mt-0.5">{check.description}</p>
              </td>
              <td className="text-center py-3 px-3 tabular-nums text-muted">
                {check.weight}%
              </td>
              <td className="text-center py-3 px-3 tabular-nums text-pass">
                {check.passCount}
              </td>
              <td className="text-center py-3 px-3 tabular-nums text-warn">
                {check.warnCount}
              </td>
              <td className="text-center py-3 px-3 tabular-nums text-fail">
                {check.failCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
