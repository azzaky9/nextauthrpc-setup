import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import * as z from "zod";

const t = initTRPC.create({
  transformer: superjson
});

type Data = {
  name: string;
};

export const appRouter = t.router({
  greetings: t.procedure.query(async () => {
    return "Hello from tRPC and Next Js 13";
  }),
  greetName: t.procedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation((opts) => {
      return `Hello ${opts.input.name} from from tRPC and Next Js 13`;
    })
});

export type AppRouter = typeof appRouter;
