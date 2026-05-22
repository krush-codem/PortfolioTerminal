import React, { useState, useEffect, useRef } from "react";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const BOOT_SEQUENCE = [
  "Initializing Kernel 5.10.0-23-amd64...",
  "Loading HKB OS v2.0.5 [STABLE]",
  "Checking Hardware integrity...",
  "Memory Check: 65536KB OK",
  "Initializing Neural Link...",
  "Searching for Firebase Uplink...",
  "Connection established.",
  "Decryption keys loaded.",
  "System ready.",
];

export default function TerminalSystem() {
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [portfolioData, setPortfolioData] = useState({});

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom seamlessly
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, isBooting]);

  // Initial Boot Sequence Engine
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_SEQUENCE.length) {
        setLines((prev) => [
          ...prev,
          { type: "system", content: BOOT_SEQUENCE[currentLine] },
        ]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsBooting(false);
          addLines([
            { text: "Hi, I'm Harekrushna Behera, a Software Developer." },
            { text: "Welcome to my interactive portfolio terminal!" },
            { text: "Type 'help' to see available commands." },
          ]);
          connectToFirebase();
        }, 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const addLines = (newLines) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((line) => ({
        type: "output",
        content: line.text,
        link: line.link || null,
      })),
    ]);
  };

  const connectToFirebase = async () => {
    try {
      await signInAnonymously(auth);
      const docRef = doc(db, "portfolio", "mainContent");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPortfolioData(docSnap.data());
      }
      setLines((prev) => [
        ...prev,
        {
          type: "system",
          content: "Connection successful. Live content loaded.",
        },
      ]);
    } catch (error) {
      console.error("Firebase Error:", error);
      setLines((prev) => [
        ...prev,
        {
          type: "system",
          content: "Critical Error: Could not connect to Firebase.",
        },
      ]);
    }
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    setLines((prev) => [...prev, { type: "input", content: cmd }]);
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    switch (trimmedCmd) {
      case "help":
        addLines([
          {
            text: "Available commands: about, projects, skills, experience, clear, help",
          },
        ]);
        break;
      case "about": {
        const aboutText =
          portfolioData.about || "I'm a passionate software engineer...";
        addLines([{ text: aboutText }]);
        break;
      }
      case "skills": {
        const skills = portfolioData.skills || [];
        if (skills.length === 0) {
          addLines([{ text: "No skills found." }]);
        } else {
          const skillsList = [{ text: "Technical Skills:" }];
          skills.forEach((s) =>
            skillsList.push({ text: `- ${s.category}: ${s.items}` }),
          );
          addLines(skillsList);
        }
        break;
      }
      case "experience": {
        const exp = portfolioData.experience || [];
        if (exp.length === 0) {
          addLines([{ text: "No experience found." }]);
        } else {
          const expList = [{ text: "Work Experience:" }];
          exp.forEach((e) =>
            expList.push({ text: `${e.role} @ ${e.company} (${e.period})` }),
          );
          addLines(expList);
        }
        break;
      }
      case "projects": {
        const projects = portfolioData.projects || [];
        if (projects.length === 0) {
          addLines([{ text: "No projects found." }]);
        } else {
          const projectList = [{ text: "My Projects:" }];
          projects.forEach((p, i) => {
            projectList.push({
              text: `${i + 1}. ${p.name}: ${p.link}`,
              link: p.link,
            });
          });
          addLines(projectList);
        }
        break;
      }
      case "clear":
        setLines([]);
        break;
      default:
        addLines([{ text: `bash: command not found: ${trimmedCmd}` }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  return (
    <div
      className="bg-transparent text-[#00ff41] font-mono p-4 h-full w-full overflow-y-auto relative z-50 pointer-events-auto terminal-scrollbar-hidden mix-blend-screen"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden scrollbar tracks injection block */}
      <style>{`
        .terminal-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .terminal-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className="break-words leading-relaxed drop-shadow-[0_0_3px_rgba(0,255,65,0.6)]"
          >
            {line.type === "input" && (
              <span className="text-[#58a6ff]">user@portfolio:~$ </span>
            )}
            {line.type === "system" && (
              <span className="text-yellow-400">[SYSTEM]: </span>
            )}

            {line.link ? (
              <span>
                {line.content.split(line.link)[0]}
                <a
                  href={line.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-200 cursor-pointer transition-colors duration-150 inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {line.link}
                </a>
                {line.content.split(line.link)[1]}
              </span>
            ) : (
              <span>{line.content}</span>
            )}
          </div>
        ))}
        {isBooting && <div className="animate-pulse">_</div>}
      </div>

      {!isBooting && (
        <div className="flex mt-2 custom-terminal-input">
          <span className="text-[#58a6ff] mr-2 select-none">
            user@portfolio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-[#00ff41] flex-1 p-0 m-0 font-mono drop-shadow-[0_0_3px_rgba(0,255,65,0.6)]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      )}
      <div ref={terminalEndRef} />
    </div>
  );
}
