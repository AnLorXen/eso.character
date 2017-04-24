

eschar.modal = (function () {
  "use strict";

  var
    initModule, setDocMap, initControls, bindEvents,     
    getId, getClasses, 
    resize, toggle, display, hide,
    setLock, setState, confirmDelete, 
    handleMenuClick, handleTabClick, handleDataChange, 

    buildCharacter, clearCharacter, updateCharacter, 
    handleCharacterRaceClick, handleCharacterClassClick, 

    buildCategory, clearCategory, updateCategory, 

    buildGroup, clearGroup, updateGroup, 

    buildSkill, clearSkill, updateSkill, 
    handleSkillClick, 
    
    cfgMap = {
      "main_html": String() 
        + "<div class='eschar-modal-overlay eschar-modal-hidden'>"
        + "<div class='modal-container'>"
        + "<div class='modal-menu'>"
        + "<ul class='modal-menu-list'>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-new'>"
        + "<div id='modal-menu-new-img'></div>"
        + "<span>New</span>"
        + "</li>"
        + "</ul>"
        + "<span>Create</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-save'>"
        + "<div id='modal-menu-save-img'></div>"
        + "<span>Save</span>"
        + "</li>"
        + "<li id='modal-menu-saveclose'>"
        + "<div id='modal-menu-saveclose-img'></div>"
        + "<span>Save and Close</span>"
        + "</li>"
        + "<li id='modal-menu-savenew'>"
        + "<div id='modal-menu-savenew-img'></div>"
        + "<span>Save and New</span>"
        + "</li>"
        + "</ul>"
        + "<span>Save</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-delete'>"
        + "<div id='modal-menu-delete-img'></div>"
        + "<span>Delete</span>"
        + "</li>"
        + "<li id='modal-menu-cancel'>"
        + "<div id='modal-menu-cancel-img'></div>"
        + "<span>Cancel</span>"
        + "</li>"
        + "</ul>"
        + "<span>Edit</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-open'>"
        + "<div id='modal-menu-open-img'></div>"
        + "<span>Open</span>"
        + "</li>"
        + "</ul>"
        + "<span>Open</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-refresh'>"
        + "<div id='modal-menu-refresh-img'></div>"
        + "<span>Refresh</span>"
        + "</li>"
        + "</ul>"
        + "<span>View</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-previous'>"
        + "<div id='modal-menu-previous-img'></div>"
        + "<span>Previous</span>"
        + "</li>"
        + "<li id='modal-menu-next'>"
        + "<div id='modal-menu-next-img'></div>"
        + "<span>Next</span>"
        + "</li>"
        + "</ul>"
        + "<span>Navigation</span>"
        + "</li>"
        + "<li>"
        + "<ul class='modal-menu-block'>"
        + "<li id='modal-menu-close'>"
        + "<div id='modal-menu-close-img'></div>"
        + "<span>Close</span>"
        + "</li>"
        + "</ul>"
        + "<span>Close</span>"
        + "</li>"
        + "</ul>"
        + "</div>"
        + "<div class='modal-tabs'>" 
        + "<ul class='modal-tabs-list'>"
        + "<li class='tab-item-active'>Character</li>"
        + "<li>Category</li>"
        + "<li>Group</li>"
        + "<li>Skill</li>"
        + "</ul>"
        + "<div class='modal-pages'>"

        // ******* pageCharacter
        + "<div class='modal-page page-active' id='modal-page-character'>"
        + "<p class='modal-page-title'>Character</p>"
        + "<div class='modal-page-container'>"
        + "<div class='character-column-left'>"
        + "<div class='character-name'>" // name, id
        + "<input id='character-name-text' type='text' />"
        + "</div>"

        + "<div class='character-sort-id'>"
        + "<input id='character-sort-number' type='number' title='Sort Order' />"
        + "<input id='character-id-text' readonly type='text' />"
        + "</div>"
        + "<hr class='character-divider' />"
        + "<div class='character-race'>" // race
        + "<div id='character-race-selected'></div>"
        + "<table class='character-race-table'>"
        + "<tr>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-altmer'></div>"
        + "<span>Altmer</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-breton'></div>"
        + "<span>Breton</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-argonian'></div>"
        + "<span>Argonian</span>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-bosmer'></div>"
        + "<span>Bosmer</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-orsimer'></div>"
        + "<span>Orsimer</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-dunmer'></div>"
        + "<span>Dunmer</span>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td class='selected-race'>"
        + "<div class='character-race-icon' id='character-race-khajiit'></div>"
        + "<span>Khajiit</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-redguard'></div>"
        + "<span>Redguard</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-nord'></div>"
        + "<span>Nord</span>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td class='character-race-tr'></td>"
        + "<td>"
        + "<div class='character-race-icon' id='character-race-imperial'></div>"
        + "<span>Imperial</span>"
        + "</td>"
        + "</tr>"
        + "</table>"
        + "</div>"
        + "<hr class='character-divider' />"
        + "<div class='character-class'>" // class
        + "<div id='character-class-selected'></div>"
        + "<table class='character-class-table'>"
        + "<tr>"
        + "<td>"
        + "<div class='character-class-icon' id='character-class-dragonknight'></div>"
        + "<span>Dragonknight</span>"
        + "</td>"
        + "<td class='selected-class'>"
        + "<div class='character-class-icon' id='character-class-nightblade'></div>"
        + "<span>Nightblade</span>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
        + "<div class='character-class-icon' id='character-class-sorcerer'></div>"
        + "<span>Sorcerer</span>"
        + "</td>"
        + "<td>"
        + "<div class='character-class-icon' id='character-class-templar'></div>"
        + "<span>Templar</span>"
        + "</td>"
        + "</tr>"
        + "</table>"
        + "</div>"
        + "</div>"
        + "<div class='character-column-right'>"
        + "<div class='character-img-wrapper'>" // img
        + "<div class='character-img'></div>"
        + "</div>"
        + "<div class='character-img-path'>" // path
        + "<input id='character-img-path-text' type='text' />"
        + "</div>"
        + "</div>"
        + "</div>"
        + "</div>"

        // ******* pageCategory
        + "<div class='modal-page' id='modal-page-category'>"
        + "<p class='modal-page-title'>Category</p>"
        + "<div class='modal-page-container'>"

        + "<div class='category-column-left'>"
        + "<div class='category-name'>" // name
        + "<input id='category-name-text' type='text' />"
        + "</div>"
        + "<div class='category-sort-id'>" // sort, id
        + "<input id='category-sort-number' type='number' title='Sort Order' />"
        + "<input id='category-id-text' readonly type='text' />"
        + "</div>"
        + "</div>"
        + "</div>"
        + "</div>"

        // ******* pageGroup
        + "<div class='modal-page' id='modal-page-group'>"
        + "<p class='modal-page-title'>Group</p>"
        + "<div class='modal-page-container'>"

        + "<div class='group-column-left'>"
        + "<div class='group-name'>" // name
        + "<input id='group-name-text' type='text' />"
        + "</div>"
        + "<div class='group-sort-id'>" // sort, id
        + "<input id='group-sort-number' type='number' title='Sort Order' />"
        + "<input id='group-id-text' readonly type='text' />"
        + "</div>"
        + "<div class='group-family'>" // family
        + "<input id='group-family-text' type='text' title='Family' />"
        + "</div>"
        + "<div class='group-category-name'>" // category ID
        + "<input id='group-category-name-text' readonly type='text' />"
        + "</div>"
        + "<div class='group-category-id'>" // category ID
        + "<input id='group-category-id-text' type='text' title='Category ID' />"
        + "</div>"
        + "<div class='group-imgText'>" // image path, image size
        + "<input id='group-img-text' type='text' />"
        + "<input id='group-img-size' type='text' />"
        + "</div>"
        + "</div>"
        + "</div>"
        + "</div>"

        // ******* pageSkill
        + "<div class='modal-page' id='modal-page-skill'>"
        + "<p class='modal-page-title'>Skill</p>"
        + "<div class='modal-page-container'>"
        + "<div class='skill-wrappers'>"
            
        // *** base ability
        + "<div class='skill-wrapper skill-base'>"
        + "<div class='skill-name'>"
        + "<div class='skill-icon' id='skill-base-icon'></div>"
        + "<div class='skill-name-input'>"
        + "<input class='skill-name-text' id='skill-base-name-text' type='text' />"
        + "<input class='skill-imgPath' id='skill-base-imgPath-text' title='Image Path' type='text' />"
        + "<input class='skill-points' id='skill-base-points-text' title='Points' type='number' />"
        + "</div>"
        + "</div>"
        + "<div class='skill-desc'>"
        + "<textarea class='skill-desc-text' id='skill-base-desc-text'></textarea>"
        + "<textarea class='skill-adds-text' id='skill-base-adds-text' readonly></textarea>"
        + "</div>"
        + "<div class='skill-sort-id'>"
        + "<input class='skill-sort' id='skill-base-sort-text' title='Sort Order' type='number' />"
        + "<input class='skill-id' id='skill-base-id-text' readonly type='text' />"
        + "</div>"
        + "</div>" // ***

        // *** first morph ability
        + "<div class='skill-wrapper skill-morph1st'>"
        + "<div class='skill-name'>"
        + "<div class='skill-icon' id='skill-morph1st-icon'></div>"
        + "<div class='skill-name-input'>"
        + "<input class='skill-name-text' id='skill-morph1st-name-text' type='text' />"
        + "<input class='skill-imgPath' id='skill-morph1st-imgPath-text' type='text' />"
        + "<input class='skill-points' id='skill-morph1st-points-text' title='Points' type='number' />"
        + "</div>"
        + "</div>"
        + "<div class='skill-desc'>"
        + "<textarea class='skill-desc-text' id='skill-morph1st-desc-text' readonly></textarea>"
        + "<textarea class='skill-adds-text' id='skill-morph1st-adds-text'></textarea>"
        + "</div>"
        + "<div class='skill-sort-id'>"
        + "<input class='skill-sort' id='skill-morph1st-sort-text' title='Sort Order' type='number' />"
        + "<input class='skill-id' id='skill-morph1st-id-text' readonly type='text' />"
        + "</div>"
        + "</div>" // ***
            
        // *** second morph ability
        + "<div class='skill-wrapper skill-morph2nd'>"
        + "<div class='skill-name'>"
        + "<div class='skill-icon' id='skill-morph2nd-icon'></div>"
        + "<div class='skill-name-input'>"
        + "<input class='skill-name-text' id='skill-morph2nd-name-text' type='text' />"
        + "<input class='skill-imgPath' id='skill-morph2nd-imgPath-text' type='text' />"
        + "<input class='skill-points' id='skill-morph2nd-points-text' title='Points' type='number' />"
        + "</div>"
        + "</div>"
        + "<div class='skill-desc'>"
        + "<textarea class='skill-desc-text' id='skill-morph2nd-desc-text' readonly></textarea>"
        + "<textarea class='skill-adds-text' id='skill-morph2nd-adds-text'></textarea>"
        + "</div>"
        + "<div class='skill-sort-id'>"
        + "<input class='skill-sort' id='skill-morph2nd-sort-text' title='Sort Order' type='number' />"
        + "<input class='skill-id' id='skill-morph2nd-id-text' readonly type='text' />"
        + "</div>"
        + "</div>" // ***

        // *** create new ability
        + "<div class='skill-wrapper skill-new skill-hidden'>"
        + "<div class='skill-name'>"
        + "<div class='skill-icon' id='skill-new-icon'></div>"
        + "<div class='skill-name-input'>"
        + "<input class='skill-name-text' id='skill-new-name-text' type='text' />"
        + "<input class='skill-imgPath' id='skill-new-imgPath-text' type='text' />"
        + "<input class='skill-points' id='skill-new-points-text' title='Points' type='number' />"
        + "</div>"
        + "</div>"
        + "<div class='skill-desc'>"
        + "<textarea class='skill-desc-text' id='skill-new-desc-text'></textarea>"
        + "<textarea class='skill-adds-text' id='skill-new-adds-text'></textarea>"
        + "</div>"
        + "<div class='skill-sort-id'>"
        + "<input class='skill-sort' id='skill-new-sort-text' title='Sort Order' type='number' />"
        + "<input class='skill-id' id='skill-new-id-text' readonly type='text' />"
        + "</div>"
        + "</div>" // ***

        + "</div>" // .skill-wrappers
        + "<hr class='skill-divider' />"

        + "<div class='skill-group-type'>" // group info and skill type
        + "<ul class='skill-type-list'>"
        + "<li><label><input type='radio' id='radio-ultimate' name='skill-type' value='ultimate'> Ultimate</label></li>"
        + "<li><label><input type='radio' id='radio-active' name='skill-type' value='active'> Active</label></li>"
        + "<li><label><input type='radio' id='radio-passive' name='skill-type' value='passive'> Passive</label></li>"
        + "</ul>"
        + "<input id='skill-group-name-text' readonly type='text' />"
        + "<input id='skill-group-id-text' readonly type='text' />"
        //+ "<div>" // .skill-group-type

        //+ "</div>"
        + "</div>"
        + "</div>"
        + "</div>"

        // *** status bar
        + "<div class='status-bar'>"
        + "<div class='status-bar-text-wrapper'>"
        + "<span id='status-bar-text'>Ready</span>"
        + "<button class='status-hidden' id='status-confirm-btn'>DELETE</button>"
        + "</div>"
        + "<div class='status-bar-lights'>"
        + "<div class='status-bar-light-red'></div>"
        + "</div>"
        + "</div>" // ***

        + "</div>"
        + "</div>",


      "static": {
        "races": [
          "Altmer", "Argonian", "Bosmer", "Breton", "Dunmer",
          "Imperial", "Khajiit", "Orsimer", "Nord", "Redguard"
        ],
        "classes": [
          "Dragonknight", "Nightblade", "Sorcerer", "Templar"
        ],
        "skillTypes": [
          "Ultimate", "Active", "Passive"
        ],
        "modalTabs": [
          "characters", "categories", "groups", "skills"
        ]
      }
    },

    docMap = {};


  setDocMap = function () {
    docMap.overlay
      = getClasses("eschar-modal-overlay")[0];
    docMap.menuItems
      = getClasses("modal-menu-list")[0].childNodes;
    docMap.tabs
      = getClasses("modal-tabs-list")[0];
    docMap.pages
      = getClasses("modal-pages")[0];

    docMap.menu = {};
    docMap.menu.new = getId("modal-menu-new");
    docMap.menu.save = getId("modal-menu-save");
    docMap.menu.saveclose = getId("modal-menu-saveclose");
    docMap.menu.savenew = getId("modal-menu-savenew");
    docMap.menu.delete = getId("modal-menu-delete");
    docMap.menu.cancel = getId("modal-menu-cancel");
    docMap.menu.open = getId("modal-menu-open");
    docMap.menu.refresh = getId("modal-menu-refresh");
    docMap.menu.previous = getId("modal-menu-previous");
    docMap.menu.next = getId("modal-menu-next");
    docMap.menu.close = getId("modal-menu-close");

    docMap.tabCharacter = {};
    docMap.tabCharacter.raceTable = getClasses("character-race-table")[0];
    docMap.tabCharacter.raceCells
      = docMap.tabCharacter.raceTable.getElementsByTagName("td");
    docMap.tabCharacter.classTable = getClasses("character-class-table")[0];
    docMap.tabCharacter.classCells
      = docMap.tabCharacter.classTable.getElementsByTagName("td");
    docMap.tabCharacter.image = getClasses("character-img")[0];

    docMap.tabSkill = {};
    docMap.tabSkill.base = getClasses("skill-base")[0];
    docMap.tabSkill.morph1st = getClasses("skill-morph1st")[0];
    docMap.tabSkill.morph2nd = getClasses("skill-morph2nd")[0];
    docMap.tabSkill.new = getClasses("skill-new")[0];

    docMap.status = {};
    docMap.status.text = getId("status-bar-text");
    docMap.status.confirmDelete = getId("status-confirm-btn");
    docMap.status.ledRed = getClasses("status-bar-light-red")[0];
  };


  initControls = function () {
    // todo: limit input[type=number] elements to positive numbers

    eschar.chassis.setModalState("ready");
  };


  // *********************
  // *********************


  getId = function (_id) {
    return document.getElementById(_id);
  };

  getClasses = function (_class) {
    return document.getElementsByClassName(_class);
  };

  resize = function () {
    docMap.overlay.height = window.innerHeight;
    docMap.overlay.width = window.innerWidth;
  };

  toggle = function () {
    if (docMap.overlay.classList.contains("eschar-modal-hidden")) {
      display();
    } else {
      hide();
    }
  };
  display = function () {
    docMap.overlay.classList.remove("eschar-modal-hidden");
  };
  hide = function () {
    docMap.overlay.classList.add("eschar-modal-hidden");
  };


  // *********************
  // *********************


  setLock = function (_lock) {
    if (_lock) {
      if (!docMap.status.ledRed.classList.contains("lit-red")) {
        docMap.status.ledRed.classList.add("lit-red");
      }
    } else {
      if (docMap.status.ledRed.classList.contains("lit-red")) {
        docMap.status.ledRed.classList.remove("lit-red");
      }
    }
  };


  setState = function (_state) {
    var bDelete, selCat, selGroup, enableItem;

    if (["ready", "first", "last"].includes(_state)) {
      bDelete = true;

      if (eschar.chassis.getCategories().length) {
        selCat = eschar.chassis.getSelectedCategory();
        if (selCat.groups.length) {
          selGroup = eschar.chassis.getSelectedGroup();
        }
      }

      // disable delete if children exist on parent category or group
      switch (cfgMap.static.modalTabs[eschar.chassis.getModalTab()]) {
        case "characters":
          bDelete = true;
          break;
        case "categories":
          if (selCat.groups.length) {
            bDelete = false;
          }
          break;
        case "groups":
          if (selGroup.skills.length) {
            bDelete = false;
          }
          break;
        case "skills":
          bDelete = true;
          break;
      }
      eschar.chassis.setModalLock(false);

    } else {

      // exit if state has not changed
      if (_state === eschar.chassis.getModalState()) {
        return;
      }
      eschar.chassis.setModalLock(true);

    }

    enableItem = function (_item, _enabled) {
      if (_enabled) {
        if (docMap.menu[_item].classList.contains("disabled")) {
          docMap.menu[_item].classList.remove("disabled");
        }
      } else {
        if (!docMap.menu[_item].classList.contains("disabled")) {
          docMap.menu[_item].classList.add("disabled");
        }
      }
    };

    switch (_state) {

      case "ready":
        enableItem("new", true);
        enableItem("save", false);
        enableItem("saveclose", false);
        enableItem("savenew", false);
        enableItem("delete", bDelete);
        enableItem("cancel", false);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", true);
        enableItem("next", true);
        enableItem("close", true);
        break;

      case "new":
        enableItem("new", false);
        enableItem("save", true);
        enableItem("saveclose", true);
        enableItem("savenew", false);
        enableItem("delete", false);
        enableItem("cancel", true);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", false);
        enableItem("next", false);
        enableItem("close", true);
        break;

      case "changed":
        enableItem("new", false);
        enableItem("save", true);
        enableItem("saveclose", true);
        enableItem("savenew", false);
        enableItem("delete", false);
        enableItem("cancel", true);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", false);
        enableItem("next", false);
        enableItem("close", true);
        break;

      case "delete":
        enableItem("new", false);
        enableItem("save", false);
        enableItem("saveclose", false);
        enableItem("savenew", false);
        enableItem("delete", false);
        enableItem("cancel", true);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", false);
        enableItem("next", false);
        enableItem("close", true);
        break;

      case "first":
        enableItem("new", true);
        enableItem("save", false);
        enableItem("saveclose", false);
        enableItem("savenew", false);
        enableItem("delete", bDelete);
        enableItem("cancel", false);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", false);
        enableItem("next", true);
        enableItem("close", true);
        break;

      case "last":
        enableItem("new", true);
        enableItem("save", false);
        enableItem("saveclose", false);
        enableItem("savenew", false);
        enableItem("delete", bDelete);
        enableItem("cancel", false);
        enableItem("open", false);
        enableItem("refresh", false);
        enableItem("previous", true);
        enableItem("next", false);
        enableItem("close", true);
        break;
    }

    getId("status-bar-text").textContent
      = _state.charAt(0).toUpperCase()
      + _state.slice(1);
  };


  confirmDelete = function () {
    if (!docMap.status.confirmDelete.classList.contains("status-hidden")) {
      docMap.status.confirmDelete.classList.add("status-hidden");
    }
  }


  // *********************
  // *********************


  handleMenuClick = function (_evt) {
    var 
      modalState, modaltab, command,
      chars, cats, groups,
      skills, skillIndex, grpSkills, grpSklIdx, 
      charIndex, catIndex, groupIndex;

    if (_evt.target.parentElement.id) {
      if (_evt.target.parentElement.classList.contains("disabled")) {
        return;
      }

      modalState = eschar.chassis.getModalState();
      modaltab = cfgMap.static.modalTabs[eschar.chassis.getModalTab()];
      command = _evt.target.parentElement.id.split("-")[2];

      switch (command) {
        case "new":

          switch (modaltab) {
            case "characters":
              clearCharacter();
              getId("character-name-text").focus();
              break;
            case "categories":
              clearCategory();
              getId("category-name-text").focus();
              break;
            case "groups":
              clearGroup();
              getId("group-name-text").focus();
              break;
            case "skills":
              clearSkill();
              getId("skill-new-name-text").focus();
              break;
          }
          eschar.chassis.setModalState("new");

          break;
        case "save":

          switch (modaltab) {
            case "characters":
              if (modalState === "new") {
                eschar.chassis.createCharacter(buildCharacter());
              }
              if (modalState === "changed") {
                eschar.chassis.updateCharacter(buildCharacter());
              }
              break;
            case "categories":
              if (modalState === "new") {
                eschar.chassis.createCategory(buildCategory());
              }
              if (modalState === "changed") {
                eschar.chassis.updateCategory(buildCategory());
              }
              break;
            case "groups":
              if (modalState === "new") {
                eschar.chassis.createGroup(buildGroup());
              }
              if (modalState === "changed") {
                eschar.chassis.updateGroup(buildGroup());
              }
              break;
            case "skills":
              if (modalState === "new") {
                eschar.chassis.createSkill(buildSkill());
              }
              if (modalState === "changed") {
                eschar.chassis.updateSkill(buildSkill());
              }
              break;
          }

          break;
        case "saveclose":

          switch (modaltab) {
            case "characters":
              if (modalState === "new") {
                eschar.chassis.createCharacter(buildCharacter());
              }
              if (modalState === "changed") {
                eschar.chassis.updateCharacter(buildCharacter());
              }
              break;
            case "categories":
              if (modalState === "new") {
                eschar.chassis.createCategory(buildCategory());
              }
              if (modalState === "changed") {
                eschar.chassis.updateCategory(buildCategory());
              }
              break;
            case "groups":
              if (modalState === "new") {
                eschar.chassis.createGroup(buildGroup());
              }
              if (modalState === "changed") {
                eschar.chassis.updateGroup(buildGroup());
              }
              break;
            case "skills":
              if (modalState === "new") {
                eschar.chassis.createSkill(buildSkill());
              }
              if (modalState === "changed") {
                eschar.chassis.updateSkill(buildSkill());
              }
              break;
          }
          hide();

          break;
        case "savenew":

          switch (modaltab) {
            case "characters":
              
              break;
            case "categories":

              break;
            case "groups":

              break;
            case "skills":

              break;
          }

          break;
        case "delete":

          eschar.chassis.setModalState("delete");

          switch (modaltab) {
            case "characters":
              docMap.status.text.textContent = "Delete Character: "
                + eschar.chassis.getSelectedCharacter().name + " ?";
              break;
            case "categories":
              docMap.confirm.category.textContent = "Delete Category: "
                + eschar.chassis.getSelectedCategory().name + " ?";
              break;
            case "groups":
              docMap.confirm.group.textContent = "Delete Group: "
                + eschar.chassis.getSelectedGroup().name + " ?";
              break;
            case "skills":
              docMap.confirm.skill.textContent = "Delete Skill: "
                + eschar.chassis.getSelectedSkill().name + " ?";
              break;
          }

          if (docMap.status.confirmDelete.classList.contains("status-hidden")) {
            docMap.status.confirmDelete.classList.remove("status-hidden");
          }

          break;
        case "cancel":

          if (modalState === "delete") {
            if (!docMap.status.confirmDelete.classList.contains("status-hidden")) {
              docMap.status.confirmDelete.classList.add("status-hidden");
            }
          }

          switch (modaltab) {
            case "characters":
              updateCharacter();
              break;
            case "categories":
              updateCategory();
              break;
            case "groups":
              updateGroup();
              break;
            case "skills":
              updateSkill();
              break;
          }

          eschar.chassis.setModalState("ready");

          break;
        case "open":

          break;
        case "refresh":

          break;
        case "previous":

          switch (modaltab) {
            case "characters":

              charIndex = eschar.chassis.getCharacterIndex();
              if (charIndex - 1 >= 0) {
                // *******
                //eschar.character.select(charIndex - 1);
                eschar.header.selectCharacter(charIndex - 1); // *** HEADER UPDATE ***
                // *******
              }

              break;
            case "categories":

              catIndex = eschar.chassis.getCategoryIndex();
              if (catIndex - 1 >= 0) {
                eschar.catgrp.selectCategory(catIndex - 1);
              }

              break;
            case "groups":

              groupIndex = eschar.chassis.getGroupIndex();
              if (groupIndex - 1 >= 0) {
                eschar.catgrp.selectGroup(groupIndex - 1);
              }

              break;
            case "skills":

              grpSkills = eschar.chassis.getSkillsInGroup(
                eschar.chassis.getSelectedGroup()
              );
              grpSklIdx = eschar.chassis.getGroupSkillIndex();

              console.log(grpSklIdx);

              if (grpSklIdx - 1 >= 0) {
                eschar.skill.selectById(grpSkills[grpSklIdx - 1]._id);
                eschar.chassis.setGroupSkillIndex(grpSklIdx - 1);
              }

              break;
          }
          eschar.chassis.setModalState("ready");
          break;

        case "next":

          switch (modaltab) {
            case "characters":

              chars = eschar.chassis.getCharacters();
              charIndex = eschar.chassis.getCharacterIndex();
              if (charIndex + 1 < chars.length) {
                eschar.header.selectCharacter(charIndex + 1);
              }

              break;
            case "categories":

              cats = eschar.chassis.getCategories();
              catIndex = eschar.chassis.getCategoryIndex();
              if (catIndex + 1 < cats.length) {
                eschar.catgrp.selectCategory(catIndex + 1);
              }

              break;
            case "groups":

              groups = eschar.chassis.getGroups();
              groupIndex = eschar.chassis.getGroupIndex();
              if (groupIndex + 1 < groups.length) {
                eschar.catgrp.selectGroup(groupIndex + 1);
              }

              break;
            case "skills":

              grpSkills = eschar.chassis.getSkillsInGroup(
                eschar.chassis.getSelectedGroup()
              );
              grpSklIdx = eschar.chassis.getGroupSkillIndex();

              if (grpSklIdx + 1 < grpSkills.length) {
                eschar.skill.selectById(grpSkills[grpSklIdx + 1]._id);
                eschar.chassis.setGroupSkillIndex(grpSklIdx + 1);
              }

              break;
          }
          eschar.chassis.setModalState("ready");
          break;

        case "close":

          if (modalState === "delete") {
            if (!docMap.confirm.character.classList.contains("modal-confirm-hidden")) {
              docMap.confirm.character.classList.add("modal-confirm-hidden");
            }
          }

          switch (modaltab) {
            case "characters":
              updateCharacter();
              break;
            case "categories":
              updateCategory();
              break;
            case "groups":
              updateGroup();
              break;
            case "skills":
              updateSkill();
              break;
          }

          eschar.chassis.setModalState("ready");
          hide();
          break;
      }
    }
  };


  handleTabClick = function (_evt) {
    if (eschar.chassis.getModalLock()) {
      return;
    }

    var
      listItems = docMap.tabs.childNodes,
      pages = getClasses("modal-pages")[0].childNodes, 
      selTab = eschar.chassis.getModalTab();

    if (_evt.target !== getClasses("tab-item-active")[0]) {
      pages[selTab].classList.remove("page-active");
      listItems[selTab].classList.remove("tab-item-active");
      [].slice.call(listItems).forEach(
        function (_node, _idx) {
          if (_node === _evt.target) {
            selTab = _idx;
            eschar.chassis.setModalTab(_idx);
          }
        }
      );
      pages[selTab].classList.add("page-active");
      listItems[selTab].classList.add("tab-item-active");
    }
    eschar.chassis.setModalState("ready");
  };


  handleDataChange = function (_event) {
    var elemSkill;

    if (!eschar.chassis.getModalLock()) {
      eschar.chassis.setModalState("changed");
    }
    if (_event.target.name === "skill-type") {
      if (eschar.chassis.getModalState() === "new") {
        elemSkill = getClasses("skill-new")[0];
      } else {
        elemSkill = getClasses("skill-selected")[0];
      }
      if (elemSkill.classList.contains("skill-ultimate")) {
        elemSkill.classList.remove("skill-ultimate");
      }
      if (elemSkill.classList.contains("skill-active")) {
        elemSkill.classList.remove("skill-active");
      }
      if (elemSkill.classList.contains("skill-passive")) {
        elemSkill.classList.remove("skill-passive");
      }
      elemSkill.classList.add("skill-" + _event.target.value);
    }
  };


  // *********************
  // *********************


  buildCharacter = function () {
    var newChar = {};
    newChar.name = getId("character-name-text").value;
    [].slice.call(docMap.tabCharacter.raceCells).every(function (_cell) {
      if (_cell.classList.contains("selected-race")) {
        newChar.race = _cell.innerText;
        return false;
      } else {
        return true;
      }
    });
    [].slice.call(docMap.tabCharacter.classCells).every(function (_cell) {
      if (_cell.classList.contains("selected-class")) {
        newChar.class = _cell.innerText;
        return false;
      } else {
        return true;
      }
    });
    newChar.sortOrder = getId("character-sort-number").value;
    newChar.img = getId("character-img-path-text").value;
    return newChar;
  };


  clearCharacter = function () {
    getId("character-name-text").value = "";
    getId("character-id-text").value = "";

    getId("character-race-selected").style.backgroundImage
      = "url(../img/races/"
      + cfgMap.static.races[0].toLowerCase()
      + "_norm_64.png)";
    [].slice.call(docMap.tabCharacter.raceCells).forEach(function (_cell) {
      if (_cell.classList.contains("selected-race")) {
        _cell.classList.remove("selected-race");
        _cell.firstChild.classList.remove("icon-20-sel");
      }
      if (_cell.innerText === cfgMap.static.races[0]) {
        _cell.classList.add("selected-race");
        _cell.firstChild.classList.add("icon-20-sel");
      }
    });

    getId("character-class-selected").style.backgroundImage
      = "url(../img/classes/"
      + cfgMap.static.classes[0].toLowerCase()
      + "_norm_64.png)";
    [].slice.call(docMap.tabCharacter.classCells).forEach(function (_cell) {
      if (_cell.classList.contains("selected-class")) {
        _cell.classList.remove("selected-class");
        _cell.firstChild.classList.remove("icon-20-sel");
      }
      if (_cell.innerText === cfgMap.static.classes[0]) {
        _cell.classList.add("selected-class");
        _cell.firstChild.classList.add("icon-20-sel");
      }
    });

    getId("character-sort-number").value = 0;

    docMap.tabCharacter.image.style.backgroundImage
      = "url(../img/characters/blank.png)";
    getId("character-img-path-text").value = "";
  };


  updateCharacter = function () {
    var selChar = eschar.chassis.getSelectedCharacter();
    getId("character-name-text").value = selChar.name;
    getId("character-id-text").value = selChar._id;

    getId("character-race-selected").style.backgroundImage
      = "url(../img/races/" + selChar.race.toLowerCase() + "_norm_64.png)";

    [].slice.call(docMap.tabCharacter.raceCells).forEach(function (_cell) {
      if (_cell.classList.contains("selected-race")) {
        _cell.classList.remove("selected-race");
        _cell.firstChild.classList.remove("icon-20-sel");
      }
      if (!_cell.classList.contains("character-race-tr")) {
        if (_cell.firstChild.id === "character-race-" + selChar.race.toLowerCase()) {
          _cell.classList.add("selected-race");
          _cell.firstChild.classList.add("icon-20-sel");
        }
      }  
    });

    getId("character-class-selected").style.backgroundImage
      = "url(../img/classes/" + selChar.class.toLowerCase() + "_norm_64.png)";

    [].slice.call(docMap.tabCharacter.classCells).forEach(function (_cell) {
      if (_cell.classList.contains("selected-class")) {
        _cell.classList.remove("selected-class");
        _cell.firstChild.classList.remove("icon-20-sel");
      }
      if (_cell.firstChild.id === "character-class-" + selChar.class.toLowerCase()) {
        _cell.classList.add("selected-class");
        _cell.firstChild.classList.add("icon-20-sel");
      }
    });

    getId("character-sort-number").value = selChar.sortOrder;

    if (selChar.img) {
      docMap.tabCharacter.image.style.backgroundImage
        = "url(../img/characters/" + selChar.img + ")";
    } else {
      docMap.tabCharacter.image.style.backgroundImage
        = "url(../img/characters/blank.png)";
    }
    getId("character-img-path-text").value = selChar.img;
  };


  handleCharacterRaceClick = function (_event) {
    if (eschar.chassis.getModalState() === "delete") {
      return;
    }

    var eleCell;

    if (_event.target.localName === "div" || _event.target.localName === "span") {
      eleCell = _event.target.parentElement;
    } else if (_event.target.localName === "td") {
      eleCell = _event.target;
    }

    if (eleCell.classList.contains("selected-race")) {
      return;
    } else {
      [].slice.call(docMap.tabCharacter.raceCells).every(function (_cell) {
        if (_cell.classList.contains("selected-race")) {
          _cell.classList.remove("selected-race");
          _cell.firstChild.classList.remove("icon-20-sel");
          return false;
        } else {
          return true;
        }
      });
      eleCell.classList.add("selected-race");
      eleCell.firstChild.classList.add("icon-20-sel");
      getId("character-race-selected").style.backgroundImage
        = "url(../img/races/"
        + eleCell.innerText.toLowerCase()
        + "_norm_64.png)";
    }

    if (!eschar.chassis.getModalLock()) {
      eschar.chassis.setModalState("changed");
    }
  };


  handleCharacterClassClick = function (_event) {
    if (eschar.chassis.getModalState() === "delete") {
      return;
    }

    var eleCell;

    if (_event.target.localName === "div" || _event.target.localName === "span") {
      eleCell = _event.target.parentElement;
    } else if (_event.target.localName === "td") {
      eleCell = _event.target;
    }

    if (eleCell.classList.contains("selected-class")) {
      return;
    } else {
      [].slice.call(docMap.tabCharacter.classCells).every(function (_cell) {
        if (_cell.classList.contains("selected-class")) {
          _cell.classList.remove("selected-class");
          _cell.firstChild.classList.remove("icon-20-sel");
          return false;
        } else {
          return true;
        }
      });
      eleCell.classList.add("selected-class");
      eleCell.firstChild.classList.add("icon-20-sel");
      getId("character-class-selected").style.backgroundImage
        = "url(../img/classes/"
        + eleCell.innerText.toLowerCase()
        + "_norm_64.png)";
    }

    if (!eschar.chassis.getModalLock()) {
      eschar.chassis.setModalState("changed");
    }
  };


  // *********************
  // *********************


  buildCategory = function () {
    var newCat = {};
    newCat.name = getId("category-name-text").value;
    newCat.sortOrder = getId("category-sort-text").value;
    return newCat;
  };


  clearCategory = function () {
    getId("category-name-text").value = "";
    getId("category-sort-number").value = 0;
    getId("category-id-text").value = "";
  };


  updateCategory = function () {
    var selCat = eschar.chassis.getSelectedCategory();
    getId("category-name-text").value = selCat.name;
    getId("category-sort-number").value = selCat.sortOrder;
    getId("category-id-text").value = selCat._id;
  };


  // *********************
  // *********************


  buildGroup = function () {
    var newGroup = {};
    newGroup.name = getId("group-name-text").value;
    newGroup.sortOrder = getId("group-sort-number").value;
    newGroup.family = getId("group-family-text").value;
    newGroup.categoryId = getId("group-category-id-text").value;
    newGroup.imgSrc = getId("group-img-text").value; // *** unused
    newGroup.imgSize = getId("group-img-size").value; // *** unused
    return newGroup;
  };


  clearGroup = function () {
    getId("group-name-text").value = "";
    getId("group-sort-number").value = 0;
    getId("group-id-text").value = "";
    getId("group-family-text").value = "";
    getId("group-category-id-text").value
      = eschar.chassis.getSelectedCategory()._id;
    getId("group-img-text").value = ""; // *** unused
    getId("group-img-size").value = ""; // *** unused
  };


  updateGroup = function () {
    var selGroup = eschar.chassis.getSelectedGroup();
    getId("group-name-text").value = selGroup.name;
    getId("group-sort-number").value = selGroup.sortOrder;
    getId("group-id-text").value = selGroup._id;
    getId("group-family-text").value = selGroup.family;

    getId("group-category-name-text").value
      = eschar.chassis.getCategoryById(selGroup.categoryId).name;    
    getId("group-category-id-text").value = selGroup.categoryId;

    getId("group-img-text").value = selGroup.imgSrc; // *** unused
    getId("group-img-size").value = selGroup.imgSize; // *** unused
  };


  // *********************
  // *********************


  buildSkill = function () {
    var newSkill = {};
    newSkill.name = getId("modal-skill-name-text").value;
    newSkill.type = getId("modal-skill-type-select").value;
    newSkill.sortOrder = getId("modal-skill-sort-text").value;
    newSkill.imgOffset = getId("modal-skill-img-text").value;
    newSkill.imgPath = getId("modal-skill-imgPath-text").value;
    newSkill.groupId = getId("modal-skill-groupId-text").value;
    newSkill.parentId = getId("modal-skill-parentId-text").value;
    newSkill.description = getId("modal-skill-desc-text").value;
    newSkill.adds = getId("modal-skill-adds-text").value;
    newSkill.points = getId("modal-skill-points-text").value;
    return newSkill;
  };


  clearSkill = function () {

    if (!docMap.tabSkill.base.classList.contains("skill-hidden")) {
      docMap.tabSkill.base.classList.add("skill-hidden");
    }
    if (!docMap.tabSkill.morph1st.classList.contains("skill-hidden")) {
      docMap.tabSkill.morph1st.classList.add("skill-hidden");
    }
    if (!docMap.tabSkill.morph2nd.classList.contains("skill-hidden")) {
      docMap.tabSkill.morph2nd.classList.add("skill-hidden");
    }

    if (docMap.tabSkill.new.classList.contains("skill-hidden")) {
      docMap.tabSkill.new.classList.remove("skill-hidden");
    }

    getId("skill-new-icon").style.backgroundImage
      = "url(../img/skills/" + "unknown.png"; // path to cfgMap

    getId("skill-new-name-text").value = "";
    getId("skill-new-imgPath-text").value = "unknown.png";
    getId("skill-new-desc-text").value = "";
    getId("skill-new-points-text").value = 1;
    getId("skill-new-sort-text").value = 0;
  };


  updateSkill = function () {
    var selGroup, selSkill, baseSkill, wraps;
    
    selSkill = eschar.chassis.getSelectedSkill();
    selGroup = eschar.chassis.getGroupById(selSkill.groupId);

    if (selSkill.groupId === selSkill.parentId) {
      baseSkill = selSkill;
    } else {
      baseSkill = eschar.chassis.getSkillById(selSkill.parentId);
    }

    // add group and type info
    getId("skill-group-name-text").value = selGroup.name;
    getId("skill-group-id-text").value = selGroup._id;

    getId("radio-" + baseSkill.type.toLowerCase()).checked = true;

    // add skill-type outline color
    wraps = getClasses("skill-wrapper");
    [].slice.call(wraps).forEach(function (_wrap) {
      if (_wrap.classList.contains("skill-ultimate")){
        _wrap.classList.remove("skill-ultimate");
      }
      if (_wrap.classList.contains("skill-active")){
        _wrap.classList.remove("skill-active");
      }
      if (_wrap.classList.contains("skill-passive")){
        _wrap.classList.remove("skill-passive");
      }
      _wrap.classList.add("skill-" + baseSkill.type.toLowerCase());   
    });

    // add selected skill highlight box-shadow
    [ docMap.tabSkill.base,
      docMap.tabSkill.morph1st,
      docMap.tabSkill.morph2nd ].forEach(function (_ele) {
      if (_ele.classList.contains("skill-selected")) {
        _ele.classList.remove("skill-selected");
      }
    });
    if (selSkill === baseSkill) {
      if (!docMap.tabSkill.base.classList.contains("skill-selected")) {
        docMap.tabSkill.base.classList.add("skill-selected");
      }
    }
    if (selSkill === baseSkill.morphs[0]) {
      if (!docMap.tabSkill.morph1st.classList.contains("skill-selected")) {
        docMap.tabSkill.morph1st.classList.add("skill-selected");
      }
    }
    if (selSkill === baseSkill.morphs[1]) {
      if (!docMap.tabSkill.morph2nd.classList.contains("skill-selected")) {
        docMap.tabSkill.morph2nd.classList.add("skill-selected");
      }
    }

    // base ability info
    if (docMap.tabSkill.base.classList.contains("skill-hidden")) {
      docMap.tabSkill.base.classList.remove("skill-hidden");
    }

    getId("skill-base-icon").style.backgroundImage
      = "url(../img/skills/" + baseSkill.imgPath;

    getId("skill-base-name-text").value = baseSkill.name;
    getId("skill-base-id-text").value = baseSkill._id;
    getId("skill-base-imgPath-text").value = baseSkill.imgPath;
    getId("skill-base-desc-text").value = baseSkill.description;
    getId("skill-base-points-text").value = baseSkill.points;
    getId("skill-base-sort-text").value = baseSkill.sortOrder;

    //  first morph ability info
    if (baseSkill.morphs && baseSkill.morphs[0]) {
      if (docMap.tabSkill.morph1st.classList.contains("skill-hidden")) {
        docMap.tabSkill.morph1st.classList.remove("skill-hidden");
      }
      getId("skill-morph1st-name-text").value = baseSkill.morphs[0].name;
      getId("skill-morph1st-id-text").value = baseSkill.morphs[0]._id;

      getId("skill-morph1st-icon").style.backgroundImage
      = "url(../img/skills/" + baseSkill.morphs[0].imgPath;

      getId("skill-morph1st-imgPath-text").value = baseSkill.morphs[0].imgPath;
      getId("skill-morph1st-desc-text").value = baseSkill.description;
      getId("skill-morph1st-adds-text").value = baseSkill.morphs[0].adds;
      getId("skill-morph1st-points-text").value = baseSkill.morphs[0].points;
      getId("skill-morph1st-sort-text").value = baseSkill.morphs[0].sortOrder;
    } else {
      if (!docMap.tabSkill.morph1st.classList.contains("skill-hidden")) {
        docMap.tabSkill.morph1st.classList.add("skill-hidden");
      }      
    }

    //  second morph ability info
    if (baseSkill.morphs && baseSkill.morphs[1]) {
      if (docMap.tabSkill.morph2nd.classList.contains("skill-hidden")) {
        docMap.tabSkill.morph2nd.classList.remove("skill-hidden");
      }
      getId("skill-morph2nd-name-text").value = baseSkill.morphs[1].name;
      getId("skill-morph2nd-id-text").value = baseSkill.morphs[1]._id;
      getId("skill-morph2nd-imgPath-text").value = baseSkill.morphs[1].imgPath;

      getId("skill-morph2nd-icon").style.backgroundImage
      = "url(../img/skills/" + baseSkill.morphs[1].imgPath;

      getId("skill-morph2nd-desc-text").value = baseSkill.description;
      getId("skill-morph2nd-adds-text").value = baseSkill.morphs[1].adds;
      getId("skill-morph2nd-points-text").value = baseSkill.morphs[1].points;
      getId("skill-morph2nd-sort-text").value = baseSkill.morphs[1].sortOrder;
    } else {
      if (!docMap.tabSkill.morph2nd.classList.contains("skill-hidden")) {
        docMap.tabSkill.morph2nd.classList.add("skill-hidden");
      }      
    }

    if (!docMap.tabSkill.new.classList.contains("skill-hidden")) {
      docMap.tabSkill.new.classList.add("skill-hidden");
    }
  };


  handleSkillClick = function (_event, _element) {
    var elemId
      = _element.getElementsByClassName("skill-id")[0].value;

    switch (eschar.chassis.getModalState()) {
      case "ready":
        eschar.skill.selectById(elemId);
        break;
      case "new":
        //console.log("handleSkillClick > Modal state: New");

        break;
      case "changed": 
        if (elemId !== eschar.chassis.getSelectedSkill()._id) {
          _event.preventDefault();
          _event.stopPropagation();
        }
        break;
    }
  };


  // *********************
  // *********************


  bindEvents = function () {

    [].slice.call(docMap.menuItems).forEach(function (_item) {
      _item.addEventListener("click", handleMenuClick, false);
    });

    docMap.tabs.addEventListener(
      "click", handleTabClick, false
    );

    // ******* input elements 
    [].slice.call(docMap.pages.getElementsByTagName("input"))
      .forEach(function (_input) {
        _input.addEventListener("change", function (_event) {
          handleDataChange(_event);
        });
        _input.addEventListener("input", function (_event) {
          handleDataChange(_event);
        });
      }
    );
    [].slice.call(docMap.pages.getElementsByTagName("select"))
      .forEach(function (_input) {
        _input.addEventListener("change", function (_event) {
          handleDataChange(_event);
        });
      });
    [].slice.call(docMap.pages.getElementsByTagName("textarea"))
      .forEach(function (_area) {
        _area.addEventListener("change", function (_event) {
          handleDataChange(_event);
        });
        _area.addEventListener("input", function (_event) {
          handleDataChange(_event);
        });
      });

    // ******** Character Tab
    [].slice.call(docMap.tabCharacter.raceCells).forEach(function (_cell) {
      _cell.addEventListener("mousedown", function (_event) {
        handleCharacterRaceClick(_event);
      });
    });

    [].slice.call(docMap.tabCharacter.classCells).forEach(function (_cell) {
      _cell.addEventListener("mousedown", function (_event) {
        handleCharacterClassClick(_event);
      });
    });

    // ******** Skill Tab
    [].slice.call(getClasses("skill-wrapper")).forEach(function (_element) {
      _element.addEventListener("mousedown", function (_event) {
        handleSkillClick(_event, _element);
      });
    });

    // ******** Status Bar
    docMap.status.confirmDelete.addEventListener("click", function () {

      switch (eschar.chassis.getModalTab()) {
        case 0: // Character
          eschar.chassis.deleteCharacter(
            eschar.chassis.getSelectedCharacter()
          );
          break;
        case 1: // Category
          console.log("status.confirmDelete.click event on the category tab");
          break;
        case 2: // Group
          console.log("status.confirmDelete.click event on the group tab");
          break;
        case 3: // Skill
          console.log("status.confirmDelete.click event on the skill tab");
          break;
      }
    });
  };


  initModule = function (_container) {
    _container.innerHTML = cfgMap.main_html;

    setDocMap();
    initControls();
    bindEvents();

    return true;
  };


  return {
    "initModule": initModule,

    "resize": resize, 
    "toggle": toggle,

    "setLock": setLock,
    "setState": setState, 
    "confirmDelete": confirmDelete, 

    "updateCharacter": updateCharacter, 
    "updateCategory": updateCategory, 
    "updateGroup": updateGroup, 
    "updateSkill": updateSkill
  };

}());

