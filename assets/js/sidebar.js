document.addEventListener("DOMContentLoaded", () => {
  const settingBtn = document.getElementById("settings");
  const sidebar = document.getElementById("settings-sidebar");
  const closeSidebarBtn = document.getElementById("close-header");
  const whiteboard = document.getElementById("whiteboard");
  const customColorInput = document.getElementById("custom-bg-color");

  const notepadBtn = document.querySelector(".tool-btn.notepad-btn");
  const notepadPanel = document.querySelector(".notepad-panel");
  const closeNotepadBtn = document.querySelector(".close-notepad");
  const notepadTextarea = document.getElementById("notepad-area");
  const sendNoteBtn = document.getElementById("send-note-btn");
  const notepadMessages = document.getElementById("notepad-messages");

  const usernameForm = document.getElementById("username-form");
  const usernameInput = document.getElementById("username-input");
  const submitAllBtn = document.getElementById("submit-all-btn");

  let messages = JSON.parse(localStorage.getItem("notepadMessages") || "[]");

  // Notepad
  notepadBtn?.addEventListener("click", () => {
    notepadPanel.classList.toggle("open");
  });

  closeNotepadBtn?.addEventListener("click", () => {
    notepadPanel.classList.remove("open");
  });

  function saveMessages() {
    localStorage.setItem("notepadMessages", JSON.stringify(messages));
  }

  function renderMessages() {
    notepadMessages.innerHTML = "";

    messages.forEach((msg, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "notepad-message";

      const content = document.createElement("div");
      content.className = "message-content";

      const text = document.createElement("div");
      text.className = "message-text";
      text.textContent = msg;

      const btnGroup = document.createElement("div");
      btnGroup.className = "message-actions";

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "✏️ Edit";
      editBtn.onclick = () => {
        const newText = prompt("Edit your message:", msg);
        if (newText?.trim()) {
          messages[index] = newText.trim();
          saveMessages();
          renderMessages();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️ Delete";
      deleteBtn.onclick = () => {
        messages.splice(index, 1);
        saveMessages();
        renderMessages();
      };

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(deleteBtn);

      content.appendChild(text);
      content.appendChild(btnGroup);
      wrapper.appendChild(content);
      notepadMessages.appendChild(wrapper);
    });

    const scrollBtn = document.createElement("button");
    scrollBtn.innerHTML = "↓";
    scrollBtn.className = "scroll-down-btn";
    scrollBtn.onclick = () => {
      notepadMessages.scrollTo({ top: notepadMessages.scrollHeight, behavior: "smooth" });
    };
    notepadMessages.appendChild(scrollBtn);

    const toggleScrollBtn = () => {
      const isScrollable =
        notepadMessages.scrollHeight > notepadMessages.clientHeight &&
        notepadMessages.scrollTop + notepadMessages.clientHeight < notepadMessages.scrollHeight - 10;
      scrollBtn.style.display = isScrollable ? "flex" : "none";
    };

    notepadMessages.addEventListener("scroll", toggleScrollBtn);
    toggleScrollBtn();
  }

  function addMessage() {
    const message = notepadTextarea.value.trim();
    if (message) {
      messages.push(message);
      notepadTextarea.value = "";
      saveMessages();
      renderMessages();
    }
  }

  sendNoteBtn?.addEventListener("click", addMessage);
  notepadTextarea?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  });

  renderMessages();

  // Background Color
  document.querySelectorAll(".whiteboard-bg").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      const selectedColor = swatch.getAttribute("data-color");
      whiteboard.style.backgroundColor = selectedColor;
    });
  });

  customColorInput?.addEventListener("input", function () {
    whiteboard.style.backgroundColor = this.value;
  });

  // Sidebar
  settingBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });

  closeSidebarBtn?.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  document.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target) && !settingBtn.contains(event.target)) {
      sidebar.classList.remove("open");
    }
  });

  sidebar?.addEventListener("click", (e) => e.stopPropagation());

  // Username form submit
  usernameForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (!username) return alert("Please enter your username.");

    try {
      await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username }),
      });

      await submitAllData(username);

      alert("✅ All data submitted for: " + username);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("❌ Submission failed.");
    }
  });

  // Submit All button (without username)
  submitAllBtn?.addEventListener("click", async () => {
    try {
      await submitAllData();
      alert("✅ All data submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ Failed to submit data.");
    }
  });

  async function submitAllData(username = null) {
    const notes = JSON.parse(localStorage.getItem("notepadMessages") || "[]");

    for (const content of notes) {
      await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, ...(username && { username }) }),
      });
    }

    const chatMessages = Array.from(document.querySelectorAll("#student-messages .message")).map(el => ({
      message: el.textContent.replace(/^Tutor:\s*/, ""),
      sender: "Tutor",
      ...(username && { username }),
    }));

    for (const msg of chatMessages) {
      await fetch("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    }

    if (window.savedShapes) {
      for (const shape of window.savedShapes) {
        await fetch("/shapes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...shape, ...(username && { username }) }),
        });
      }
    }

    if (window.savedImages) {
      for (const img of window.savedImages) {
        await fetch("/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...img, ...(username && { username }) }),
        });
      }
    }
  }
});
