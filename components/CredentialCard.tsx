import { Award, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ipfsUrl } from "@/lib/ipfs";

interface CredentialCardProps {
  id:         string;
  type:       string;
  session:    string;
  issuedAt:   string;
  ipfsCid:    string;
  revoked:    boolean;
  degreeClass?: string;
}

export function CredentialCard({
  id,
  type,
  session,
  issuedAt,
  ipfsCid,
  revoked,
  degreeClass,
}: CredentialCardProps) {
  return (
    <div className={`card-glass rounded-xl p-5 space-y-3 border ${revoked ? "border-red-500/20" : "border-su-gold/20"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${revoked ? "bg-red-500/10" : "bg-su-gold/10"}`}>
            <Award className={`w-5 h-5 ${revoked ? "text-red-400" : "text-su-gold"}`} />
          </div>
          <div>
            <p className="text-white font-semibold">{type}</p>
            <p className="text-su-text text-xs">{session} · Issued {issuedAt}</p>
          </div>
        </div>
        {revoked ? (
          <span className="flex items-center gap-1 text-red-400 text-xs shrink-0">
            <XCircle className="w-3.5 h-3.5" /> Revoked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-su-green text-xs shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
          </span>
        )}
      </div>

      {degreeClass && (
        <Badge variant="gold">{degreeClass}</Badge>
      )}

      <div className="flex items-center justify-between text-xs text-su-text">
        <span className="font-mono truncate max-w-[200px]">{id.slice(0, 20)}…</span>
        <a
          href={ipfsUrl(ipfsCid)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-su-gold hover:underline shrink-0"
        >
          View on IPFS <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
