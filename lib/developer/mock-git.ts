import { GitCommit, EnvironmentVariable } from "./types";

export const INITIAL_GIT_COMMITS: GitCommit[] = [
  {
    id: "cmt_1",
    sha: "c9f28a1",
    message: "feat: improve ticket triage UI",
    author: "Frontend Agent",
    timestamp: "10 mins ago",
    branch: "main",
  },
  {
    id: "cmt_2",
    sha: "b7e4110",
    message: "feat: add AI response composer",
    author: "Architect Swarm",
    timestamp: "25 mins ago",
    branch: "main",
  },
  {
    id: "cmt_3",
    sha: "a189fd2",
    message: "feat: create SupportDesk dashboard",
    author: "Frontend Agent",
    timestamp: "1 hour ago",
    branch: "main",
  },
  {
    id: "cmt_4",
    sha: "8f4a21e",
    message: "chore: initial project setup",
    author: "Architect Lead",
    timestamp: "2 hours ago",
    branch: "main",
  },
];

export const INITIAL_ENV_VARIABLES: EnvironmentVariable[] = [
  {
    id: "env_1",
    key: "NEXT_PUBLIC_APP_NAME",
    value: "SupportDesk AI",
    isSecret: false,
    target: "production",
  },
  {
    id: "env_2",
    key: "NEXT_PUBLIC_API_URL",
    value: "https://api.supportdesk.ai/v1",
    isSecret: false,
    target: "production",
  },
  {
    id: "env_3",
    key: "SUPABASE_URL",
    value: "https://xyzcompany.supabase.co",
    isSecret: false,
    target: "production",
  },
  {
    id: "env_4",
    key: "SUPABASE_ANON_KEY",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoiYWJjIn0.8f4a21e",
    isSecret: true,
    target: "production",
  },
  {
    id: "env_5",
    key: "GROQ_API_KEY",
    value: "gsk_89fa9b8d234a19ef47bc230182",
    isSecret: true,
    target: "production",
  },
  {
    id: "env_6",
    key: "DATABASE_URL",
    value: "postgresql://postgres:dbpass_sec_991@db.xyzcompany.supabase.co:5432/postgres",
    isSecret: true,
    target: "production",
  },
];
