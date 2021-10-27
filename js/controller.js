/* jshint esversion: 2015 */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
"use strict";

var model = new Plan();  //jshint ignore:line
var view = new View(model);  //jshint ignore:line
var myDB = new LocalStorageSaver();  //jshint ignore:line

function populateCourses(program) {
    let planDiv = document.querySelector(`#plan_${program}`);
    let allTaken = JSON.parse(myDB.storage.getItem("plan")) || {};

    $.getJSON(`courses_${program}.json`, function (courses) {
        for (let c of courses) {
            let buttonRow = document.querySelector(`#lvl${c.level}`);
            let buttonDiv = document.createElement("div");
            buttonDiv.setAttribute("class", "col");

            let newButton = document.createElement("button");
            newButton.type = "button";
            newButton.classList = "btn btn-lg btn-primary";
            newButton.id = `${c.department}${c.number}`;
            newButton.value = `${c.title}`;
            newButton.innerHTML = `<span class="glyphicon glyphicon-ok"></span>${c.title}`;
            newButton.title = `${c.department}${c.number} (${c.title})`;
            if (c.required.indexOf("minor") > -1) {
                let badge = document.createElement("span");
                badge.setAttribute("class", "badge badge-primary");
                badge.innerHTML = "Minor";
                newButton.appendChild(badge);
            }
            if (c.prerequisites.length > 0) {
                newButton.disabled = "disabled";
            }
            newButton.setAttribute("onclick", "takeCourse(this)");

            let newCourse = new Course(c.department, c.number, c.level, c.title, c.duration, c.offered, c.credits, c.prerequisites, c.required.length > 0);
            if (`${c.department}${c.number}` in allTaken) {
                newButton.classList.add("btn-success");
                newCourse.taken = true;
            }
            buttonDiv.appendChild(newButton);
            buttonRow.appendChild(buttonDiv);
            model.addCourse(newCourse);
        }
    });
}

function takeCourse(btn) {
    model.takeCourse(btn.id);
    myDB.storage.setItem("plan", JSON.stringify(Object.fromEntries(Object.entries(model.courses).filter(([k, v]) => v.taken))));
}

function reset() {
    myDB.storage.clear();
    for (let c of Object.keys(model.courses)) {
        model.removeCourse(c);
    }
}

$(document).ready(function () {
    populateCourses("cs");
    // populateCourses("ds");
});
