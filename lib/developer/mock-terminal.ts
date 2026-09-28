import { TerminalEntry } from "./types";

export const INITIAL_TERMINAL_ENTRIES: TerminalEntry[] = [
  {
    id: "entry_init_1",
    type: "info",
    content: "Architect Developer Workspace v2.4.0 (x86_64-apple-darwin23)\nProject: supportdesk-ai · Branch: main · TypeScript 5.4",
  },
  {
    id: "entry_init_2",
    type: "command",
    content: "npm run build",
  },
  {
    id: "entry_init_3",
    type: "output",
    content: `> supportdesk-ai@2.4.0 build
> next build

▲ Next.js 14.2.0 (Turbopack)
✓ Compiled successfully in 280ms
✓ Finished TypeScript in 410ms
✓ Generating static pages (6/6) in 82ms
Finalizing page optimization in 8ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/tickets
└ ○ /inbox

Build completed successfully. Zero errors, zero warnings.`,
  },
];

/**
 * Deterministic command runner for developer mode terminal
 */
export function executeSimulatedCommand(
  rawCommand: string,
  modifiedFileCount: number = 0,
  modifiedFileNames: string[] = []
): TerminalEntry[] {
  const cmd = rawCommand.trim();
  const idBase = `cmd_${Math.abs(hashString(cmd))}`;

  const commandEntry: TerminalEntry = {
    id: `${idBase}_in`,
    type: "command",
    content: cmd,
  };

  const lowered = cmd.toLowerCase();

  let outputContent = "";
  let outputType: TerminalEntry["type"] = "output";

  switch (lowered) {
    case "npm run build":
      outputContent = `> supportdesk-ai@2.4.0 build
> next build

▲ Next.js 14.2.0 (Turbopack)
✓ Compiled successfully in 210ms
✓ Finished TypeScript in 380ms
✓ Collecting page data in 190ms
✓ Generating static pages (6/6) in 75ms

Build completed successfully.`;
      break;

    case "npm run lint":
      outputContent = `> supportdesk-ai@2.4.0 lint
> eslint

✔ No ESLint warnings or errors found.`;
      break;

    case "git status":
      if (modifiedFileCount === 0) {
        outputContent = `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`;
      } else {
        outputContent = `On branch main
Changes not staged for commit:
  (use "git commit -m <msg>" in Source Control)
${modifiedFileNames.map((f) => `\tmodified:   ${f}`).join("\n")}

no changes added to commit`;
      }
      break;

    case "git log":
    case "git log -n 3":
      outputContent = `commit c9f28a1 (HEAD -> main, origin/main)
Author: Frontend Agent <agent.fe@architect.internal>
Date:   Fri Sep 25 11:30:00 2026

    feat: improve ticket triage UI

commit b7e4110
Author: Architect Swarm <swarm@architect.internal>
Date:   Fri Sep 25 11:15:00 2026

    feat: add AI response composer

commit a189fd2
Author: Frontend Agent <agent.fe@architect.internal>
Date:   Fri Sep 25 10:40:00 2026

    feat: create SupportDesk dashboard`;
      break;

    case "git branch":
      outputContent = `* main
  feature/auth-guard`;
      break;

    case "pwd":
      outputContent = `/projects/prj_supportdesk`;
      break;

    case "ls":
    case "ls -la":
      outputContent = `total 48
drwxr-xr-x   9 developer  staff   288 Sep 25 11:42 .
drwxr-xr-x   5 developer  staff   160 Sep 25 10:00 ..
-rw-r--r--   1 developer  staff   215 Sep 25 10:00 .env.example
drwxr-xr-x   3 developer  staff    96 Sep 25 10:00 public
drwxr-xr-x   7 developer  staff   224 Sep 25 10:00 src
-rw-r--r--   1 developer  staff   582 Sep 25 10:00 package.json
-rw-r--r--   1 developer  staff   620 Sep 25 10:00 README.md`;
      break;

    case "help":
      outputContent = `Available commands in Developer Mode:
  npm run build    Build the Next.js production bundle
  npm run lint     Run code quality and ESLint assertions
  git status       Inspect current working tree changes
  git log          Display recent commit history
  git branch       List local Git branches
  pwd              Print working directory
  ls               List directory contents
  clear            Clear terminal buffer`;
      break;

    default:
      outputType = "info";
      outputContent = `Command "${cmd}" simulated in Architect prototype.\nType "help" to view the available command set.`;
  }

  const outputEntry: TerminalEntry = {
    id: `${idBase}_out`,
    type: outputType,
    content: outputContent,
  };

  return [commandEntry, outputEntry];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
