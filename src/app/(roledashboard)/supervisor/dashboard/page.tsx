//simple page
"use client";
import React from "react";
import { signOut } from "next-auth/react";
export default async function SupervisorPage() {
  return (
    <>
      <div>
        <button onClick={async () => await signOut()}>Sign out</button>
      </div>
    </>
  );
}
