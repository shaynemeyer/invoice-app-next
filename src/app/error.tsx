"use client";

import NextError from "next/error";

function ErrorPage({ error }: { error: Error }) {
  return <NextError statusCode={500} title={error.message} />;
}
export default ErrorPage;
