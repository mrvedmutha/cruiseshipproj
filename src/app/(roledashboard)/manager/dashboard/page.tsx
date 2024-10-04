//simple page
"use client";
import React from "react";
import { signOut } from "next-auth/react";
export default async function ManagerPage() {
  return (
    <>
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </>
  );
}
