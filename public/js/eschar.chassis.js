

eschar.chassis = (function () {
  "use strict";

  var
    $http, $httpCallback, initModule, bindEvents,

    getCharacters, getSelectedCharacter,
    getCharacterIndex, getCharacterItem, setCharacter,
    getCharacterLock, setCharacterLock, 
    createCharacter, updateCharacter, deleteCharacter,

    getCategories, getSelectedCategory, getCategoryById, 
    getCategoryIndex, getCategoryItem, setCategory,
    createCategory, updateCategory, deleteCategory,

    getGroups, getSelectedGroup,
    getGroupIndex, getGroupItem, getGroupById, setGroup,
    createGroup, updateGroup, deleteGroup,

    getSkills, getSkillsInGroup, getGroupSkillCount, 
    getGroupSkillIndex, setGroupSkillIndex,
    getSelectedSkill, getSkillIndex, getSkillItem,
    getSkillById, setSkill,
    createSkill, updateSkill, deleteSkill,

    buildCharGroupSkills, 
    createCharacterSkill, updateCharacterSkill,
    getCharacterGroupPoints, setCharacterGroupPoints, 

    buildCatGrpSklTree, getCatGrpSklTree,
    resetDynamicStyles, getDynamicStyles, sheetDyn,
    getModalState, setModalState,
    getModalLock, setModalLock,
    getModalTab, setModalTab,

    cfgMap = {
      "main_html": String()
        + "<div class='eschar-chassis-header'></div>"
        + "<div class='eschar-chassis-body'>"
        + "<div class='eschar-body-catgrp'></div>"
        + "<div class='eschar-body-skill'></div>"
        + "</div>"
        + "<div class='eschar-chassis-footer'></div>"
        + "<div class='eschar-chassis-modal'></div>",

      "initial": {
        "character": 0,
        "category": 0,
        "group": 3,
        "skill": "57fc2658ea2729fb04991084"
      }
    },

    stMap = {
      "characters": {
        "collection": [],
        "selectedIndex": 0,
        "selectedItem": null,
        "ctrls": {
          "locked": true
        }
      },
      "categories": {
        "collection": [],
        "selectedIndex": 0,
        "selectedItem": null
      },
      "groups": {
        "collection": [],
        "selectedIndex": 0,
        "selectedItem": null
      },
      "skills": {
        "collection": [],
        "selectedIndex": 0,
        "selectedItem": null,
        "groupSkillIndex": 0, 
      },
      "catGrpSklTree": {
      },
      "charGroupSkills": [
      ],
      "modal": {
        "locked": false,
        "state": "",
        "selectedTab": 0
      }
    },

    docMap = {};


  $http = function (_url) {
    var
      core, promise, client, data, argcount, key;

    core = {
      "ajax": function (_method, _url, _args) {
        promise = new Promise(function (_resolve, _reject) {
          client = new XMLHttpRequest();

          if (_method === "GET" || _method === "DELETE") {
            client.open(_method, _url);
            client.send();
          }

          if (_args && (_method === "POST" || _method === "PUT")) {
            data = "";
            argcount = 0;
            for (key in _args) {
              if (_args.hasOwnProperty(key)) {
                if (argcount++) {
                  data += "&";
                }
                data += encodeURIComponent(key)
                  + "=" + encodeURIComponent(_args[key]);
              }
            }
            client.open(_method, _url);
            client.setRequestHeader(
              "content-type", "application/x-www-form-urlencoded"
            );
            client.send(data);
          }

          client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              _resolve(JSON.parse(this.response));
            }
          };
          client.onerror = function () {
            _reject(this.statusText);
          };
        });

        return promise;
      }
    };

    return {
      "get": function (_args) {
        return core.ajax("GET", _url, _args);
      },
      "post": function (_args) {
        return core.ajax("POST", _url, _args);
      },
      "put": function (_args) {
        return core.ajax("PUT", _url, _args);
      },
      "delete": function (_args) {
        return core.ajax("DELETE", _url, _args);
      }
    };
  };


  $httpCallback = {
    "success": function (_data) {
      console.log(1, "success", JSON.parse(_data));
    },
    "error": function (_data) {
      console.log(2, "error", _data);
    }
  };


  // *********************
  // *********************


  getCharacters = function () {
    return stMap.characters.collection;
  };


  getSelectedCharacter = function () {
    return stMap.characters.collection[stMap.characters.selectedIndex];
  };


  getCharacterIndex = function () {
    return stMap.characters.selectedIndex;
  };


  getCharacterItem = function () {
    return stMap.characters.selectedItem;
  };


  setCharacter = function (_ele, _idx) {
    var catItem, catText, groups;

    stMap.characters.selectedItem = _ele;
    stMap.characters.selectedIndex = _idx;

    // rebuild catgrp list and select current category
    eschar.catgrp.buildList();
    eschar.catgrp.selectCategory(stMap.categories.selectedIndex);

    // select category's first group if character's class or race changes
    // else select current group
    catItem = stMap.categories.selectedItem;
    catText = getSelectedCategory().name;
    if (catText === "Class" || catText === "Racial") {
      groups = stMap.groups.collection;
      [].slice.call(catItem.lastChild.childNodes).every(
        function (_grpItem) {
          if (!_grpItem.classList.contains("catgrp-hidden")) {
            stMap.groups.collection.every(function (_grp, _grpIdx) {
              if (_grp._id === _grpItem.id) {
                setGroup(_grpItem, _grpIdx);
                eschar.catgrp.selectGroup(_grpIdx);
                return false;
              } else {
                return true;
              }
            });
            return false;
          } else {
            return true;
          }
        }
      );
    } else {
      eschar.catgrp.selectGroup(stMap.groups.selectedIndex);
    }
    eschar.modal.updateCharacter();
  };


  getCharacterLock = function () {
    return stMap.characters.ctrls.locked;
  };

  setCharacterLock = function (_state) {
    stMap.characters.ctrls.locked = _state;
  };


  createCharacter = function (_char) {
    var newChar = {};
    newChar.name = _char.name;
    newChar.race = _char.race;
    newChar.class = _char.class;
    newChar.sortOrder = _char.sortOrder;
    newChar.img = _char.img;

    $http("api/characters")
      .post(newChar)
      .then(function (_data) {

        // todo: move to callback
        newChar._id = _data.id;
        newChar.skills = [];

        stMap.characters.collection.push(newChar);
        eschar.header.buildCharacterList();
        eschar.header.selectCharacterByName(newChar.name);

        setModalState("ready");
      })
      .catch($httpCallback.error);
  };


  updateCharacter = function (_char) {
    var selChar
      = stMap.characters.collection[stMap.characters.selectedIndex];

    $http("api/characters/" + selChar._id)
      .put(_char)
      .then(function (_data) {

        // TODO: move to callback
        // TODO: Set multiple properties using Object.assign()
        selChar.name = _char.name;
        selChar.race = _char.race;
        selChar.class = _char.class;
        selChar.sortOrder = _char.sortOrder;
        selChar.img = _char.img;

        eschar.header.buildCharacterList();
        eschar.header.selectCharacterByName(selChar.name);

        setModalState("ready");
      })
      .catch($httpCallback.error);
  };


  deleteCharacter = function (_char) {
    $http("api/characters" + "/" + _char._id).delete()
      .then(function (_data) {

        // todo: move to callback
        stMap.characters.collection.splice(stMap.characters.selectedIndex, 1);
        eschar.header.buildCharacterList();

        // if last character is deleted move selection up one
        if (stMap.characters.selectedIndex === stMap.characters.collection.length) {
          eschar.header.selectCharacter(stMap.characters.selectedIndex - 1);
        } else {
          eschar.header.selectCharacter(stMap.characters.selectedIndex);
        }

        eschar.modal.confirmDelete();
        setModalState("ready");
      }).catch($httpCallback.error);
  };


  // *********************
  // *********************


  getCategories = function () {
    return stMap.categories.collection;
  };


  getSelectedCategory = function () {
    return stMap.categories.collection[stMap.categories.selectedIndex];
  };


  getCategoryById = function (_id) {
    var category;
    stMap.categories.collection.every(function (_category) {
      if (_category._id === _id) {
        category = _category;
        return false;
      } else {
        return true;
      }
    });
    return category;
  };


  getCategoryIndex = function () {
    return stMap.categories.selectedIndex;
  };

  getCategoryItem = function () {
    return stMap.categories.selectedItem;
  };


  setCategory = function (_idx, _item) {
    stMap.categories.selectedIndex = _idx;
    stMap.categories.selectedItem = _item;

    eschar.modal.updateCategory();
  };


  createCategory = function (_cat) {
    var newCat = {};

    newCat.name = _cat.name;
    newCat.sortOrder = _cat.sortOrder;

    $http("api/categories")
    .post(newCat)
    .then(function (_data) {

      newCat._id = _data.id;

      stMap.categories.collection.push(newCat);
      buildCatGrpSklTree();
      eschar.catgrp.buildList();
      eschar.catgrp.selectCategoryByName(newCat.name);

      setModalState("ready");
    })
    .catch($httpCallback.error);
  };


  updateCategory = function (_cat) {
    var selCat
      = stMap.categories.collection[stMap.categories.selectedIndex];

    $http("api/categories/" + selCat._id)
      .put(_cat)
      .then(function (_data) {

        // TODO: move to callback
        // TODO: Set multiple properties using Object.assign()
        selCat.name = _cat.name;
        selCat.sortOrder = _cat.sortOrder;

        buildCatGrpSklTree();
        eschar.catgrp.buildList();
        eschar.catgrp.selectCategoryByName(selCat.name);

        setModalState("ready");
      })
      .catch($httpCallback.error);
  };


  deleteCategory = function (_cat) {

    $http("api/categories" + "/" + _cat._id).delete()
      .then(function (_data) {

        // todo: move to callback
        stMap.categories.collection.splice(stMap.categories.selectedIndex, 1);
        buildCatGrpSklTree();
        eschar.catgrp.buildList();

        // if last category is deleted move selection up one
        if (stMap.categories.selectedIndex === stMap.categories.collection.length) {
          eschar.catgrp.selectCategory(stMap.categories.selectedIndex - 1);
        } else {
          eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
        }

        eschar.modal.confirmCategory();
        setModalState("ready");

      }).catch($httpCallback.error);
  };


  // *********************
  // *********************


  getGroups = function () {
    return stMap.groups.collection;
  };


  getSelectedGroup = function () {
    return stMap.groups.collection[stMap.groups.selectedIndex];
  };


  getGroupIndex = function () {
    return stMap.groups.selectedIndex;
  };


  getGroupItem = function () {
    return stMap.groups.selectedItem;
  };


  getGroupById = function (_id) {
    var group;
    stMap.groups.collection.every(function (_group) {
      if (_group._id === _id) {
        group = _group;
        return false;
      } else {
        return true;
      }
    });
    return group;
  };


  setGroup = function (_item, _idx) {
    stMap.groups.selectedItem = _item;
    stMap.groups.selectedIndex = _idx;

    eschar.skill.buildList();
    eschar.modal.updateGroup();
  };


  createGroup = function (_group) {
    var newGroup = {};

    // TODO: Set multiple properties using Object.assign()
    newGroup.name = _group.name;
    newGroup.sortOrder = _group.sortOrder;
    newGroup.family = _group.family;
    newGroup.categoryId = _group.categoryId;
    newGroup.imgSrc = _group.imgSrc;
    newGroup.imgSize = _group.imgSize;

    $http("api/groups")
    .post(newGroup)
    .then(function (_data) {

      // todo: move to callback
      document.getElementById("modal-group-id-text").value = _data.id;
      newGroup._id = _data.id;

      stMap.groups.collection.push(newGroup);
      buildCatGrpSklTree();
      eschar.catgrp.buildList();
      eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
      eschar.catgrp.selectGroupByName(newGroup.name);

      setModalState("ready");
    })
    .catch($httpCallback.error);

  };


  updateGroup = function (_group) {
    var selGroup = stMap.groups.collection[stMap.groups.selectedIndex];

    $http("api/groups/" + selGroup._id)
    .put(_group)
    .then(function (_data) {

      // todo: move to callback
      // TODO: Set multiple properties using Object.assign()
      selGroup.name = _group.name;
      selGroup.sortOrder = _group.sortOrder;
      selGroup.family = _group.family;
      selGroup.categoryId = _group.categoryId;
      selGroup.imgSrc = _group.imgSrc;
      selGroup.imgSize = _group.imgSize;

      buildCatGrpSklTree();
      eschar.catgrp.buildList();
      eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
      eschar.catgrp.selectGroupByName(selGroup.name);

      setModalState("ready");
    })
    .catch($httpCallback.error);
  };


  deleteGroup = function (_grp) {
    var selCat;

    $http("api/groups" + "/" + _grp._id).delete()
      .then(function (_data) {

        // todo: move to callback
        stMap.groups.collection.splice(stMap.groups.selectedIndex, 1);
        buildCatGrpSklTree();
        eschar.catgrp.buildList();
        eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
        eschar.catgrp.selectGroupByVisibilty();

        eschar.modal.confirmGroup();
        setModalState("ready");

      }).catch($httpCallback.error);
  };


  // *********************
  // *********************


  getSkills = function () {
    return stMap.skills.collection;
  };


  getSkillsInGroup = function (_group) {
    return _group.skills;
  };

  getGroupSkillCount = function (_group) {
    var skillCount = 0;
    getSkillsInGroup(_group).forEach(function (_grp) {
      skillCount += 1;
      if (_grp.morphs) {
        _grp.morphs.forEach(function (_morph) {
          skillCount += 1;
        });
      }
    });
    return skillCount;
  };

  getGroupSkillIndex = function () {
    return stMap.skills.groupSkillIndex;
  };
  setGroupSkillIndex = function (_index) {
    stMap.skills.groupSkillIndex = _index;
  };


  getSelectedSkill = function () {
    return stMap.skills.collection[stMap.skills.selectedIndex];
  };


  getSkillIndex = function () {
    return stMap.skills.selectedIndex;
  };


  getSkillItem = function () {
    return stMap.skills.selectedItem;
  };


  getSkillById = function (_id) {
    var skill;
    stMap.skills.collection.every(function (_skill) {
      if (_skill._id === _id) {
        skill = _skill;
        return false;
      } else {
        return true;
      }
    });
    return skill;
  };


  setSkill = function (_idx, _item) {
    stMap.skills.selectedItem = _item;
    stMap.skills.selectedIndex = _idx;

    eschar.modal.updateSkill();
  };








  createSkill = function (_skill) {
    var newSkill = {};

    newSkill.name = _skill.name;
    newSkill.type = _skill.type;
    newSkill.sortOrder = _skill.sortOrder;
    newSkill.imgOffset = _skill.imgOffset;
    newSkill.imgPath = _skill.imgPath;
    newSkill.groupId = _skill.groupId;
    newSkill.parentId = _skill.parentId;
    newSkill.description = _skill.description;
    newSkill.adds = _skill.adds;
    newSkill.points = _skill.points;

    $http("api/skills")
    .post(newSkill)
    .then(function (_data) {

      newSkill._id = _data.id;

      stMap.skills.collection.push(newSkill);
      buildCatGrpSklTree();
      eschar.catgrp.buildList();
      eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
      eschar.catgrp.selectGroup(stMap.groups.selectedIndex);

      setModalState("ready");
    })
    .catch($httpCallback.error);
  };


  updateSkill = function (_skill) {
    var selSkill = stMap.skills.collection[stMap.skills.selectedIndex];

    $http("api/skills/" + selSkill._id)
        .put(_skill)
        .then(function (_data) {

          selSkill.name = _skill.name;
          selSkill.type = _skill.type;
          selSkill.sortOrder = _skill.sortOrder;
          selSkill.imgOffset = _skill.imgOffset;
          selSkill.imgPath = _skill.imgPath;
          selSkill.groupId = _skill.groupId;
          selSkill.parentId = _skill.parentId;
          selSkill.description = _skill.description;
          selSkill.adds = _skill.adds;
          selSkill.points = _skill.points;

          buildCatGrpSklTree();
          eschar.catgrp.buildList();
          eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
          eschar.catgrp.selectGroup(stMap.groups.selectedIndex);

          setModalState("ready");
        })
        .catch($httpCallback.error);
  };


  deleteSkill = function (_skill) {
    $http("api/skills" + "/" + _skill._id).delete()
      .then(function (_data) {

        // todo: move to callback
        stMap.skills.collection.splice(stMap.skills.selectedIndex, 1);

        // todo: if last skill is deleted move selection up one
        eschar.skill.selectInGroup(0);

        buildCatGrpSklTree();
        eschar.catgrp.buildList();
        eschar.catgrp.selectCategory(stMap.categories.selectedIndex);
        eschar.catgrp.selectGroup(stMap.groups.selectedIndex);

        eschar.modal.confirmSkill();
        setModalState("ready");
      }).catch($httpCallback.error);
  };


  // *********************
  // *********************



  createCharacterSkill = function (_ctrl, _known, _points) {

    var selChar, selSkill, newSkill;

    selChar = stMap.characters.collection[stMap.characters.selectedIndex];
    selSkill = stMap.skills.collection[stMap.skills.selectedIndex];

    newSkill = {}
    newSkill.knowledge = _known;
    newSkill.points = _points;

    $http("api/characters/" + selChar._id + "/skills/" + selSkill._id)
      .post(newSkill)
      .then(function (_char) {
        selChar.skills.push({
          "skillId": selSkill._id,
          "knowledge": newSkill.knowledge,
          "points": newSkill.points
        });
        if (_ctrl === "bar") {
          stMap.skills.selectedItem
            .getElementsByClassName("bar")[0].value
            = newSkill.knowledge;
        }
        stMap.skills.selectedItem
          .getElementsByClassName("build-count")[0].textContent
          = newSkill.points + " / " + selSkill.points;
      })
      .catch($httpCallback.error);
  };


  updateCharacterSkill = function (_ctrl, _known, _points) {

    var selChar, selSkill, deltaSkill;

    selChar = stMap.characters.collection[stMap.characters.selectedIndex];
    selSkill = stMap.skills.collection[stMap.skills.selectedIndex];

    deltaSkill = {};
    deltaSkill.knowledge = _known;
    deltaSkill.points = _points;

    $http("api/characters/" + selChar._id + "/skills/" + selSkill._id)
      .put(deltaSkill)
      .then(function (_char) {
        selChar.skills.every(function (_skill, _idx) {
          if (_skill.skillId === selSkill._id) {
            selChar.skills[_idx].knowledge = deltaSkill.knowledge;
            selChar.skills[_idx].points = deltaSkill.points;
            return false;
          } else {
            return true;
          }
        });
        if (_ctrl === "bar") {
          stMap.skills.selectedItem
            .getElementsByClassName("bar")[0].value
            = deltaSkill.knowledge;
        }
        stMap.skills.selectedItem
          .getElementsByClassName("build-count")[0].textContent
          = deltaSkill.points + " / " + selSkill.points;


        eschar.catgrp.updateGroupCount(
          stMap.groups.selectedItem, deltaSkill.points
        );



      })
      .catch($httpCallback.error);
  };


  buildCharGroupSkills = function () {
    var grpAbilities, grpCount;
    stMap.charGroupSkills = [];

    //flatten _group.skills and push into grpAbilities
    stMap.groups.collection.forEach(function (_group) {
      grpAbilities = [];
      _group.skills.forEach(function (_skill) {
        grpAbilities.push(_skill);
        if (_skill.morphs) {
          if (_skill.morphs[0]) {
            grpAbilities.push(_skill.morphs[0]);
          }
          if (_skill.morphs[1]) {
            grpAbilities.push(_skill.morphs[1]);
          }
        }
      });

      // match character.skill.id to group.ability.id 
      // sum character.skill.points
      grpCount = 0;
      grpAbilities.forEach(function (_ability) {
        getSelectedCharacter().skills.every(function (_charSkill) {
          if (_charSkill.skillId === _ability._id) {
            grpCount += _charSkill.points;
            return false;
          } else {
            return true;
          }
        });
      });

      stMap.charGroupSkills.push({
        "groupId": _group._id,
        "count": grpCount
      });
    });
  };


  getCharacterGroupPoints = function (_groupId) {
    var points = 0;

    stMap.charGroupSkills.every(function (_group) {
      if (_group.groupId === _groupId) {
        points = _group.count;
        return false;
      } else {
        return true;
      }
    });
    return points;
  };

  setCharacterGroupPoints = function (_groupId, _points) {
    stMap.charGroupSkills.every(function (_group, _index) {
      if (_group.groupId === _groupId) {
        stMap.charGroupSkills[_index].count = _points;

        eschar.catgrp.updateGroupCount(_groupId, _points);

        return false;
      } else {
        return true;
      }
    });
  };



  // *********************
  // *********************


  getCatGrpSklTree = function () {
    return stMap.catGrpSklTree;
  };


  buildCatGrpSklTree = function () {
    var groupSkills;

    eschar.catgrp.sort();
    eschar.skill.sort();

    // push categories
    stMap.catGrpSklTree.categories = [];
    stMap.categories.collection.forEach(function (_cat) {
      stMap.catGrpSklTree.categories.push(_cat);
    });

    // push groups into categories
    stMap.catGrpSklTree.categories.forEach(function (_cat) {
      _cat.groups = [];
      stMap.groups.collection.forEach(function (_grp) {
        if (_grp.categoryId === _cat._id) {
          _cat.groups.push(_grp);
        }
      });
    });

    // push base skills into groups
    stMap.catGrpSklTree.categories.forEach(function (_cat) {
      _cat.groups.forEach(function (_grp) {
        _grp.skills = [];
        groupSkills = [];
        stMap.skills.collection.forEach(function (_skl, _sklIdx) {
          if (_skl.groupId === _grp._id) {
            groupSkills.push(_skl);
          }
        });

        // push morphs into base skills
        _grp.skills = groupSkills.filter(function (_skill) {
          if (_skill.groupId === _skill.parentId) {
            return true;
          }
        });
        _grp.skills.forEach(function (_baseSkill) {
          _baseSkill.morphs = [];
          groupSkills.forEach(function (_morphSkill) {
            if (_morphSkill.parentId === _baseSkill._id) {
              _baseSkill.morphs.push(_morphSkill);
            }
          });
        });
      });
    });
  };


  // *********************
  // *********************


  getModalTab = function () {
    return stMap.modal.selectedTab;
  };


  setModalTab = function (_idx) {
    stMap.modal.selectedTab = _idx;
  };


  getModalLock = function () {
    return stMap.modal.locked;
  };


  setModalLock = function (_lock) {
    eschar.modal.setLock(_lock);
    stMap.modal.locked = _lock;
  };


  getModalState = function () {
    return stMap.modal.state;
  };


  setModalState = function (_state) {
    eschar.modal.setState(_state);
    stMap.modal.state = _state;
  };


  // *********************
  // *********************


  resetDynamicStyles = function () {
    [].slice.call(document.styleSheets).forEach(function (_sheet, _idx) {
      if (_sheet.href.includes("dyn")) {
        sheetDyn = document.styleSheets[_idx];
      }
    });
  };


  getDynamicStyles = function () {
    return sheetDyn;
  };


  // *********************
  // *********************


  bindEvents = function () {

    window.addEventListener("resize", function (_event) {
      eschar.modal.resize();
    });

    window.addEventListener("keydown", function (_event) {
      if ((_event.key === "F9")
        || (_event.key === "m" && _event.ctrlKey)
      ) {
        eschar.modal.toggle();
      }
      if ((_event.key === "F10")) {
        console.log("F10 keydown event");
        _event.preventDefault();
      }
    });
    
  };


  // *********************
  // *********************


  initModule = function (_container) {
    _container.innerHTML = cfgMap.main_html;

    eschar.header.initModule(
      document.getElementsByClassName("eschar-chassis-header")[0]
    );
    eschar.catgrp.initModule(
      document.getElementsByClassName("eschar-body-catgrp")[0]
    );
    eschar.skill.initModule(
      document.getElementsByClassName("eschar-body-skill")[0]
    );
    eschar.footer.initModule(
      document.getElementsByClassName("eschar-chassis-footer")[0]
    );
    eschar.modal.initModule(
      document.getElementsByClassName("eschar-chassis-modal")[0]
    );

    Promise.all(
      [
        $http("api/characters").get(),
        $http("api/categories").get(),
        $http("api/groups").get(),
        $http("api/skills").get()
      ]
    ).then(function (_data) {
      stMap.characters.collection = _data[0];
      stMap.categories.collection = _data[1];
      stMap.groups.collection = _data[2];
      stMap.skills.collection = _data[3];

      resetDynamicStyles();
      bindEvents();
      buildCatGrpSklTree();

      eschar.header.buildCharacterList();
      eschar.catgrp.buildList();

      eschar.header.selectCharacter(cfgMap.initial.character);
      eschar.catgrp.selectCategory(cfgMap.initial.category);
      eschar.catgrp.selectGroup(cfgMap.initial.group);

      // TODO: replace with selected group's first skill
      eschar.skill.selectById(cfgMap.initial.skill);

    }).catch(function (_error) {
      console.log("initModule error:", _error);
    });

    return true;
  };


  return {
    "initModule": initModule,
    "getDynamicStyles": getDynamicStyles,

    "getCharacters": getCharacters,
    "getSelectedCharacter": getSelectedCharacter,
    "getCharacterIndex": getCharacterIndex,
    "getCharacterItem": getCharacterItem,
    "setCharacter": setCharacter,
    "getCharacterLock": getCharacterLock,
    "setCharacterLock": setCharacterLock,
    "createCharacter": createCharacter,
    "updateCharacter": updateCharacter,
    "deleteCharacter": deleteCharacter,

    "getCategories": getCategories,
    "getSelectedCategory": getSelectedCategory,
    "getCategoryById": getCategoryById, 
    "getCategoryIndex": getCategoryIndex,
    "getCategoryItem": getCategoryItem,
    "setCategory": setCategory,
    "createCategory": createCategory,
    "updateCategory": updateCategory,
    "deleteCategory": deleteCategory,

    "getGroups": getGroups,
    "getSelectedGroup": getSelectedGroup,
    "getGroupIndex": getGroupIndex,
    "getGroupItem": getGroupItem,
    "getGroupById": getGroupById,
    "setGroup": setGroup,
    "createGroup": createGroup,
    "updateGroup": updateGroup,
    "deleteGroup": deleteGroup,

    "getSkills": getSkills,
    "getSkillsInGroup": getSkillsInGroup,
    "getGroupSkillIndex": getGroupSkillIndex,
    "setGroupSkillIndex": setGroupSkillIndex,
    "getGroupSkillCount": getGroupSkillCount, 
    "getSelectedSkill": getSelectedSkill,
    "getSkillIndex": getSkillIndex,
    "getSkillItem": getSkillItem,
    "getSkillById": getSkillById, 
    "setSkill": setSkill,
    "createSkill": createSkill,
    "updateSkill": updateSkill,
    "deleteSkill": deleteSkill,

    "createCharacterSkill": createCharacterSkill,
    "updateCharacterSkill": updateCharacterSkill,
    "buildCharGroupSkills": buildCharGroupSkills, 
    "getCharacterGroupPoints": getCharacterGroupPoints,
    "setCharacterGroupPoints": setCharacterGroupPoints, 

    "getCatGrpSklTree": getCatGrpSklTree,

    "getModalState": getModalState,
    "setModalState": setModalState,
    "getModalLock": getModalLock,
    "setModalLock": setModalLock,
    "getModalTab": getModalTab,
    "setModalTab": setModalTab

  };

}());

