import { StatusBar } from "@/components/StatusBar";
import { Button } from "@/components/Button";
import { GitHubCalendarWrapper } from "@/components/GitHubCalendarWrapper";
import { LogsSection } from "@/components/LogsSection";
import { GithubLogo, XLogo, MailLogo } from "@/components/icons";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();

  const logs = articles.map((article) => ({
    timestamp: article.frontmatter.date,
    type: article.frontmatter.type,
    subject: article.frontmatter.title,
    url: `/blog/${article.frontmatter.slug}`,
  }));

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <div className="flex flex-col items-start gap-8 sm:gap-8">
          <StatusBar />
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <h1 className="sr-only">HB</h1>
              <img
                src="/haroon-ascii.svg"
                alt="Haroon Bakhsh ASCII wordmark"
                className="w-full max-w-[500px] self-start sm:max-w-[520px] md:max-w-[640px] lg:max-w-[720px]"
              />
            </div>
            <p
              className="m-0 p-0 text-left text-base text-indigo-200/50 sm:text-lg md:text-xl md:w-4/5"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              <span className="font-extrabold text-indigo-300">
                building{" "}
                <a
                  href="https://prismpms.com"
                  className="underline underline-offset-2 text-bold"
                >
                  prismpms.com
                </a>
              </span>{" "}
              modern practice management for independent opticians
            </p>
          </div>
          <GitHubCalendarWrapper />
          <div className="flex w-full gap-2 overflow-x-auto sm:gap-4">
            <Button buttonText="x" url="https://x.com/hmbakhsh">
              <XLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
            <Button buttonText="github" url="https://github.com/hmbakhsh">
              <GithubLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
            <Button buttonText="mail" url="mailto:h@hbak.co">
              <MailLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
          </div>
          <LogsSection logs={logs} />
        </div>
      </div>
    </div>
  );
}
