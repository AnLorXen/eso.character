

eschar.catgrp = (function () {
  "use strict";

  var
    initModule, setDocMap, bindEvents, handleClick, 
    sort, buildList, categoryCount, 
    addCategory, selectCategory, selectCategoryByName, 
    addGroup, selectGroup,
    selectGroupByName, selectGroupByVisibilty, updateGroupCount, 
    
    cfgMap = {
      "main_html": String() 
        + "<ul class='eschar-catgrp-list'></ul>"
    },
    
    docMap = {};


  setDocMap = function () {
    docMap.catgrpList
      = document.getElementsByClassName("eschar-catgrp-list")[0];
  };


  sort = function () {
    var cats, groups;
    cats = eschar.chassis.getCategories();
    cats.sort(function (_a, _b) {
      if (_a.sortOrder > _b.sortOrder) { return 1; }
      if (_a.sortOrder < _b.sortOrder) { return -1; }
      return 0;
    });
    groups = eschar.chassis.getGroups();
    groups.sort(function (_a, _b) {
      if (_a.sortOrder > _b.sortOrder) { return 1; }
      if (_a.sortOrder < _b.sortOrder) { return -1; }
      return 0;
    });
  };


  buildList = function () {
    var selChar, catgrps, catLi, grpLi;

    docMap.catgrpList.innerHTML = "";
    selChar = eschar.chassis.getSelectedCharacter();
    catgrps = eschar.chassis.getCatGrpSklTree();

    eschar.chassis.buildCharGroupSkills();

    catgrps.categories.forEach(function (_cat) {
      categoryCount = 0;
      catLi = addCategory(_cat);
      _cat.groups.forEach(function (_grp) {
        grpLi = addGroup(catLi.lastChild, _grp);
        if (_cat.name === "Class" && _grp.family !== selChar.class) {
          grpLi.classList.add("catgrp-hidden");
        }
        if (_cat.name === "Racial" && _grp.family !== selChar.race) {
          grpLi.classList.add("catgrp-hidden");
        }
      });

      catLi.getElementsByClassName("catgrp-cat-count")[0].textContent
        = categoryCount;
    });
  };


  // *********************
  // *********************


  addCategory = function (_category) {
    var
      eleLi = document.createElement("li"),
      eleIcon = document.createElement("div"), 
      eleCount = document.createElement("div"),
      eleName = document.createElement("span"),
      eleGrpUl = document.createElement("ul");

    eleIcon.classList.add("catgrp-icon");
    eleIcon.style.backgroundImage = "url(../img/categories/"
      + _category.name.toLowerCase().split(" ").join("")
      + "_norm_32.png)";

    eleCount.classList.add("catgrp-cat-count");
    eleCount.textContent = "--";

    eleName.classList.add("catgrp-cat-name");
    eleName.textContent = _category.name;

    eleGrpUl.classList.add("catgrp-closed");
    eleLi.appendChild(eleIcon);
    eleLi.appendChild(eleCount);
    eleLi.appendChild(eleName);
    eleLi.appendChild(eleGrpUl);
    eleLi.classList.add("catgrp-category");
    docMap.catgrpList.appendChild(eleLi);
    return eleLi;
  };


  selectCategory = function (_catIdx) {
    var selCat = eschar.chassis.getCategoryItem();

    if (selCat && selCat.classList.contains("selectedCategory")) {
      selCat.classList.remove("selectedCategory");
      selCat.lastChild.classList.add("catgrp-closed");
    }
    [].slice.call(docMap.catgrpList.childNodes).every(function (_item, _idx) {
      if (_idx === _catIdx) {
        _item.classList.add("selectedCategory");
        _item.lastChild.classList.remove("catgrp-closed");
        eschar.chassis.setCategory(_idx, _item);
        return false;
      } else {
        return true;
      }
    });
  };


  selectCategoryByName = function (_name) {
    [].slice.call(docMap.catgrpList.childNodes).every(function (_item, _idx) {
      if (_item.textContent === _name) {
        selectCategory(_idx);
        return false;
      } else {
        return true;
      }
    });
  };


  // *********************
  // *********************


  addGroup = function (_grpUl, _group) {
    var
      eleLi = document.createElement("li"),
      eleCount = document.createElement("div"), 
      eleName = document.createElement("span"), 
      count = eschar.chassis.getCharacterGroupPoints(_group._id);

    eleCount.classList.add("catgrp-grp-count");
    eleCount.textContent = count;
    categoryCount += count;

    eleName.classList.add("catgrp-grp-name");
    eleName.textContent = _group.name;

    eleLi.appendChild(eleCount);
    eleLi.appendChild(eleName);
    eleLi.classList.add("catgrp-group");
    eleLi.id = _group._id;
    _grpUl.appendChild(eleLi);
    return eleLi;
  };


  selectGroup = function (_grpIdx) {
    var selGroup, groups;

    selGroup = eschar.chassis.getGroupItem();
    if (selGroup && selGroup.classList.contains("selectedGroup")) {
      selGroup.classList.remove("selectedGroup");
    }

    [].slice.call(docMap.catgrpList.childNodes).forEach(
      function (_catItem) {
        groups = eschar.chassis.getGroups();
        [].slice.call(_catItem.lastChild.childNodes).every(
          function (_grpItem, _gIdx) {
            if (_grpItem.id === groups[_grpIdx]._id) {
              _grpItem.classList.add("selectedGroup");
              eschar.chassis.setGroup(_grpItem, _grpIdx);
              return false;
            } else {
              return true;
            }
          }
        );
      }
    );
  };


  selectGroupByName = function (_name) {
    var selGroup = eschar.chassis.getGroupItem();
    if (selGroup && selGroup.classList.contains("selectedGroup")) {
      selGroup.classList.remove("selectedGroup");
    }

    [].slice.call(docMap.catgrpList.childNodes).forEach(
      function (_catItem) {
        [].slice.call(_catItem.lastChild.childNodes).every(
          function (_grpItem, _grpIdx) {
            if (_grpItem.textContent === _name) {
              _grpItem.classList.add("selectedGroup");
              eschar.chassis.setGroup(_grpItem, _grpIdx);
              return false;
            } else {
              return true;
            }
          }
        );
      }
    );
  };


  selectGroupByVisibilty = function () {
    var selCat, selGroup;

    selCat = eschar.chassis.getCategoryItem();
    selGroup = eschar.chassis.getGroupItem();
    if (selGroup && selGroup.classList.contains("selectedGroup")) {
      selGroup.classList.remove("selectedGroup");
    }

    [].slice.call(selCat.lastChild.childNodes).every(
      function (_grpItem, _grpIdx) {
        if (!_grpItem.classList.contains("catgrp-hidden")) {
          _grpItem.classList.add("selectedGroup");
          eschar.chassis.setGroup(_grpItem, _grpIdx);
          return false;
        } else {
          return true;
        }
      }
    );
  };


  updateGroupCount = function (_grpId, _points) {
    var grpLi = document.getElementById(_grpId);
    grpLi.getElementsByClassName("catgrp-grp-count")[0].text = _points;

  };


  // *********************
  // *********************


  handleClick = function (_evt) {
    var srcLi, srcUl;

    // get li and ul of clicked item
    if (_evt.target.localName === "span") {
      srcLi = _evt.target.parentElement;
    } else {
      srcLi = _evt.target;
    }
    srcUl = srcLi.parentElement;

    if (srcUl === this) {
      // handle category select
      [].slice.call(srcUl.childNodes).every(function (_item, _idx) {
        if (_item === srcLi) {
          selectCategory(_idx);
          return false;
        } else {
          return true;
        }
      });
    } else {
      // handle group select
      eschar.chassis.getGroups().every(function (_grp, _idx) {
        if (_grp._id === srcLi.id) {
          selectGroup(_idx);
          return false;
        } else {
          return true;
        }
      });
    }
  };


  bindEvents = function () {
    docMap.catgrpList.addEventListener(
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
    "buildList": buildList,

    "selectCategory": selectCategory,
    "selectCategoryByName": selectCategoryByName,

    "selectGroup": selectGroup,
    "selectGroupByName": selectGroupByName,
    "selectGroupByVisibilty": selectGroupByVisibilty,
    "updateGroupCount": updateGroupCount

  };

}());

