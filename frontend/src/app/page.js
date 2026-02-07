"use client";

import { useState } from "react";
import { greet, add } from "./actions";
import styles from "./page.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [numA, setNumA] = useState("");
  const [numB, setNumB] = useState("");
  const [sum, setSum] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGreet(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const result = await greet(name);
      setGreeting(result);
    } catch (err) {
      setGreeting(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const a = parseFloat(numA);
    const b = parseFloat(numB);
    if (isNaN(a) || isNaN(b)) return;
    setLoading(true);
    try {
      const result = await add(a, b);
      setSum(String(result));
    } catch (err) {
      setSum(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Graftcode Demo</h1>
        <p className={styles.subtitle}>
          Next.js frontend calling a Python backend via Graftcode Gateway
        </p>

        <section className={styles.card}>
          <h2>Greeting Service</h2>
          <p className={styles.description}>
            Calls <code>HelloWorld.greet(name)</code> on the Python backend
          </p>
          <form onSubmit={handleGreet} className={styles.form}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Calling..." : "Greet"}
            </button>
          </form>
          {greeting && <p className={styles.result}>{greeting}</p>}
        </section>

        <section className={styles.card}>
          <h2>Calculator</h2>
          <p className={styles.description}>
            Calls <code>HelloWorld.add(a, b)</code> on the Python backend
          </p>
          <form onSubmit={handleAdd} className={styles.form}>
            <input
              type="number"
              value={numA}
              onChange={(e) => setNumA(e.target.value)}
              placeholder="a"
              className={styles.input}
            />
            <span className={styles.operator}>+</span>
            <input
              type="number"
              value={numB}
              onChange={(e) => setNumB(e.target.value)}
              placeholder="b"
              className={styles.input}
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Calling..." : "Add"}
            </button>
          </form>
          {sum && (
            <p className={styles.result}>
              Result: <strong>{sum}</strong>
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
