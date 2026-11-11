import { PageLink } from "@/components/PageTransition";
import type { Project } from "@/lib/projects";

const rowClass =
  "reveal reveal-near group flex items-baseline border-t border-[var(--line)] py-2.5 last:border-b";

export default function ProjectRow({ project, delay }: { project: Project; delay: number }) {
  const style = { animationDelay: `${delay}s` };
  const content = (
    <>
      <h2 className="w-24 shrink-0 text-[16px] font-medium tracking-tight underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
        {project.name}
      </h2>
      <p className="min-w-0 flex-1 text-[16px] leading-6 text-[var(--grey-1)]">
        {project.description}
      </p>
    </>
  );

  return project.url ? (
    <a href={project.url} className={rowClass} style={style}>
      {content}
    </a>
  ) : (
    <PageLink href={`/projects/${project.slug}`} className={rowClass} style={style}>
      {content}
    </PageLink>
  );
}
