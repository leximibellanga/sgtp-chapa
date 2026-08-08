import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrump({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-emerald-950/60 mb-4">
        <Link to={`/admin/dashboard`} className="hover:text-emerald-800">
            <Home size={14} />
        </Link>
        {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
                <ChevronRight size={14} />
                {item.to ? (
                    <Link className="hover:text-emerald-800">
                        {item.label}
                    </Link>
                ): (
                    <span className="text-emerald-800 font-medium">
                        {item.label}
                    </span>
                )}
            </span>
        ))}
    </nav>
  );
}
