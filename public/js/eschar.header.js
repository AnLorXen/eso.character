

eschar.header = (function () {
  "use strict";

  var
    initModule, bindEvents, setDocMap,

    buildCharacterList, sortCharacters, addCharacterItem,
    selectCharacter, selectCharacterByName, 
    showCharacterList, hideCharacterList, toggleCharacterList, 

    showBuildList, hideBuildList, toggleBuildList,

    handleCharDropClick, handleCharListClick, 
    handleBuildDropClick, handleBuildListClick,
    handleCharLockClick, 
    
    cfgMap = {
      "main_html": String()
      + "<div class='header-logo'><a href='#'>AnLorXen</a></div>"
      + "<div class='header-character'>"
      +   "<div class='header-character-upper'>"
      +     "<span>Character:</span>"
      +   "</div>"
      +   "<div class='header-character-lower'>"
      +     "<div class='header-character-current'>"
      +       "<div class='header-character-current-race'></div>"
      +       "<div class='header-character-current-class'></div>"
      +       "<div class='header-character-current-name'>"
      +         "<span></span>"
      +       "</div>"
      +       "<div class='header-character-drop'>"
      +         "<span>V</span>"
      +       "</div>"
      +     "</div>"
      +     "<ul class='header-character-list header-hidden'></ul>"
      +   "</div>"


      +   "<div class='header-character-ctrls'>"
      +     "<div class='header-character-ctrls-lock locked'>"
      +     "</div>"
      +   "</div>"


      + "</div>"
      + "<div class='header-build'>"
      +   "<div class='header-build-upper'>"
      +     "<span>Build:</span>"
      +   "</div>"
      +   "<div class='header-build-lower'>"
      +     "<div class='header-build-current'>"
      +       "<div class='header-build-current-name'>"
      +         "<span>A Default Build</span>"
      +       "</div>"
      +       "<div class='header-build-drop'>"
      +         "<span>V</span>"
      +       "</div>"
      +     "</div>"
      +     "<ul class='header-build-list header-hidden'></ul>"
      +   "</div>"
      + "</div>"
    },
    
    docMap = {};



  setDocMap = function () {
    docMap.charDrop
      = document.getElementsByClassName("header-character-current")[0];
    docMap.charSelect
      = document.getElementsByClassName("header-character-lower")[0];
    docMap.charList
      = document.getElementsByClassName("header-character-list")[0];
    docMap.charLock
      = document.getElementsByClassName("header-character-ctrls-lock")[0];
    docMap.charRace
      = document.getElementsByClassName("header-character-current-race")[0];
    docMap.charClass
      = document.getElementsByClassName("header-character-current-class")[0];
    docMap.charName
      = document.getElementsByClassName("header-character-current-name")[0];
    docMap.buildDrop
      = document.getElementsByClassName("header-build-current")[0];
    docMap.buildList
      = document.getElementsByClassName("header-build-list")[0];
  };


  // *********************
  // *********************


  buildCharacterList = function () {
    docMap.charList.innerHTML = "";
    sortCharacters();
    eschar.chassis.getCharacters().forEach(function (_char) {
      addCharacterItem(_char);
    });
  };


  sortCharacters = function () {
    var chars = eschar.chassis.getCharacters();
    chars.sort(function (_a, _b) {
      if (_a.sortOrder > _b.sortOrder) { return 1; }
      if (_a.sortOrder < _b.sortOrder) { return -1; }
      return 0;
    });
  };


  addCharacterItem = function (_char) {
    var
      eleLi = document.createElement("li"), 
      eleDivRace = document.createElement("div"), 
      eleDivClass = document.createElement("div"), 
      eleSpan = document.createElement("span");

    eleDivRace.classList.add("header-character-list-race");
    eleDivRace.style.backgroundImage = "url(../img/races/"
      + _char.race.toLowerCase() + "_norm_20.png)";
    eleLi.appendChild(eleDivRace);

    eleDivClass.classList.add("header-character-list-class");
    eleDivClass.style.backgroundImage = "url(../img/classes/"
      + _char.class.toLowerCase() + "_norm_20.png)";
    eleLi.appendChild(eleDivClass);

    eleSpan.textContent = _char.name;
    eleLi.appendChild(eleSpan);

    docMap.charList.appendChild(eleLi);
  };


  selectCharacter = function (_charIdx) {
    var selNode, selChar;

    // reset character lock
    if (!eschar.chassis.getCharacterLock()) {
      eschar.chassis.setCharacterLock(true);
      docMap.charLock.classList.add("locked");
    }

    // clear and set display classes
    docMap.charList.childNodes.forEach(function (_node, _idx) {
      if (_node.classList.contains("selected-character")) {
        _node.classList.remove("selected-character");
      }
      if (_charIdx === _idx) {
        selNode = _node;
        _node.classList.add("selected-character");
      }
    });

    // set current character data in state map
    eschar.chassis.setCharacter(selNode, _charIdx);
    selChar = eschar.chassis.getSelectedCharacter();

    // set icons and name
    docMap.charRace.style.backgroundImage = "url(../img/races/"
      + selChar.race.toLowerCase() + "_norm_20.png)";
    docMap.charClass.style.backgroundImage = "url(../img/classes/"
      + selChar.class.toLowerCase() + "_norm_20.png)";
    docMap.charName.firstChild.textContent = selChar.name;
  };


  selectCharacterByName = function (_name) {
    [].slice.call(docMap.charList.childNodes).every(function (_item, _idx) {
      if (_item.textContent === _name) {
        if (_idx !== eschar.chassis.getCharacterIndex()) {
          selectCharacter(_idx);
        }
        return false;
      } else {
        return true;
      }
    });
  };


  showCharacterList = function () {
    if (docMap.charList.classList.contains("header-hidden")) {
      docMap.charList.classList.remove("header-hidden");
      docMap.charName.classList.add("header-shaded");
    }
  };

  hideCharacterList = function () {
    if (!docMap.charList.classList.contains("header-hidden")) {
      docMap.charList.classList.add("header-hidden");
      docMap.charName.classList.remove("header-shaded");
    }
  };

  toggleCharacterList = function () {
    if (docMap.charList.classList.contains("header-hidden")) {
      showCharacterList();
    } else {
      hideCharacterList();
    }
  };



  handleCharDropClick = function (_event) {
    toggleCharacterList();
  };


  handleCharListClick = function (_event) {
    var charLi;
    if (_event.target.localName !== "li") {
      charLi = _event.target.parentElement;
    } else {
      charLi = _event.target;
    }

    [].slice.call(docMap.charList.childNodes).every(function (_node, _idx) {
      if (_node === charLi) {
        selectCharacter(_idx);
        return false;
      } else {
        return true;
      }
    });

    hideCharacterList();
  };


  handleCharLockClick = function (_event) {

    if (eschar.chassis.getCharacterLock()) {
      eschar.chassis.setCharacterLock(false);
      docMap.charLock.classList.remove("locked");
    } else {
      eschar.chassis.setCharacterLock(true);
      docMap.charLock.classList.add("locked");
    }

    //eschar.footer.setInfo("one", eschar.chassis.getSelectedCharacter().name);
    //eschar.footer.setInfo("two", eschar.chassis.getSelectedCategory().name);
    //eschar.footer.setInfo("three", eschar.chassis.getSelectedGroup().name);
    //eschar.footer.setInfo("four", eschar.chassis.getSelectedSkill().name);

    //eschar.footer.setInfo(
    //  "one",
    //  eschar.chassis.getCharacterGroupPoints(eschar.chassis.getSelectedGroup()._id)
    //);

    //eschar.footer.setInfo("two", "");
    //eschar.footer.setInfo("three", "");
    //eschar.footer.setInfo("four", "");


    //console.log(eschar.chassis.getGroups());

  };


  // *********************
  // *********************



  showBuildList = function () {
    if (docMap.buildList.classList.contains("header-hidden")) {
      docMap.buildList.classList.remove("header-hidden");
    }
  };

  hideBuildList = function () {
    if (!docMap.buildList.classList.contains("header-hidden")) {
      docMap.buildList.classList.add("header-hidden");
    }
  };

  toggleBuildList = function () {
    if (docMap.buildList.classList.contains("header-hidden")) {
      showBuildList();
    } else {
      hideBuildList();
    }
  };


  handleBuildDropClick = function (_event) {
    toggleBuildList();
  };


  handleBuildListClick = function (_event) {

  };


  // *********************
  // *********************



  bindEvents = function () {
    docMap.charDrop.addEventListener(
      "click", handleCharDropClick, false
    );
    docMap.charList.addEventListener(
      "click", handleCharListClick, false
    );
    docMap.charSelect.addEventListener(
      "mouseleave", hideCharacterList, false
    );
    docMap.charLock.addEventListener(
      "click", handleCharLockClick, false
    );

    docMap.buildDrop.addEventListener(
      "click", handleBuildDropClick, false
    );
  };


  initModule = function (_container) {
    _container.innerHTML = cfgMap.main_html;

    setDocMap();
    bindEvents();

    return true;
  };


  return {
    "initModule": initModule,

    "buildCharacterList": buildCharacterList,
    "selectCharacter": selectCharacter,
    "selectCharacterByName": selectCharacterByName

  };

}());

