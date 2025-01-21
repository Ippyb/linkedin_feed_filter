document.addEventListener("DOMContentLoaded", () => {
  const savedTextList = document.getElementById("savedTextList");

  // Create the main label element
  const label = document.createElement("label");
  label.className = "toggle-switch";

  // Create the checkbox input
  const checkbox = document.createElement("input");
    checkbox.type = "checkbox";


  // Create the div for the background
  const backgroundDiv = document.createElement("div");
  backgroundDiv.className = "toggle-switch-background";

  // Create the div for the handle
  const handleDiv = document.createElement("div");
  handleDiv.className = "toggle-switch-handle";

  // Append the handle to the background
  backgroundDiv.appendChild(handleDiv);

  // Append the checkbox and background to the label
  label.appendChild(checkbox);
  label.appendChild(backgroundDiv);

  // Append the label to the body or any desired container
  document.body.appendChild(label);

  // Add toggle switch to the top of the page
  document.body.insertBefore(label, savedTextList);

  // Function to render saved texts
  function renderSavedTexts(savedTexts) {
    savedTextList.innerHTML = "";

    if (savedTexts.length > 0) {
      savedTexts.forEach((text, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = text;

        // Create a delete button for each list item
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "10px";
        deleteButton.style.backgroundColor = "#f44336";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "3px 8px";
        deleteButton.style.borderRadius = "3px";
        deleteButton.style.cursor = "pointer";

        // Attach click event to delete button
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

  // Retrieve saved texts from local storage and render
  chrome.storage.local.get("savedTexts", (result) => {
    const savedTexts = result.savedTexts || []; // Get saved texts or default to an empty array
    renderSavedTexts(savedTexts);
  });
});
