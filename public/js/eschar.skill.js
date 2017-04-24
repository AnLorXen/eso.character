

eschar.skill = (function () {
  "use strict";

  var
    initModule, setDocMap,
    bindEvents, handleClick, 
    sort, buildList,
    select, selectByItem, selectById, 
    
    handleBarBtnClick, handleCountBtnClick,
    
    cfgMap = {
      "main_html": String() 
        + "<ul class='eschar-skill-list'></ul>",

      "ability_item_html": String()
        + "<li>"
        + "<div class='icon'></div>"
        + "<div class='info'>"
        + "<div class='info-title'></div>"
        + "</div>"
        + "<div class='build'>"
        + "<div class='build-count'></div>"
        + "<div class='build-ctrls'>"
        + "</div>"
        + "</div>"
        + "</li>",

      "ability_bar_html": String()
        + "<div class='info-progress'>"
        + "<progress class='bar' value='0'></progress>"
        + "</div>"

    },
    
    docMap = {};


  setDocMap = function () {
    docMap.skillList
      = document.getElementsByClassName("eschar-skill-list")[0];
  };


  sort = function () {
    var skills = eschar.chassis.getSkills();
    skills.sort(function (_a, _b) {
      if (_a.sortOrder > _b.sortOrder) { return 1; }
      if (_a.sortOrder < _b.sortOrder) { return -1; }
      return 0;
    });
  };


  select = function (_index, _item) {
    var selItem = eschar.chassis.getSkillItem();
    if (selItem === _item) {
      return;
    }
    if (selItem && selItem.classList.contains("selectedSkill")) {
      selItem.classList.remove("selectedSkill");
    }
    if (!_item.classList.contains("selectedSkill")) {
      _item.classList.add("selectedSkill");
    }
    eschar.chassis.setSkill(_index, _item);
  };


  selectByItem = function (_item) {
    eschar.chassis.getSkills().every(function (_skill, _idx) {
      if (_skill._id === _item.id) {
        select(_idx, _item);
        return false;
      } else {
        return true;
      }
    });      
  };


  selectById = function (_id) {
    eschar.chassis.getSkills().every(function (_skill, _idx) {
      if (_skill._id === _id) {
        select(_idx, document.getElementById(_id));
        return false;
      } else {
        return true;
      }
    });
  };


  buildList = function () {
    var
      sheetDyn, currGroup, selChar, 
      eleSkillLi, eleAbilUl, 
      addAbilityListItem, eleAbilLi, 
      skillCount;

    // clear skill list element and dynamic css sheet
    docMap.skillList.innerHTML = "";
    sheetDyn = eschar.chassis.getDynamicStyles();
    while (sheetDyn.cssRules.length) {
      sheetDyn.deleteRule(0);
    }

    addAbilityListItem = function (_index, _abil) {
      var
        iconId, eleIcon, eleInfo, eleBuildCount,
        barId, eleBar, eleBuildCountBtn, eleBuildBarBtn;

      eleAbilUl.insertAdjacentHTML(
        "beforeend", cfgMap.ability_item_html
      );

      // setup skill type
      eleAbilLi = eleAbilUl.childNodes[_index];
      eleAbilLi.classList.add(_abil.type.toLowerCase());
      eleAbilLi.setAttribute("id", _abil._id);

      if (_abil._id === eschar.chassis.getSelectedSkill()._id) {
        eleAbilLi.classList.add("selectedSkill");
      }

      // setup skill icon
      iconId = "icon-" + docMap.skillList.childNodes.length + "-" + _index;
      eleIcon = eleAbilLi.getElementsByClassName("icon")[0];
      eleIcon.setAttribute("id", iconId);
      sheetDyn.insertRule(
        "#" + iconId
        + "{ background-image: url(../img/skills/"
        + _abil.imgPath + "); }",
        sheetDyn.cssRules.length
      );

      // setup skill title
      eleAbilLi.getElementsByClassName("info-title")[0].textContent = _abil.name;

      // setup skill bar and points
      eleInfo = eleAbilLi.getElementsByClassName("info")[0];
      eleBuildCount = eleAbilLi.getElementsByClassName("build-count")[0];
      eleBuildCount.textContent = "0 / " + _abil.points;

      if (_abil.type !== "Passive") {
        eleInfo.insertAdjacentHTML("beforeend", cfgMap.ability_bar_html);
        barId = "bar-" + docMap.skillList.childNodes.length + "-" + _index;
        eleBar = eleInfo.getElementsByClassName("bar")[0];
        eleBar.setAttribute("id", barId);
      }

      skillCount = 0;      
      selChar.skills.forEach(function (_skill) {
        if (_skill.skillId === _abil._id) {
          eleBuildCount.textContent = _skill.points + " / " + _abil.points;
          skillCount = _skill.points;
          if (_abil.type !== "Passive") {
            eleBar.value = _skill.knowledge;
          }
        }
      });

      // setup skill ctrls
      eleBuildCountBtn = document.createElement("div");
      if (skillCount > 0) {
        eleBuildCountBtn.classList.add("count-on");
      }
      eleBuildCountBtn.classList.add("build-ctrl-count");

      if (_abil.type === "Passive") {
        eleBuildCountBtn.classList.add("no-bar");
      } else {
        eleBuildBarBtn = document.createElement("div");
        eleBuildBarBtn.classList.add("build-ctrl-bar");
        eleAbilLi.getElementsByClassName("build-ctrls")[0]
          .appendChild(eleBuildBarBtn);
      }
      eleAbilLi.getElementsByClassName("build-ctrls")[0]
        .appendChild(eleBuildCountBtn);
    };

    selChar = eschar.chassis.getSelectedCharacter();
    currGroup = eschar.chassis.getSelectedGroup();

    //console.log("eschar.skill.buildList.getSelectedGroup: ", currGroup.name);

    currGroup.skills.forEach(function (_skill) {

      eleSkillLi = document.createElement("li");
      eleAbilUl = document.createElement("ul");
      eleAbilUl.classList.add("ability-list");
      eleSkillLi.appendChild(eleAbilUl);

      addAbilityListItem(0, _skill);
      if (_skill.morphs.length && _skill.morphs[0]) {
        addAbilityListItem(1, _skill.morphs[0]);
      }
      if (_skill.morphs.length && _skill.morphs[1]) {
        addAbilityListItem(2, _skill.morphs[1]);
      }

      docMap.skillList.appendChild(eleSkillLi);
    });    
  };


  handleClick = function (_evt) {
    // cancel click if character is locked
    if (eschar.chassis.getCharacterLock()) {
      return;
    }

    var eleLi, skills, grpSkills, clickedSkill, baseSkill;

    // get clicked list item
    if (_evt.target.classList.contains("icon")) {
      eleLi = _evt.target.parentElement;
    } else if (_evt.target.classList.contains("info-title")) {
      eleLi = _evt.target.parentElement.parentElement;
    } else if (_evt.target.classList.contains("bar")) {
      eleLi = _evt.target.parentElement.parentElement.parentElement;
    } else if (_evt.target.classList.contains("build-ctrl-bar")) {
      eleLi = _evt.target.parentElement.parentElement.parentElement;
    } else if (_evt.target.classList.contains("build-ctrl-count")) {
      eleLi = _evt.target.parentElement.parentElement.parentElement;
    } else {
      return;
    }

    // set group skill index/item in state map and select list item
    [].slice.call(docMap.skillList.childNodes).every(function (_node, _idx) {
      if (_node.firstChild.firstChild.id === eleLi.id) {
        eschar.chassis.setGroupSkillIndex(_idx);
        return false;
      } else {
        return true;
      }
    });
    selectByItem(eleLi);

    // handle skill button click
    if (_evt.target.classList.contains("build-ctrl-bar")) {
      handleBarBtnClick();
    }
    if (_evt.target.classList.contains("build-ctrl-count")) {
      handleCountBtnClick();
    }
  };


  handleBarBtnClick = function () {
    var selChar, selSkill, skillExists, currKnown, currPoints;

    selChar = eschar.chassis.getSelectedCharacter();
    selSkill = eschar.chassis.getSelectedSkill();
    skillExists = false;

    // get existing character skill data
    selChar.skills.every(function (_charSkill) {
      if (_charSkill.skillId === selSkill._id) {
        skillExists = true;
        currKnown = _charSkill.knowledge;
        currPoints = _charSkill.points;
        return false;
      } else {
        return true;
      }
    });

    // send POST or PUT
    if (!skillExists) {
      eschar.chassis.createCharacterSkill("bar", 1, 0);
    } else {
      if (currKnown === 0) {
        eschar.chassis.updateCharacterSkill("bar", 1, currPoints);
      } else {
        eschar.chassis.updateCharacterSkill("bar", 0, currPoints);
      }
    }
  };


  handleCountBtnClick = function () {
    var
      selChar, selSkill, skillExists,
      setCountBtn, currKnown, currPoints;

    selChar = eschar.chassis.getSelectedCharacter();
    selSkill = eschar.chassis.getSelectedSkill();
    skillExists = false;
    currPoints = -1;

    setCountBtn = function (_state) {
      var selItem, eleBtn;

      selItem = eschar.chassis.getSkillItem();
      eleBtn = selItem.getElementsByClassName("build-ctrl-count")[0];
      if (_state === "on") {
        if (!eleBtn.classList.contains("count-on")) {
          eleBtn.classList.add("count-on");
        }
      } else {
        if (eleBtn.classList.contains("count-on")) {
          eleBtn.classList.remove("count-on");
        }
      }
    };

    // get existing character skill data
    selChar.skills.every(function (_charSkill) {
      if (_charSkill.skillId === selSkill._id) {
        skillExists = true;
        currKnown = _charSkill.knowledge;
        currPoints = _charSkill.points;
        return false;
      } else {
        return true;
      }
    });

    // send POST or PUT
    if (!skillExists) {
      eschar.chassis.createCharacterSkill("count", 0, 1);
      setCountBtn("on");
    } else {
      if (currPoints < selSkill.points) {
        currPoints += 1;
        setCountBtn("on");
      } else {
        currPoints = 0;
        setCountBtn("off");
      }
      eschar.chassis.updateCharacterSkill("count", currKnown, currPoints);
    }
  };


  bindEvents = function () {
    docMap.skillList.addEventListener(
      "click", handleClick, false
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

    "sort": sort,
    "selectByItem": selectByItem,
    "selectById": selectById,

    "buildList": buildList
  };

}());

