

eschar.footer = (function () {
  "use strict";

  var
    initModule, setDocMap, setInfo, 
    
    cfgMap = {
      "main_html": String()
      + "<div class='footer-info' id='footer-info-text-one'>"
      + "<span></span>"
      + "</div>"
      + "<div class='footer-info' id='footer-info-text-two'>"
      + "<span></span>"
      + "</div>"
      + "<div class='footer-info' id='footer-info-text-three'>"
      + "<span></span>"
      + "</div>"
      + "<div class='footer-info' id='footer-info-text-four'>"
      + "<span></span>"
      + "</div>"
    },
    
    docMap = {};


  setDocMap = function () {
    docMap.footer = {};
    docMap.footer.one = document.getElementById("footer-info-text-one");
    docMap.footer.two = document.getElementById("footer-info-text-two");
    docMap.footer.three = document.getElementById("footer-info-text-three");
    docMap.footer.four = document.getElementById("footer-info-text-four");
  };


  setInfo = function (_elem, _text) {
    docMap.footer[_elem].textContent = _text;
  };


  initModule = function (_container) {
    _container.innerHTML = cfgMap.main_html;

    setDocMap();

    return true;
  };


  return {
    "initModule": initModule,
    "setInfo": setInfo
  };

}());


//eschar.footer.setInfo("one", "catgrp.handleClick");
//eschar.footer.setInfo(
//  "two", "Skills: "
//  + eschar.chassis.getGroupSkillCount(eschar.chassis.getSelectedGroup())
//);
//eschar.footer.setInfo("three", "First: " + grpAbilities[0].name);
//eschar.footer.setInfo(
//  "four", "Knowledge: "
//  + eschar.chassis.getCharacterGroupPoints(eschar.chassis.getSelectedGroup()._id)
//);




