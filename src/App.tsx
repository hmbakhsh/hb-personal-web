import { ReactNode } from "react";
import "./index.css";
import "./App.css";
import GithubLogo from "../src/assets/github-logo.svg?react";
import XLogo from "../src/assets/x-logo.svg?react";
import MailLogo from "../src/assets/email.svg?react";

function App() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <div className="flex flex-col items-start gap-8 sm:gap-8">
          <div className="flex flex-col">
            <h1 className="sr-only">HB</h1>
            <img
              src="/haroon-ascii.svg"
              alt="Haroon Bakhsh ASCII wordmark"
              className="w-full max-w-[500px] self-start sm:max-w-[520px] md:max-w-[640px] lg:max-w-[720px]"
            />
            <p
              className="m-0 p-0 text-left text-base text-indigo-200/80 sm:text-lg md:text-xl md:w-3/5"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              building{" "}
              <a
                href="https://prismpms.com"
                className="underline underline-offset-2 text-bold text-indigo-300"
              >
                prismpms.com
              </a>{" "}
              — modern practice management for independent opticians. interested
              in ml/swe/finance.
            </p>
          </div>
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
        </div>
      </div>
    </div>
  );
}

function Button({
  buttonText,
  url,
  children,
}: {
  buttonText: string;
  url: string;
  children?: ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center justify-center border border-indigo-500 bg-indigo-900 px-3 py-1.5 text-xs text-indigo-200 transition-colors duration-300 hover:border-indigo-400 hover:bg-indigo-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900 sm:px-4 sm:py-2 sm:text-sm"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {buttonText}
    </a>
  );
}

export default App;
