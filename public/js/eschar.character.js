

eschar.character = (function () {
  "use strict";

  var
    initModule, setDocMap, bindEvents, handleClick,
    addItem, removeItem, sort, select, selectByName, 
    buildList, updateList,


    cfgMap = {
      "main_html": String()
        + "<ul class='eschar-character-list'></ul>"
    },

    docMap = {};


  setDocMap = function () {
    docMap.charList
      = document.getElementsByClassName("eschar-character-list")[0];
  };


  sort = function () {
    var chars = eschar.chassis.getCharacters();
    chars.sort(function (_a, _b) {
      if (_a.sortOrder > _b.sortOrder) { return 1; }
      if (_a.sortOrder < _b.sortOrder) { return -1; }
      return 0;
    });
  };


  addItem = function (_char) {
    var
      eleLi = document.createElement("li"),
      eleSpan = document.createElement("span");
    eleLi.title = _char.race + " " + _char.class;
    eleSpan.textContent = _char.name;
    eleLi.appendChild(eleSpan);
    docMap.charList.appendChild(eleLi);
  };

  removeItem = function (_charIdx) {
    var currCharIdx;
    [].slice.call(docMap.charList.childNodes).every(function (_item, _idx) {
      if (_idx === _charIdx) {
        _item.remove();
        return false;
      } else {
        return true;
      }
    });
    currCharIdx = eschar.chassis.getCharacterIndex();
    if (currCharIdx === docMap.charList.childNodes.length) {
      select(currCharIdx - 1);
    }

    //if (stMap.chars.selectedIndex === docMap.charList.childNodes.length) {
    //  selectCharacter(stMap.chars.selectedIndex - 1);
    //}
    //[].slice.call(docMap.charList.childNodes).forEach(function (_item, _idx) {
    //  if (_idx === _charIdx) {
    //    _item.remove();
    //  }
    //});
    //if (stMap.chars.selectedIndex === docMap.charList.childNodes.length) {
    //  selectCharacter(stMap.chars.selectedIndex - 1);
    //}
  };

  buildList = function () {
    docMap.charList.innerHTML = "";
    sort();
    eschar.chassis.getCharacters().forEach(function (_char) {
      addItem(_char);
    });
  };

  updateList = function () {
    var chars;

    chars = eschar.chassis.getCharacters();
    [].slice.call(docMap.charList.childNodes).forEach(function (_item, _idx) {
      _item.firstChild.textContent = chars[_idx].name;
      _item.title = chars[_idx].race + " " + chars[_idx].class;
    });

    //  [].slice.call(docMap.charList.childNodes).forEach(function (_item, _idx) {
    //    _item.firstChild.textContent = stMap.chars.collection[_idx].name;
    //    _item.title = stMap.chars.collection[_idx].race
    //      + " " + stMap.chars.collection[_idx].class;
    //  });
    //  //updateGroupList();
  };

  select = function (_charIdx) {
    var eleChar = eschar.chassis.getCharacterItem();

    if (eleChar && eleChar.classList.contains("selectedName")) {
      eleChar.classList.remove("selectedName");
    }
    [].slice.call(docMap.charList.childNodes)
      .every(function (_item, _idx) {
        if (_idx === _charIdx) {
          _item.classList.add("selectedName");
          eschar.chassis.setCharacter(_item, _idx);
          return false;
        } else {
          return true;
        }
      });
  };


  selectByName = function (_name) {
    [].slice.call(docMap.charList.childNodes).every(function (_item, _idx) {
      if (_item.textContent === _name) {
        if (_idx !== eschar.chassis.getCharacterIndex()) {
          select(_idx);
        }
        return false;
      } else {
        return true;
      }
    });
  };


  handleClick = function (_evt) {
    [].slice.call(docMap.charList.childNodes).every(function (_item, _idx) {
      if (_item === _evt.target || _item === _evt.target.parentElement) {
        if (_idx !== eschar.chassis.getCharacterIndex()) {
          select(_idx);
        }
        return false;
      } else {
        return true;
      }
    });
  };





  //removeCharListItem = function (_charIdx) {
  //  [].slice.call(docMap.charList.childNodes).forEach(function (_item, _idx) {
  //    if (_idx === _charIdx) {
  //      _item.remove();
  //    }
  //  });
  //  if (stMap.chars.selectedIndex === docMap.charList.childNodes.length) {
  //    selectCharacter(stMap.chars.selectedIndex - 1);
  //  }
  //};

  //updateCharList = function () {
  //  [].slice.call(docMap.charList.childNodes).forEach(function (_item, _idx) {
  //    _item.firstChild.textContent = stMap.chars.collection[_idx].name;
  //    _item.title = stMap.chars.collection[_idx].race
  //      + " " + stMap.chars.collection[_idx].class;
  //  });
  //  //updateGroupList();
  //};



  bindEvents = function () {
    docMap.charList.addEventListener(
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

    "buildList": buildList,
    "select": select,
    "selectByName": selectByName, 
    "sort": sort

  };

}());

