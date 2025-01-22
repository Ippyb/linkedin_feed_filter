document.addEventListener("DOMContentLoaded", () => {
  const professionalUpdateKeywords = [
    "new role",
    "new position",
    "excited to announce",
    "thrilled to join",
    "landed a role",
    "starting at",
    "accepted a position",
    "I’ll be joining",
    "have been selected",
    "starting a new position",
    "will be joining",
    "I’ve accepted a",
    "accepted an offer",
    "be joining",
  ];

  const savedTextList = document.getElementById("savedTextList");

  // Create the toggle container div
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "toggle-container";

  // Create toggle button description
  const description = document.createElement("span");
  description.textContent = "Remove Job Posts";

  // Create toggle switch container
  const toggleSwitchContainer = document.createElement("label");
  toggleSwitchContainer.className = "switch";

  const toggleSwitch = document.createElement("input");
  toggleSwitch.type = "checkbox";
  toggleSwitch.className = "toggle-checkbox";

  const toggleSlider = document.createElement("span");
  toggleSlider.className = "slider";

  toggleSwitchContainer.appendChild(toggleSwitch);
  toggleSwitchContainer.appendChild(toggleSlider);

  toggleContainer.appendChild(toggleSwitchContainer);
  toggleContainer.appendChild(description);

  // Ensures the toggle and description are above the savedTextList
  document.body.insertBefore(toggleContainer, savedTextList);

  // Function to render saved texts
  function renderSavedTexts(savedTexts) {
    savedTextList.innerHTML = "";

    if (savedTexts.length > 0) {
      savedTexts.forEach((text, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "10px";
        deleteButton.style.backgroundColor = "#f44336";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "3px 8px";
        deleteButton.style.borderRadius = "3px";
        deleteButton.style.cursor = "pointer";

        deleteButton.addEventListener("click", () => {
          savedTexts.splice(index, 1); // Remove text from array
          chrome.storage.local.set({ savedTexts }, () => {
            renderSavedTexts(savedTexts); // Re-render the list
          });
        });

        listItem.appendChild(deleteButton);
        savedTextList.appendChild(listItem);
      });
    } else {
      savedTextList.textContent = "No saved text found.";
    }
  }

  // Function to save professional update keywords to local storage
  function saveProfessionalUpdateKeywords() {
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || [];

      // Add professional update keywords to savedTexts
      professionalUpdateKeywords.forEach((keyword) => {
        if (!savedTexts.includes(keyword)) {
          savedTexts.push(keyword);
        }
      });

      chrome.storage.local.set({ savedTexts });
    });
  }

  // Function to remove professional update keywords from local storage
  function removeProfessionalUpdateKeywords() {
    chrome.storage.local.get("savedTexts", (result) => {
      const savedTexts = result.savedTexts || [];

      const updatedSavedTexts = savedTexts.filter(
        (text) => !professionalUpdateKeywords.includes(text)
      );

      chrome.storage.local.set({ savedTexts: updatedSavedTexts });
    });
  }

  // Function to check and apply the toggle state on page load
  function checkAndApplyToggleState() {
    chrome.storage.local.get(["toggleState", "savedTexts"], (result) => {
      const toggleState = result.toggleState ?? false; // Default to 'off' if not set
      toggleSwitch.checked = toggleState;

      // Apply actions based on the toggle state
      if (toggleState) {
        saveProfessionalUpdateKeywords();
      } else {
        removeProfessionalUpdateKeywords();
      }

      // Render saved texts
      const savedTexts = result.savedTexts || [];
      renderSavedTexts(savedTexts);
    });
  }

  // Event listener for toggle switch change
  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      saveProfessionalUpdateKeywords();
    } else {
      removeProfessionalUpdateKeywords();
    }

    // Store the toggle state
    chrome.storage.local.set({ toggleState: toggleSwitch.checked });
  });

  // Listen for changes in chrome.storage.local and update dynamically
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
      if (changes.savedTexts) {
        renderSavedTexts(changes.savedTexts.newValue || []);
      }

      if (changes.toggleState) {
        toggleSwitch.checked = changes.toggleState.newValue ?? false;
      }
    }
  });

  // Call the function to check and apply the toggle state on page load
  checkAndApplyToggleState();
});
