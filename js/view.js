/* jshint esversion: 2015 */
/* jshint node: true */
/* jshint browser: true */
"use strict";

class View {
    constructor(model) {
        model.subscribe(this.redrawPlan.bind(this));
    }

    redrawPlan(plan, msg) {
        for (let courseid of Object.keys(plan.courses)) {
            let buttonEl = document.querySelector(`#${courseid}`);
            if (plan.courses[courseid].taken) {
                buttonEl.classList.add("btn-success");
            } else {
                buttonEl.classList.remove("btn-success");
            }
            if (plan.courses[courseid].prereqsMet) {
                buttonEl.removeAttribute("disabled");
            } else {
                buttonEl.classList.remove("btn-success");
                buttonEl.setAttribute("disabled", "disabled");
            }
        }
    }
}
