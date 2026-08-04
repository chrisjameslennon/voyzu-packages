"use client";

import { useCallback, useEffect, useState } from "react";

import { UglyPackagePage } from "./UglyPackagePage";
import styles from "./ugly-package.module.css";

interface ExchangePayload {
  request: unknown;
  responseBody: unknown;
}

interface Exchange {
  request: unknown;
  response: unknown;
}

export function RawRequestResponseClient({ pageExampleHtml }: { pageExampleHtml: string }) {
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(async () => {
    setError(null);
    const response = await fetch(`/api/ugly-package/raw-request-response?sent=${Date.now()}`);
    const payload = await response.json() as ExchangePayload;

    setExchange({
      request: payload.request,
      response: {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        cookies: [{
          name: "ugly-package-demo",
          value: "[HttpOnly]",
          sameSite: "lax",
          path: "/",
        }],
        body: payload.responseBody,
      },
    });
  }, []);

  useEffect(() => {
    sendRequest().catch((caught: unknown) => {
      setError(caught instanceof Error ? caught.message : "Request failed");
    });
  }, [sendRequest]);

  return (
    <UglyPackagePage active="request-response">
      <main className={styles.rawExchangeContent}>
        <h1>Raw request / response</h1>
        <div className={styles.pagesOverview}>
          <section className={styles.requestResponseExplanation}>
            <h2>Pages</h2>
            <p>
              Voyzu calls a registered page component in your package with any dynamic path parameters as named
              props. It also supplies a <code>surface</code> prop containing the current path, normalized query-string
              values, route metadata, Help configuration and whether the page is unframed.
            </p>
            <p>
              The component returns JSX—a React element tree—or a promise that resolves to one. Next.js renders that
              tree into the page and owns the HTTP response around it. A page component does not return a{" "}
              <code>NextResponse</code> directly.
            </p>
          </section>
          <aside
            className={styles.pageExample}
            aria-label="Page route and component example"
            dangerouslySetInnerHTML={{ __html: pageExampleHtml }}
          />
        </div>
        <section className={styles.requestResponseExplanation}>
          <h2>API</h2>
          <p>
            Package API handlers operate at the raw HTTP boundary. They receive a Next.js <code>NextRequest</code> and
            return a <code>NextResponse</code>, so they can set cookies and headers, choose a status, redirect the user,
            or return any supported response body.
          </p>
        </section>
        <h3 className={styles.tryItOut}>Try it out</h3>
        <p className={styles.tryItOutByline}>
          Send a GET request to <code>/api/ugly-package/raw-request-response</code>.
        </p>
        <button className={styles.sendAgainButton} type="button" onClick={() => void sendRequest()}>
          Send HTTP request
        </button>
        {error ? <p className={styles.exchangeError}>{error}</p> : null}
        <div className={styles.exchangeColumns}>
          <section>
            <h2>NextRequest received</h2>
            <pre><code>{exchange ? JSON.stringify(exchange.request, null, 2) : "Sending request..."}</code></pre>
          </section>
          <section>
            <h2>NextResponse sent</h2>
            <pre><code>{exchange ? JSON.stringify(exchange.response, null, 2) : "Waiting for response..."}</code></pre>
          </section>
        </div>
        <p className={styles.redactionNote}>
          Cookie and authorization values are deliberately redacted before display.
        </p>
      </main>
    </UglyPackagePage>
  );
}
