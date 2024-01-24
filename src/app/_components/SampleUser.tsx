"use client";

import * as React from "react";
import { trpc } from "@/client/trpc-client";

export default function SampleUser() {
  const { data, isLoading, isFetching } = trpc.greetings.useQuery();
  const greetName = trpc.greetName.useMutation();

  const getSayed = () => greetName.mutate({ name: "Zaky" });

  if (isFetching || isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>with query: {data}</p>
      <button onClick={getSayed}>Click to check your name</button>
      {greetName.data && <p>{greetName.data}</p>}
    </div>
  );
}
