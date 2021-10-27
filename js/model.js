/* jshint esversion: 2015 */
/* jshint node: true */
/* jshint browser: true */
"use strict";

class Course {
    constructor(department, number, level, title, duration, offered, credits, prerequisites, required) {
        this._department = department;
        this._number = number;
        this._level = level;
        this._title = title;
        this._duration = duration;
        this._offered = offered;
        this._credits = credits;
        this._prerequisites = prerequisites;
        this._required = required;

        this._taken = false;
        this._prereqsMet = false;
    }

    get department() {
        return this._department;
    }

    get number() {
        return this._number;
    }

    get taken() {
        return this._taken;
    }

    set taken(newVal) {
        this._taken = newVal;
    }

    get prerequisites() {
        return this._prerequisites;
    }

    get prereqsMet() {
        return this._prereqsMet;
    }

    set prereqsMet(newVal) {
        this._prereqsMet = newVal;
    }

    toString() {
        return `${this._department}${this._number} (${this._title}, ${this._credits}) is a ${this._duration} offered in ${this._offered}`;
    }
}

class Subject {
    constructor() {
        this.handlers = [];
    }

    subscribe(fn) {
        this.handlers.push(fn);
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }

    publish(msg, someObj) {
        var scope = someObj || window;
        for (let fn of this.handlers) {
            fn(scope, msg);
        }
    }
}

class Plan extends Subject {
    constructor() {
        super();
        this._courses = {};
    }
    
    addCourse(newCourse) {
        this._courses[`${newCourse.department}${newCourse.number}`] = newCourse;
        this.updatePrereqs();
        this.publish(`${newCourse.department}${newCourse.number} has been added`, this);
    }

    takeCourse(courseId) {
        this._courses[courseId].taken = !this._courses[courseId].taken;
        this.updatePrereqs();
        this.publish(`${this._courses[courseId].title} has been (un)taken`, this);
    }

    removeCourse(courseId) {
        this._courses[courseId].taken = false;
        this.updatePrereqs();
        this.publish(`${this._courses[courseId].title} has been removed`, this);
    }

    updatePrereqs() {
        for (let c in this._courses) {
            if (this._courses[c].prerequisites.length == 0) {
                this._courses[c].prereqsMet = true;
            } else {
                this._courses[c].prereqsMet = this._courses[c].prerequisites.every(this.checkCourse, this);
            }
        }
    }

    checkCourse(number) {
        for (let c in this._courses) {
            if (this._courses[c].number == number) {
                return this._courses[c].taken;
            }
        }
    }

    get courses() {
        return this._courses;
    }
}

class LocalStorageSaver {
    constructor() {
        this.storage = window.localStorage;
    }
}
