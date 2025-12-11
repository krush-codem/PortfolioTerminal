// src/components/DeveloperView.jsx
import { useEffect } from "react";
import ProfileCard from "./ProfileCard";
import * as THREE from "three";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function DeveloperView({ active, onClose }) {
  useEffect(() => {
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");
    const container = document.getElementById("card-container");

    if (!terminalOutput || !terminalInput || !container) return;

    // ---- Firebase config from env ----
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    let portfolioData = {};
    let db, auth;
    let scene, camera, renderer, card;
    let targetRotationX = 0,
      targetRotationY = 0;
    let animationId = null;

    // ---- CONTENT STORE ----
    const contentStore = {
      contentDocRef: null,
      adminDocRef: null,

      initialize: (firestore) => {
        contentStore.contentDocRef = doc(firestore, "portfolio", "mainContent");
        contentStore.adminDocRef = doc(firestore, "portfolio", "admin");
      },

      getDefaults: () => ({
        about: `I'm a passionate software engineer...`,
        projects: [
          {
            name: "Portfolio Terminal",
            description: "This interactive portfolio!...",
            link: "https://github.com/DynamicHarekrushna",
          },
        ],
        skills: [
          {
            category: "Languages",
            items: "JavaScript, Python, HTML5, CSS3, SQL",
          },
        ],
        experience: [
          {
            role: "Software Engineer Intern",
            company: "Tech Company Inc.",
            period: "Summer 2024",
            details: "- Developed and maintained features...",
          },
        ],
        contact: {
          email: "your.email@example.com",
          linkedin: "linkedin.com/in/yourprofile",
          github: "github.com/yourusername",
        },
        education: `Bachelor of Science in Computer Science...`,
        certifications: `- Certified Cloud Practitioner | AWS`,
        leadership: `- President, University Coding Club (2023-2024)`,
      }),

      loadContent: async () => {
        try {
          const docSnap = await getDoc(contentStore.contentDocRef);
          if (docSnap.exists()) {
            portfolioData = docSnap.data();
          } else {
            const defaults = contentStore.getDefaults();
            await contentStore.saveContent(defaults);
            portfolioData = defaults;
          }
        } catch (error) {
          console.error("Error loading content from Firestore:", error);
          portfolioData = contentStore.getDefaults();
          throw error;
        }
      },

      saveContent: async (content) => {
        try {
          await setDoc(contentStore.contentDocRef, content);
        } catch (error) {
          console.error("Error saving content to Firestore:", error);
          typeLine("Error: Could not save changes to the database.");
        }
      },
    };

    // ---- FORMATTERS ----
    const formatters = {
      about: () => portfolioData.about,
      projects: () => {
        if (!portfolioData.projects || portfolioData.projects.length === 0)
          return "No projects found.";
        return (
          `Here are some of my projects:\n\n` +
          portfolioData.projects
            .map(
              (p, i) =>
                `${i + 1}. <a href="${p.link || "#"}" target="_blank">${
                  p.name
                }</a>\n   ${p.description.replace(/\n/g, "\n   ")}`
            )
            .join("\n\n")
        );
      },
      skills: () => {
        if (!portfolioData.skills || portfolioData.skills.length === 0)
          return "No skills found.";
        return (
          "I'm proficient in the following technologies:\n" +
          portfolioData.skills
            .map((s) => `\n- ${s.category}: ${s.items}`)
            .join("")
        );
      },
      experience: () => {
        if (!portfolioData.experience || portfolioData.experience.length === 0)
          return "No experience found.";
        return portfolioData.experience
          .map((e) => `${e.role} | ${e.company} | ${e.period}\n${e.details}`)
          .join("\n\n");
      },
      contact: () => {
        return `You can reach me via:\n\n- LinkedIn: <a href="https://www.linkedin.com/in/harekrushnabehera121/" target="_blank">linkedin.com/in/harekrushnabehera121</a>\n- GitHub: <a href="https://github.com/DynamicHarekrushna" target="_blank">github.com/DynamicHarekrushna</a>\n- Email: <a href="mailto:harekrushnabehera2006@gmail.com" target="_blank">harekrushnabehera2006@gmail.com</a>`;
      },
      education: () => portfolioData.education,
      certifications: () => portfolioData.certifications,
      leadership: () => portfolioData.leadership,
    };

    // ---- COMMANDS ----
    const commands = {
      welcome: () =>
        `Hi, I'm Harekrushna Behera, a Software Developer.\nWelcome to my interactive portfolio terminal!\nType 'help' to see available commands.`,
      help: () =>
        `Available commands:\n  welcome        - Display the welcome message\n  about          - Learn more about me\n  projects       - View my recent projects\n  skills         - See my technical skills\n  experience     - Check out my work experience\n  contact        - Get in touch with me\n  education      - My academic background\n  clear          - Clear the terminal screen\n  `,
      troubleshoot: () =>
        `--- Firebase Connection Troubleshooting ---\n\nThe "client is offline" or "could not connect" error is usually due to your Firebase project's configuration.\n\nPlease check the following in your Firebase Console:\n\n1. <span class='text-yellow-400'>Is Firestore Database Created?</span>\n   Go to Build > Firestore Database. Click 'Create database' if you see it.\n\n2. <span class='text-yellow-400'>Are Anonymous Sign-ins Enabled?</span>\n   Go to Build > Authentication > Sign-in method. Make sure 'Anonymous' is enabled.\n\n3. <span class='text-yellow-400'>Are Security Rules Correct?</span>\n   In Firestore, go to the 'Rules' tab and ensure they allow reads. You need specific rules for this app to work (see documentation).\n\n4. <span class='text-yellow-400'>Is the domain authorized?</span>\n   Go to Authentication > Settings > Authorized domains. Make sure 'localhost' or your deployed site's domain is on the list.`,
      about: () => formatters.about(),
      projects: () => formatters.projects(),
      skills: () => formatters.skills(),
      experience: () => formatters.experience(),
      contact: () => formatters.contact(),
      education: () => formatters.education(),
      certifications: () => formatters.certifications(),
      leadership: () => formatters.leadership(),
      sudo: () => `Usage: sudo update <section> <action>`,
      clear: () => {
        const children = Array.from(terminalOutput.children);
        children.forEach((child) => {
          if (!child.classList.contains("mb-4")) child.remove();
        });
        return null;
      },
    };

    let commandHistory = [];
    let historyIndex = -1;
    let isCommandExecuting = false;
    const commandQueue = [];

    function typeLine(line, speed = 15, callback = () => {}) {
      const outputLine = document.createElement("div");
      outputLine.classList.add("output-line");
      terminalOutput.appendChild(outputLine);

      if (line.includes("<") && line.includes(">")) {
        outputLine.innerHTML = line;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        setTimeout(callback, speed * 2);
        return;
      }

      let i = 0;
      function type() {
        if (i < line.length) {
          outputLine.textContent += line.charAt(i);
          i++;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          setTimeout(type, speed);
        } else {
          callback();
        }
      }
      type();
    }

    function SudoManager() {
      const authenticate = async () => {
        const enteredPassword = prompt("Enter administrator password:");
        if (enteredPassword === null) return false;

        try {
          const adminDocSnap = await getDoc(contentStore.adminDocRef);
          if (adminDocSnap.exists()) {
            const storedPassword = adminDocSnap.data().password;
            if (enteredPassword === storedPassword) {
              return true;
            } else {
              typeLine("\nError: Incorrect password.");
              return false;
            }
          } else {
            typeLine("\nNo admin password found. Let's set one up.");
            const newPassword = prompt(
              "Please create a new administrator password:"
            );
            if (newPassword) {
              await setDoc(contentStore.adminDocRef, { password: newPassword });
              typeLine(
                "\nPassword created successfully. Please run the command again to continue."
              );
            }
            return false;
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          typeLine(
            "\nError: Could not verify password. Check Firestore permissions."
          );
          return false;
        }
      };

      const actions = {
        set: (section) => {
          const newValue = prompt(
            `Enter new content for '${section}':`,
            portfolioData[section] || ""
          );
          if (newValue !== null) portfolioData[section] = newValue;
        },
        add: {
          projects: () => {
            const name = prompt("Enter project name:");
            if (!name) return;
            const description = prompt("Enter project description:");
            if (description === null) return;
            const link = prompt("Enter project link (URL):", "https://");
            if (link === null) return;
            if (!portfolioData.projects) portfolioData.projects = [];
            portfolioData.projects.push({ name, description, link });
          },
          skills: () => {
            const category = prompt("Enter skill category (e.g., Languages):");
            if (!category) return;
            const items = prompt("Enter skills (comma-separated):");
            if (items === null) return;
            if (!portfolioData.skills) portfolioData.skills = [];
            portfolioData.skills.push({ category, items });
          },
          experience: () => {
            const role = prompt("Enter role:");
            if (!role) return;
            const company = prompt("Enter company:");
            if (company === null) return;
            const period = prompt("Enter period (e.g., Summer 2024):");
            if (period === null) return;
            const details = prompt("Enter details (use \\n for new lines):");
            if (details === null) return;
            if (!portfolioData.experience) portfolioData.experience = [];
            portfolioData.experience.push({ role, company, period, details });
          },
        },
        remove: (section) => {
          const items = portfolioData[section];
          if (!items || items.length === 0) {
            typeLine(`\nNothing to remove in '${section}'.`);
            return;
          }
          const list = items
            .map(
              (item, i) =>
                `${i + 1}: ${item.name || item.category || item.role}`
            )
            .join("\n");
          const numStr = prompt(
            `Which item to remove?\n${list}\n\nEnter number:`
          );
          if (!numStr) return;
          const index = parseInt(numStr, 10) - 1;
          if (isNaN(index) || index < 0 || index >= items.length) {
            typeLine("\nError: Invalid number.");
            return;
          }
          items.splice(index, 1);
        },
        edit: (section) => {
          if (section === "contact") {
            const contactInfo = portfolioData.contact || {};
            for (const key in contactInfo) {
              const newValue = prompt(
                `Edit ${key} link (e.g., github.com/user):`,
                contactInfo[key]
              );
              if (newValue !== null) {
                contactInfo[key] = newValue;
              }
            }
            return;
          }

          const items = portfolioData[section];
          if (!items || items.length === 0) {
            typeLine(`\nNothing to edit in '${section}'.`);
            return;
          }
          const list = items
            .map(
              (item, i) =>
                `${i + 1}: ${item.name || item.category || item.role}`
            )
            .join("\n");
          const numStr = prompt(
            `Which item to edit?\n${list}\n\nEnter number:`
          );
          if (!numStr) return;
          const index = parseInt(numStr, 10) - 1;
          if (isNaN(index) || index < 0 || index >= items.length) {
            typeLine("\nError: Invalid number.");
            return;
          }
          const item = items[index];
          for (const key in item) {
            const newValue = prompt(`Edit '${key}':`, item[key]);
            if (newValue !== null) item[key] = newValue;
          }
        },
      };

      this.handle = async (args) => {
        const [section, action] = args;
        const validSections = [
          "about",
          "projects",
          "skills",
          "experience",
          "contact",
        ];
        if (!section || !action || !validSections.includes(section)) {
          typeLine(`\nUsage: sudo update <section> <action>`);
          return;
        }

        const isAuthenticated = await authenticate();
        if (!isAuthenticated) return;

        const actionFn = actions[action];
        if (typeof actionFn === "function") actionFn(section);
        else if (actionFn && actionFn[section]) actionFn[section]();
        else {
          typeLine(
            `\nAction '${action}' is not valid for section '${section}'.`
          );
          return;
        }

        await contentStore.saveContent(portfolioData);
        typeLine(`\n'${section}' section updated successfully.`);
      };
    }

    const sudoManager = new SudoManager();

    function executeCommand(command) {
      if (isCommandExecuting) {
        commandQueue.push(command);
        return;
      }
      isCommandExecuting = true;

      const onComplete = () => {
        isCommandExecuting = false;
        if (commandQueue.length > 0) executeCommand(commandQueue.shift());
      };

      if (command.startsWith("_SYSTEM_:")) {
        const message = command.substring(9);
        typeLine(message, 15, onComplete);
        return;
      }

      if (command !== "clear") {
        const output = document.createElement("div");
        output.innerHTML = `<span class="prompt"></span>${command
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}`;
        terminalOutput.appendChild(output);
      }

      const [baseCommand, ...args] = command.split(" ");
      if (baseCommand === "sudo" && args[0] === "update") {
        sudoManager.handle(args.slice(1)).then(onComplete);
      } else if (baseCommand in commands) {
        const response = commands[baseCommand]();
        if (response) {
          const lines = response.split("\n");
          let lineIndex = 0;
          function typeLinesSequentially() {
            if (lineIndex < lines.length) {
              typeLine(lines[lineIndex], 15, () => {
                lineIndex++;
                typeLinesSequentially();
              });
            } else {
              onComplete();
            }
          }
          typeLinesSequentially();
        } else {
          onComplete();
        }
      } else {
        if (command.trim() !== "")
          typeLine(`bash: command not found: ${command}`, 15, onComplete);
        else onComplete();
      }

      if (command.trim() !== "") commandHistory.unshift(command);
      historyIndex = -1;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function setupEventListeners() {
      const onKeyDown = (e) => {
        if (e.key === "Enter") {
          const command = terminalInput.value.trim().toLowerCase();
          if (command) executeCommand(command);
          terminalInput.value = "";
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            terminalInput.value = "";
          }
        }
      };

      terminalInput.addEventListener("keydown", onKeyDown);

      const navLinks = document.querySelectorAll(".nav-link");
      const onNavClick = (e) => {
        e.preventDefault();
        executeCommand(e.target.getAttribute("data-command"));
        terminalInput.focus();
      };
      navLinks.forEach((link) => link.addEventListener("click", onNavClick));

      const terminal = document.getElementById("terminal");
      const onTerminalClick = (e) => {
        if (e.target.tagName.toLowerCase() !== "a") terminalInput.focus();
      };
      terminal.addEventListener("click", onTerminalClick);

      return () => {
        terminalInput.removeEventListener("keydown", onKeyDown);
        navLinks.forEach((link) =>
          link.removeEventListener("click", onNavClick)
        );
        terminal.removeEventListener("click", onTerminalClick);
      };
    }

    // ---- THREE.JS CARD ----
    function init3D() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5.5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      if ("outputColorSpace" in renderer) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      } else {
        renderer.outputEncoding = THREE.sRGBEncoding;
      }

      const geometry = new THREE.BoxGeometry(4.5, 7.5, 0.15);

      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      const texture = new THREE.CanvasTexture(canvas);
      if ("colorSpace" in texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
      } else {
        texture.encoding = THREE.sRGBEncoding;
      }

      const profileImage = new Image();
      profileImage.crossOrigin = "Anonymous";

      profileImage.onload = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imgAspect = profileImage.width / profileImage.height;
        const canvasAspect = canvas.width / canvas.height;
        let w = canvas.width;
        let h = canvas.height;
        let x = 0;
        let y = 0;

        if (imgAspect > canvasAspect) {
          h = canvas.width / imgAspect;
          y = (canvas.height - h) / 2;
        } else {
          w = canvas.height * imgAspect;
          x = (canvas.width - w) / 2;
        }

        ctx.drawImage(profileImage, x, y, w, h);
        texture.needsUpdate = true;
      };

      profileImage.onerror = () => {
        ctx.fillStyle = "#161b22";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#c9d1d9";
        ctx.font = "bold 48px Fira Code";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Image Not Found", canvas.width / 2, canvas.height / 2);
        texture.needsUpdate = true;
      };

      profileImage.src = "/photo.png";

      const backCanvas = document.createElement("canvas");
      backCanvas.width = 600;
      backCanvas.height = 1000;
      const backCtx = backCanvas.getContext("2d");

      const gradient = backCtx.createLinearGradient(
        0,
        0,
        backCanvas.width,
        backCanvas.height
      );
      gradient.addColorStop(0, "#0d1117");
      gradient.addColorStop(1, "#161b22");
      backCtx.fillStyle = gradient;
      backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);
      backCtx.strokeStyle = "#30363d";
      backCtx.lineWidth = 20;
      backCtx.strokeRect(0, 0, backCanvas.width, backCanvas.height);
      backCtx.fillStyle = "#58a6ff";
      backCtx.font = "bold 200px Fira Code";
      backCtx.textAlign = "center";
      backCtx.textBaseline = "middle";
      backCtx.fillText("HKB", backCanvas.width / 2, backCanvas.height / 2);

      const backTexture = new THREE.CanvasTexture(backCanvas);
      if ("colorSpace" in backTexture) {
        backTexture.colorSpace = THREE.SRGBColorSpace;
      } else {
        backTexture.encoding = THREE.sRGBEncoding;
      }

      const materials = [
        new THREE.MeshBasicMaterial({ color: 0x161b22 }),
        new THREE.MeshBasicMaterial({ color: 0x161b22 }),
        new THREE.MeshBasicMaterial({ color: 0x161b22 }),
        new THREE.MeshBasicMaterial({ color: 0x161b22 }),
        new THREE.MeshBasicMaterial({ map: texture }),
        new THREE.MeshBasicMaterial({ map: backTexture }),
      ];

      card = new THREE.Mesh(geometry, materials);
      scene.add(card);

      animate();
    }

    function onDocumentMouseMove(event) {
      const rect = container.getBoundingClientRect();
      const mouseX =
        ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const mouseY = -(
        ((event.clientY - rect.top) / container.clientHeight) * 2 -
        1
      );
      targetRotationY = mouseX * 0.4;
      targetRotationX = mouseY * 0.4;
    }

    function onMouseLeave() {
      targetRotationX = 0;
      targetRotationY = 0;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      if (card) {
        card.rotation.y += (targetRotationY - card.rotation.y) * 0.05;
        card.rotation.x += (targetRotationX - card.rotation.x) * 0.05;
      }
      if (renderer && scene && camera) renderer.render(scene, camera);
    }

    async function connectToFirebase() {
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR")) {
        executeCommand(
          "_SYSTEM_:\n<span class='text-yellow-400'>Notice: Firebase not configured. Using default content. Changes will not be saved.</span>"
        );
        return;
      }

      executeCommand("_SYSTEM_:\nConnecting to database...");

      try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        contentStore.initialize(db);
        await signInAnonymously(auth);
        await contentStore.loadContent();
        executeCommand(
          "_SYSTEM_:<span class='text-green-400'>Connection successful. Live content loaded.</span>"
        );
      } catch (error) {
        console.error("Firebase Initialization Error:", error);
        let errorMessage =
          "<span class='text-red-500'>Critical Error: Could not connect to Firebase. Using default content.</span>";
        if (
          error.code === "unavailable" ||
          (error.message && error.message.includes("offline"))
        ) {
          errorMessage =
            "<span class='text-red-500'>Critical Error: Could not connect to the Firestore database. This may be due to incorrect Security Rules or the database not being created. Please verify your Firebase setup or run the 'troubleshoot' command. Using default content.</span>";
        }
        executeCommand(`_SYSTEM_:${errorMessage}`);
      }
    }

    function startApp() {
      const removeListeners = setupEventListeners();
      init3D();
      container.addEventListener("mousemove", onDocumentMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);

      const onResize = () => {
        if (camera && renderer) {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        }
      };

      window.addEventListener("resize", onResize);

      portfolioData = contentStore.getDefaults();
      executeCommand("welcome");
      connectToFirebase();

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        container.removeEventListener("mousemove", onDocumentMouseMove);
        container.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("resize", onResize);
        removeListeners && removeListeners();
        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }

    const cleanup = startApp();
    return cleanup;
  }, []);

  return (
    <div
      className={`absolute inset-0 ${
        active
          ? "opacity-100 translate-y-0 pointer-events-auto hologram-start"
          : "opacity-0 translate-y-4 pointer-events-none"
      } transition-all duration-500`}
    >
      <div className="p-4 md:p-8 h-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-4rem)]">
          {/* Left: profile card with 3D container */}
          <ProfileCard variant="3d" />

          {/* Right: terminal + close button */}
          <div className="lg:col-span-2 h-full relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-sm bg-[#161b22] border border-[#30363d] text-gray-300 hover:text-white hover:bg-black transition"
            >
              ✕ Close
            </button>

            <div
              id="terminal"
              className="terminal rounded-lg shadow-xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col"
            >
              <div className="flex-grow" id="terminal-output">
                <div className="mb-4 text-green-400 text-sm">
                  <a href="#" className="nav-link" data-command="help">
                    help
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="welcome">
                    welcome
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="about">
                    about
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="projects">
                    projects
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="skills">
                    skills
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="experience">
                    experience
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="contact">
                    contact
                  </a>{" "}
                  |{" "}
                  <a href="#" className="nav-link" data-command="clear">
                    clear
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <span className="prompt"></span>
                <input
                  type="text"
                  id="terminal-input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoFocus
                  className="bg-transparent border-none outline-none text-[#c9d1d9] w-full"
                />
                <span className="cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperView;
