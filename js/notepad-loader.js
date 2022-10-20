// notepad-loader.js
// Script which enables a localStorage browser and editor implemented as a note taking app
// Allows viewing and loading old notes, creating new notes, overwriting, and a panel that is shrinkable

let totalNoteCount = 0; // Counts the total notes in localStorage for new names of the storage objects
let oldNotes = []; // Contains array of old notes that get loaded from localStorage as a localStorage browser
let keyNames = []; // Key names of the localStorage items
let isLoadedAndWillOverwrite = false; // Switch for whether to overwrite a localStorage key once loaded in the viewer/editor
let currentLoadedTitleForOverwrite = ""; // Holds the key title of the localStorage object to be overwritten when applicable via the above switch
const STRING_EXCERPT_LENGTH = 30; // Excerpt length in the loader panel
function q(incoming) { return document.querySelector(incoming); };
// Setup the note counter initially which gets called by loadOldNotes
function setupNoteCount(incomingTotal) {
  let thisCount = parseInt(localStorage.getItem("note1995-count"));
  if (isNaN(thisCount)) {
    localStorage.setItem("note1995-count", 0);
  } else {
    totalNoteCount = incomingTotal;
    localStorage.setItem("note1995-count", incomingTotal);
  }
};

// Load old notes functionality which grabs the keys of the localStorage to populate a list of items to be browsed
function loadOldNotes() {
  for (var i = 0; i < localStorage.length; i++){
      let thisKey = localStorage.key(i);
      oldNotes.push(localStorage.getItem(thisKey));
      keyNames.push(thisKey);
  }

  let builder = '';
  for (let k=0; k < keyNames.length; k++) {
      builder += '<li data-id="'+keyNames[k]+'"><span class="open-note">&#x27BE;' + keyNames[k] + ' </span><span class="actual-excerpt">(' + localStorage.getItem(keyNames[k]).substring(0,STRING_EXCERPT_LENGTH) +')</span><span class="delete-note">&#x26A0; Delete</span></li>';
  }

  q("#note-loader").innerHTML = builder;
  launchNoteLoaderWatchers();
  setupNoteCount(localStorage.length);
};

// Loads the event listeners for the loading and deleting capability of the notes in the loader panel
function launchNoteLoaderWatchers() {
  let theseNotePossibilities = document.querySelectorAll("#note-loader li .open-note");

  for (let index = 0; index < theseNotePossibilities.length; index++) {
    theseNotePossibilities[index].addEventListener("click", callThisNoteLoader);
  }
  let theseNotePossibilitiesDelete = document.querySelectorAll("#note-loader li .delete-note");

  for (let index = 0; index < theseNotePossibilitiesDelete.length; index++) {
    theseNotePossibilitiesDelete[index].addEventListener("click", callThisNoteDeletor);
  }
};

// Deletes a localStorage item that gets clicked on in the panel
function callThisNoteDeletor(event) {
  let thisItem = event.target.parentElement.getAttribute("data-id");
  let noteObject = q("#note-container textarea");

  currentLoadedTitleForOverwrite = thisItem;
  isLoadedAndWillOverwrite = true;

  noteObject.value = localStorage.removeItem(thisItem);
  event.target.parentElement.remove();
};

// Loads a localStorage contents into the editor once clicked on in the panel
function callThisNoteLoader(event) {
  let thisItem = event.target.parentElement.getAttribute("data-id");
  let noteObject = q("#note-container textarea");

  currentLoadedTitleForOverwrite = thisItem;
  isLoadedAndWillOverwrite = true;

  noteObject.value = localStorage.getItem(thisItem);
  q(".note-title").innerHTML = thisItem;
};

// Shrinks the editor for simple privacy feature on the page and a save functionality to create new localStorage item or overwrite an existing one
function saveShrinkModalWatchers() {
  q(".save").addEventListener("click", function(){
    let noteObject = q("#note-container textarea").value;

    if (isLoadedAndWillOverwrite) {
      localStorage.setItem(currentLoadedTitleForOverwrite, noteObject);
      q(".note-title").innerHTML = "Saved!";
    } else {
      let noteTitle = "note1995-"+totalNoteCount;
      localStorage.setItem(noteTitle, noteObject);
      q(".note-title").innerHTML = "Saved!";
    }
  });

  q(".shrink").addEventListener("click", function(){
    let thisContainer = q("#note-container");
    if (thisContainer.classList.contains("hide")) {
      thisContainer.classList.remove("hide");
    } else {
      thisContainer.classList.add("hide");
    }
  });
};

// Initial boostrapping of the client side app
function launchInitialCalls() {
  saveShrinkModalWatchers();
  loadOldNotes();
};

// Call launcher
launchInitialCalls();