document.addEventListener("DOMContentLoaded", () => {
  const toolsBtn = document.querySelector(".open-tools");
  const openToolsImg = toolsBtn?.querySelector(".open");
  const closeToolsImg = toolsBtn?.querySelector(".close");
  const toolsMenu = document.querySelector(".tools");

  toolsBtn?.addEventListener("click", () => {
    const isOpen = toolsMenu.style.display === "flex";
    toolsMenu.style.display = isOpen ? "none" : "flex";
    openToolsImg.style.display = isOpen ? "block" : "none";
    closeToolsImg.style.display = isOpen ? "none" : "block";
  });

  // === PEN DROPDOWN ===
  const dropdownBtn = document.querySelector(".tool-btn.pen");
  const dropdown = document.querySelector(".dropdown");

  dropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
    const rect = dropdownBtn.getBoundingClientRect();
    dropdown.style.position = "fixed";
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.top - dropdown.offsetHeight - 10}px`;
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  const toolBtnSpan = document.querySelector(".tool-btn.pen .selected-tool-icon");
  const toolButtons = document.querySelectorAll(".dropdown-items-btn .other-tools");

  const getFontAwesomeUnicode = (className) => {
    const map = {
      "fa-pen": "\uf304",
      "fa-arrow-pointer": "\uf245",
      "fa-highlighter": "\uf591",
      "fa-eraser": "\uf12d",
      "fa-trash": "\uf1f8"
    };
    return map[className] || null;
  };

  function updateToolButtonIcon(selectedTool) {
    const icon = selectedTool.querySelector("i").cloneNode(true);
    toolBtnSpan.innerHTML = "";
    toolBtnSpan.appendChild(icon);
  }

  function updateCursor(selectedTool) {
    const iconElement = selectedTool.querySelector("i");
    const iconClass = Array.from(iconElement.classList).find(cls => cls.startsWith("fa-"));
    const unicode = getFontAwesomeUnicode(iconClass);
    if (!unicode) return;

    const canvasCursor = document.createElement("canvas");
    canvasCursor.width = 32;
    canvasCursor.height = 32;

    const ctx = canvasCursor.getContext("2d");
    const font = new FontFace("FontAwesome", "url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2')");

    font.load().then(loadedFont => {
      document.fonts.add(loadedFont);
      ctx.font = "20px FontAwesome";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(unicode, 16, 16);
      const cursorURL = canvasCursor.toDataURL();
      document.body.style.cursor = `url(${cursorURL}) 16 16, auto`;
    }).catch(console.error);
  }

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.querySelector("i").classList.contains("fa-trash")) {
        console.clear();
        console.log("Erase All clicked");
        return;
      }
      toolButtons.forEach(btn => btn.classList.remove("selected-tool"));
      button.classList.add("selected-tool");
      updateToolButtonIcon(button);
      updateCursor(button);
      dropdown.classList.remove("show");
    });

    const closeChatBtn = document.getElementById("close-chat-btn");

    closeChatBtn?.addEventListener("click", () => {
      chatPanel.style.display = "none";
    });

  });

  

  // === IMAGE UPLOAD ===
  const photoDiv = document.querySelector("#photo");
  const photoUploadInput = document.querySelector("#photo-upload");

  photoDiv.addEventListener("click", () => photoUploadInput.click());

  photoUploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("image-wrapper");
      wrapper.style.position = "absolute";
    

      const padding = 40;
      const maxW = canvas.offsetWidth;
      const maxH = canvas.offsetHeight * 0.8;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const width = img.width * scale;
      const height = img.height * scale;

      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
      wrapper.style.left = `${(canvas.offsetWidth - width) / 2}px`;
      wrapper.style.top = `${(canvas.offsetHeight - height) / 2}px`;

      const closeBtn = document.createElement("div");
      closeBtn.classList.add("close-btn");
      closeBtn.innerHTML = "&times;";
      closeBtn.title = "Remove Image";
      closeBtn.addEventListener("click", () => wrapper.remove());

      const minimizeBtn = document.createElement("div");
      minimizeBtn.classList.add("minimize-btn");
      minimizeBtn.innerHTML = "\uf2d0";
      minimizeBtn.title = "Minimize/Show Image";

      let minimized = false;
      let ribbonContainer = document.querySelector("#image-ribbon");
      if (!ribbonContainer) {
        ribbonContainer = document.createElement("div");
        ribbonContainer.id = "image-ribbon";
        ribbonContainer.style.position = "absolute";
        ribbonContainer.style.top = "10px";
        ribbonContainer.style.left = "10px";
        ribbonContainer.style.display = "flex";
        ribbonContainer.style.flexDirection = "column";
        ribbonContainer.style.gap = "10px";
        ribbonContainer.style.zIndex = "1000";
        document.getElementById("whiteboard-wrapper").appendChild(ribbonContainer);
      }

      const originalStyles = {
        width: wrapper.style.width,
        height: wrapper.style.height,
        left: wrapper.style.left,
        top: wrapper.style.top,
      };

      minimizeBtn.addEventListener("click", () => {
        if (!minimized) {
          wrapper.style.width = "100px";
          wrapper.style.height = "60px";
          wrapper.style.left = "unset";
          wrapper.style.top = "unset";
          wrapper.style.position = "relative";
          ribbonContainer.appendChild(wrapper);
        } else {
          Object.assign(wrapper.style, {
            width: originalStyles.width,
            height: originalStyles.height,
            left: originalStyles.left,
            top: originalStyles.top,
            position: "absolute"
          });
          document.getElementById("whiteboard-wrapper").appendChild(wrapper);
        }
        minimized = !minimized;
      });

      wrapper.appendChild(img);
      wrapper.appendChild(closeBtn);
      wrapper.appendChild(minimizeBtn);
      document.getElementById("whiteboard-wrapper").appendChild(wrapper);
    };
    
  });

  // === TOGGLE CAMERA/MIC ===
  const toggleVisibility = (btn, onIcon, offIcon) => {
    btn?.addEventListener("click", () => {
      const isOn = onIcon.style.display !== "none";
      onIcon.style.display = isOn ? "none" : "block";
      offIcon.style.display = isOn ? "block" : "none";
    });
  };

  toggleVisibility(
    document.getElementById("camera-toggle"),
    document.querySelector("#camera-toggle .camera-on"),
    document.querySelector("#camera-toggle .camera-off")
  );

  toggleVisibility(
    document.getElementById("mic-toggle"),
    document.querySelector("#mic-toggle .mic-on"),
    document.querySelector("#mic-toggle .mic-off")
  );

  const screenToggleBtn = document.getElementById("screen-toggle");
  const screenMax = screenToggleBtn?.querySelector(".screen-max");
  const screenMin = screenToggleBtn?.querySelector(".screen-min");

  screenToggleBtn?.addEventListener("click", () => {
    const isFull = screenMax.style.display !== "none";
    screenMax.style.display = isFull ? "none" : "block";
    screenMin.style.display = isFull ? "block" : "none";
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  const chatToggle = document.getElementById("live-chat");
  const chatPanel = document.querySelector(".chat-section");

  chatToggle?.addEventListener("click", () => {
    chatPanel.style.display = chatPanel.style.display === "flex" ? "none" : "flex";
  });

  // === PLACEHOLDER: UNDO & SCREEN SHARE ===
  document.getElementById("undo")?.addEventListener("click", () => {
    console.log("Undo action triggered");
  });

  document.getElementById("screen-share")?.addEventListener("click", () => {
    console.log("Screen Share clicked (to be implemented)");
  });
});


