import Link from "next/link";
import type { Crumb } from "./blogMeta";

const LINK_CLASS = "hover:text-brand-orange-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded";

/** Visible breadcrumb trail; the last crumb is the current page. */
export function Breadcrumbs({ crumbs }: { crumbs: readonly Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0 text-sm text-slate-600" role="list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-brand-navy font-medium line-clamp-1">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className={LINK_CLASS}>
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
