import type { AppRouter } from "@/server/trpc-route";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
