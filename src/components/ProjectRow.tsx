import type { Project } from "@/lib/projects";
import { HackyIcon, NotchIcon, RootieIcon } from "@/components/projects/icons";

const icons = { rootie: RootieIcon, notch: NotchIcon, hacky: HackyIcon };

export default function ProjectRow({ project, delay }: { project: Project; delay: number }) {
  const Icon = icons[project.slug];

  return (
    <a
      href={project.url ?? `https://${project.slug}.hbak.co`}
      className="reveal group flex items-start gap-4 border-t border-[var(--line)] py-5 last:border-b"
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="mt-px h-[26px] w-[26px] shrink-0 opacity-85 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0" />
      <div className="min-w-0 flex-1">
        <h2 className="text-[17px] font-medium tracking-tight underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
          {project.name}
        </h2>
        <p className="mt-1.5 max-w-[29rem] text-[16px] leading-relaxed text-[var(--grey-1)]">
          {project.description}
        </p>
      </div>
    </a>
  );
}
