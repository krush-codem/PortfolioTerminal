# Interactive Terminal Portfolio

Welcome to my interactive terminal portfolio! This project is a unique, terminal-themed personal website designed to showcase my skills and projects in a fun, retro-style interface. The entire portfolio is a dynamic, single-page application managed through terminal commands, with all content powered by a live Firebase Firestore database.

[**View the Live Demo Here**](https://harekrushna-behera-portfolio.vercel.app/)

## Features

- **Interactive Terminal Interface:** Navigate the portfolio using classic terminal commands.
- **Live Content Management:** All text content (About, Projects, Skills, etc.) can be updated in real-time directly from the terminal using `sudo` commands. No redeployment needed!
- **Firebase Integration:** Uses Firestore as a backend to store and serve all portfolio content, allowing for instant global updates.
- **3D Profile Card:** An interactive, mouse-aware 3D profile card built with Three.js.
- **Clickable Links:** All navigation and project links are fully functional.
- **Command History:** Use the up and down arrow keys to cycle through your command history.
- **Fully Responsive:** Designed to look great on desktops, tablets, and mobile devices.

## Tech Stack

- **Frontend:** HTML5, Tailwind CSS, JavaScript (ES6 Modules)
- **3D Graphics:** Three.js
- **Backend & Database:** Firebase (Firestore, Authentication)
- **Deployment:** Vercel (or any static hosting provider)

## Available Commands

The following commands are available in the terminal:

| Command        | Description                                           |
| :------------- | :---------------------------------------------------- |
| `help`         | Displays a list of all available commands.            |
| `welcome`      | Shows the initial welcome message.                    |
| `about`        | Displays my professional summary.                     |
| `projects`     | Lists my recent projects with clickable links.        |
| `skills`       | Shows a list of my technical skills.                  |
| `experience`   | Details my work experience.                           |
| `contact`      | Provides my contact information with clickable links. |
| `clear`        | Clears the terminal screen.                           |
| `sudo`         | (Admin) Allows for editing website content.           |
| `troubleshoot` | Provides a checklist for Firebase connection issues.  |

### Admin Commands (`sudo`)

The `sudo update` command allows you, as the administrator, to manage the site's content directly from the terminal.

**Syntax:** `sudo update <section> <action>`

- **`<section>`:** Can be `about`, `projects`, `skills`, `experience`.
- **`<action>`:** Can be `add`, `remove`, `edit`, or `set`.

**Examples:**

- `sudo update projects add` - Prompts you to add a new project.
- `sudo update experience remove` - Shows a numbered list of your experiences to choose one to delete.
- `sudo update skills edit` - Allows you to edit an existing skill entry.
- `sudo update about set` - Replaces the entire 'about' section with new text.

## Setup and Configuration

To set up this portfolio for your own use, follow these steps.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Create and Configure a Firebase Project

This project requires a Firebase project to store its content.

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Add a Web App:** In your project's dashboard, click the web icon (`</>`) to add a new web application. Register the app.

3.  **Get `firebaseConfig`:** After registering, Firebase will provide you with a `firebaseConfig` object. Copy this object.

4.  **Paste into `index.html`:** Open `index.html` and paste the `firebaseConfig` object into the placeholder at the top of the `<script type="module">` tag.

5.  **Create Firestore Database:**

    - In the Firebase console, go to **Build > Firestore Database** and click **"Create database"**.
    - Start in **Test Mode** when prompted. This allows the app to write to the database initially.
    - Choose a server location.

6.  **Enable Anonymous Authentication:**

    - Go to **Build > Authentication**.
    - Click the **"Sign-in method"** tab.
    - Find **"Anonymous"** in the list and enable it.

7.  **Update Security Rules:** The initial test rules expire. Replace them with permanent rules.
    - Go to the **Firestore Database > Rules** tab.
    - Replace the entire editor content with the following and click **Publish**:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /portfolio/mainContent {
          allow read: if true;
          allow write: if request.auth != null;
        }
        match /portfolio/admin {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```

### 3. Customize and Deploy

1.  **Set Admin Password:** Open the live website. The first time you run any `sudo` command, it will prompt you to create a new administrator password. This will be stored securely in your database.

2.  **Update Content:** Use the `sudo update` commands to replace all the default content with your own information (your projects, skills, etc.).

3.  **Deploy to Vercel (Recommended):**
    - Push your project to a GitHub repository.
    - Sign up for [Vercel](https://vercel.com/) with your GitHub account.
    - Create a new project and import your repository.
    - Ensure the `vercel.json` file is in your project to handle routing correctly. Vercel will deploy your site automatically.
