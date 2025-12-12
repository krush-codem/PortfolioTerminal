// src/components/ContactSection.jsx
import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import RiveRenderer from "./RiveRenderer";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaDiscord,
  FaHeart,
  FaEye,
} from "react-icons/fa";

import { db } from "../firebase";
import {
  doc,
  runTransaction,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ---------- small helpers ---------- */

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/krush-codem",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/harekrushnabehera121",
    icon: FaLinkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_.h._a._r._e._",
    icon: FaInstagram,
  },
  {
    label: "Discord",
    href: "https://discordapp.com/users/krush_unknownsai",
    icon: FaDiscord,
  },
];

const arcadeGames = [
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Classic Tic-Tac-Toe with a twist of animation.",
    riveFile: "/rive/tictac.riv",
  },
  {
    id: "Hit-Road",
    name: "Hit-Road",
    description: "Dodge the obstacles and hit the road!",
    riveFile: "/rive/hitroad.riv",
  },
  {
    id: "Chameleon-Catch",
    name: "Chameleon-Catch",
    description: "Click & catch the bees as they appear!",
    riveFile: "/rive/char.riv",
  },
  {
    id: "Maze-Runner",
    name: "Maze-Runner",
    description: "Find your way through the maze.",
    riveFile: "/rive/maze.riv",
  },
  {
    id: "Bunny-choose",
    name: "Bunny-Choose",
    description: "Help the bunny choose the right Card!",
    riveFile: "/rive/memory.riv",
  },
];

/* ---------- animated number helper ---------- */

function AnimatedCounter({ value }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(value ?? 0);

  useEffect(() => {
    const to = value ?? 0;
    const controls = animate(mv, to, {
      duration: 0.5,
      ease: "easeOut",
    });

    const unsub = mv.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [value, mv]);

  return <span>{display}</span>;
}

/* ---------- MAIN CONTACT SECTION ---------- */

export default function ContactSection() {
  const [mode, setMode] = useState("contact"); // "contact" | "arcade"
  const [stats, setStats] = useState({ likes: 0, views: 0 });
  const [liking, setLiking] = useState(false);

  // view tracking
  const hasCountedViewRef = useRef(false);
  const sectionRef = useRef(null);

  // --- Firestore: listen to stats doc in real time ---
  useEffect(() => {
    const ref = doc(db, "meta", "contactStats");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setStats({
            likes: data.likes || 0,
            views: data.views || 0,
          });
        }
      },
      (err) => {
        console.error("contactStats onSnapshot error:", err);
      }
    );

    return unsub;
  }, []);

  // --- Increment views once per browser, only when section scrolls into view ---
  useEffect(() => {
    if (!sectionRef.current) return;

    const viewedKey = "contact_viewed_v1";

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (hasCountedViewRef.current) return;

        if (typeof window !== "undefined" && localStorage.getItem(viewedKey)) {
          hasCountedViewRef.current = true;
          return;
        }

        hasCountedViewRef.current = true;
        if (typeof window !== "undefined") {
          localStorage.setItem(viewedKey, "true");
        }

        const ref = doc(db, "meta", "contactStats");
        runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists()) {
            tx.set(ref, { likes: 0, views: 1 });
          } else {
            const current = snap.data();
            tx.update(ref, {
              views: (current.views || 0) + 1,
            });
          }
        }).catch((err) => {
          console.error("view increment error:", err);
        });
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLike = async () => {
    if (liking) return;
    const likedKey = "contact_liked_v1";
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(likedKey) === "true"
    )
      return;

    try {
      setLiking(true);
      const ref = doc(db, "meta", "contactStats");
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) {
          tx.set(ref, { likes: 1, views: 0 });
        } else {
          const current = snap.data();
          tx.update(ref, {
            likes: (current.likes || 0) + 1,
          });
        }
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(likedKey, "true");
      }
    } catch (err) {
      console.error("like error:", err);
    } finally {
      setLiking(false);
    }
  };

  // ---------- SMOOTH CROSSFADE WORD ROTATION (RELIABLE LOOP) ----------
  const headerWords = ["wild", "innovative", "fun"];
  const [wordIndex, setWordIndex] = useState(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    // respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      reducedMotionRef.current =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // interval that advances the word index reliably
    // if reduced motion is on, still rotate but without the fancy timing; interval is longer
    const intervalMs = reducedMotionRef.current ? 3000 : 2600;
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % headerWords.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, []);

  const headerActiveWord = headerWords[wordIndex];

  // crossfade variants: gentle fade out then fade in
  // we use AnimatePresence mode="wait" so exit completes before enter
  const wordVariants = {
    initial: { opacity: 0, y: 0, scale: 1 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 0,
      scale: 0.99,
      transition: { duration: 0.65, ease: "easeInOut" },
    },
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-black text-white pt-16 mb-13 overflow-hidden"
    >
      {/* small inline style to ensure highlighted word spacing */}
      <style>{`
        .header-word-wrapper { display:inline-block; min-width:5ch; }
        @media (prefers-reduced-motion: reduce) {
          .jump-word { transition:none !important; }
        }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-40 bg-red-600/40 blur-3xl" />

      {/* MAIN CONTENT */}
      <motion.div
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        animate={{ opacity: mode === "contact" ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-red-400 mb-2">
              Contact
            </p>

            {/* UPDATED heading: smooth crossfade for the last word */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Let&apos;s build something{" "}
              <span
                className="header-word-wrapper"
                aria-live="polite"
                aria-atomic
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={wordIndex} // key by index so AP handles exit -> enter properly
                    className="inline-block jump-word"
                    variants={wordVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ display: "inline-block" }}
                  >
                    <span className="text-red-400" aria-hidden>
                      {headerActiveWord}
                    </span>
                    <span className="sr-only">{headerActiveWord}</span>
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>

          {/* Likes / views */}
          <div className="flex flex-col items-end text-[11px] uppercase tracking-[0.2em] text-gray-400 gap-1">
            <button
              onClick={handleLike}
              disabled={liking}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/60 bg-red-500/10 hover:bg-red-500/70 hover:text-black transition-colors text-[10px]"
            >
              <FaHeart className="text-red-400" />
              <span>Like</span>
              <span className="font-mono text-xs text-red-200">
                {stats.likes}
              </span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px]">
              <FaEye className="text-gray-300" />
              <span>Views</span>
              <span className="font-mono text-xs">
                <AnimatedCounter value={stats.views} />
              </span>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 lg:gap-12">
          <ContactLeftColumn />
          <div className="relative min-h-[260px]">
            <ArcadeCard onEnterArcade={() => setMode("arcade")} />
          </div>
        </div>
      </motion.div>

      {/* FULL-SECTION ARCADE OVERLAY */}
      <AnimatePresence>
        {mode === "arcade" && (
          <ArcadeOverlay
            key="arcade-overlay-full"
            onExit={() => setMode("contact")}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- LEFT: socials + comments ---------- */

function ContactLeftColumn() {
  return (
    <div className="space-y-8">
      {/* intro text */}
      <div className="space-y-3 max-w-xl">
        <p className="text-sm md:text-base text-gray-300">
          Want to talk about a project, internship, or just geek out about
          motion design and game-like interfaces? Reach out anywhere below – I
          actually read my DMs.
        </p>
      </div>

      {/* social icons */}
      <div className="flex flex-wrap gap-3">
        {SOCIALS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-2
              px-3 py-2 rounded-full
              border border-white/15
              bg-white/5
              hover:bg-red-500 hover:text-black hover:border-red-400
              transition-colors text-sm
            "
          >
            <Icon />
            <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
          </a>
        ))}
      </div>

      {/* comments slider */}
      <CommentsSlider />
    </div>
  );
}

/* ---------- Comments slider + add comment (unchanged logic) ---------- */

function CommentsSlider() {
  const [comments, setComments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "contactComments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setComments(data);
      },
      (err) => console.error("comments onSnapshot error:", err)
    );
    return unsub;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let rafId = null;
    const updateProgress = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) setScrollProgress(1);
      else
        setScrollProgress(Math.max(0, Math.min(1, el.scrollLeft / maxScroll)));
    };
    const onScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = null;
      });
    };
    updateProgress();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [comments.length]);

  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.8);
    scrollByAmount(-step);
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.8);
    scrollByAmount(step);
  };

  const atStart = scrollProgress <= 0.03;
  const atEnd = scrollProgress >= 0.97;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adding) return;
    const formData = new FormData(e.target);
    const name = formData.get("name")?.toString().trim() || "Anonymous";
    const message = formData.get("message")?.toString().trim();
    if (!message) return;
    try {
      setAdding(true);
      await addDoc(collection(db, "contactComments"), {
        name,
        message,
        createdAt: serverTimestamp(),
      });
      e.target.reset();
      setShowForm(false);
      const el = scrollRef.current;
      if (el) el.scrollTo({ left: 0, behavior: "smooth" });
    } catch (err) {
      console.error("add comment error:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="relative mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-[0.35em] uppercase text-red-400">
          Feedback
        </p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-xs tracking-[0.25em] uppercase px-3 py-1 rounded-full border border-red-500/60 hover:bg-red-500 hover:text-black transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="relative">
        {comments.length > 0 && (
          <button
            onClick={handlePrev}
            disabled={atStart}
            aria-label="Scroll feedback left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-1 w-9 h-9 rounded-full flex items-center justify-center border bg-black/40 hover:bg-black/60 transition ${
              atStart ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            style={{ backdropFilter: "blur(4px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6L9 12L15 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
        >
          {comments.map((c) => (
            <div
              key={c.id}
              className="min-w-[230px] max-w-xs snap-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-500/70 flex items-center justify-center text-xs font-semibold">
                  {(c.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold">
                    {c.name || "Anonymous"}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    Visitor
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-200">{c.message}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="min-w-[230px] max-w-xs snap-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-gray-400">
              No comments yet – be the first to leave something nice.
            </div>
          )}
        </div>

        {comments.length > 0 && (
          <button
            onClick={handleNext}
            disabled={atEnd}
            aria-label="Scroll feedback right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 mr-1 w-9 h-9 rounded-full flex items-center justify-center border bg-black/40 hover:bg-black/60 transition ${
              atEnd ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            style={{ backdropFilter: "blur(4px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className="mt-1.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-red-500"
            animate={{
              width: `${
                Math.max(scrollProgress, comments.length > 0 ? 0.08 : 0) * 100
              }%`,
            }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 18,
              mass: 0.4,
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="comment-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-lg mx-4 rounded-2xl border border-red-500/40 bg-black px-5 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-[0.25em] uppercase text-red-300">
                  Drop a note
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-200"
                >
                  Close ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Your name (optional)"
                  className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:border-red-400"
                />
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="What did you think of this portfolio?"
                  className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:border-red-400 resize-none"
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-black text-xs tracking-[0.25em] uppercase disabled:opacity-60"
                >
                  {adding ? "Sending..." : "Send review"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- RIGHT: Arcade station card ---------- */

function ArcadeCard({ onEnterArcade }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ amount: 0.4, once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        relative h-full
        rounded-3xl border  border-red-500/40 bg-gradient-to-br from-red-900/40 via-black to-black
        overflow-hidden
        flex flex-col
      "
    >
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.35em] uppercase text-red-300">
            Arcade Station
          </p>
          <h3 className="text-xl font-semibold">Break time for your brain</h3>
          <p className="text-sm text-gray-300">
            A little corner for interactive experiments built with Rive. Hit
            resume to open the arcade and play with some prototypes.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onEnterArcade}
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-black text-xs tracking-[0.25em] uppercase"
          >
            Resume ▷
          </button>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Games · Fun
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 right-0 w-40 h-40 bg-red-500/40 blur-3xl" />
    </motion.div>
  );
}

/* ---------- Full-section arcade overlay (inside contact section) ---------- */

function ArcadeOverlay({ onExit }) {
  const [activeGame, setActiveGame] = useState(null);
  const [gameStats, setGameStats] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "gameStats"),
      (snap) => {
        const data = {};
        snap.forEach((d) => {
          data[d.id] = d.data().playCount || 0;
        });
        setGameStats(data);
      },
      (err) => console.error("gameStats onSnapshot error:", err)
    );
    return unsub;
  }, []);

  const handleOpenGame = async (gameId) => {
    setActiveGame(gameId);
    try {
      const ref = doc(db, "gameStats", gameId);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) tx.set(ref, { playCount: 1 });
        else tx.update(ref, { playCount: (snap.data().playCount || 0) + 1 });
      });
    } catch (err) {
      console.error("increment playCount error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 z-30 bg-black/95 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10">
        <button
          onClick={onExit}
          className="text-xs tracking-[0.25em] uppercase px-3 py-1 rounded-full border border-white/20 hover:bg-white/10"
        >
          ← Contact
        </button>
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.25em]">
          HKB · Arcade
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs tracking-[0.3em] uppercase text-red-300 mb-2">
            Games
          </p>

          {arcadeGames.map((game) => {
            const isActive = activeGame === game.id;
            const plays = gameStats[game.id] ?? 0;

            return (
              <motion.div
                key={game.id}
                layout
                className={`relative w-full rounded-2xl border cursor-pointer overflow-hidden transition-colors ${
                  isActive
                    ? "border-red-500 bg-red-500 text-black"
                    : "border-white/10 bg-white/5 hover:bg-red-500/20"
                }`}
                onClick={() => {
                  if (!isActive) handleOpenGame(game.id);
                }}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {game.name}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive ? "text-black/80" : "text-gray-300"
                      } truncate`}
                    >
                      {game.description}
                    </p>
                  </div>

                  <div
                    className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] ${
                      isActive
                        ? "bg-black/20 text-black"
                        : "bg-black/50 text-white"
                    }`}
                  >
                    Plays: <AnimatedCounter value={plays} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="game-body"
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveGame(null);
                          }}
                          className="absolute z-10 top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border bg-red-500/80 border-white/40 hover:bg-red-500/65"
                        >
                          ×
                        </button>
                        <div className="w-full aspect-[16/9] bg-black">
                          <RiveRenderer src={game.riveFile} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
