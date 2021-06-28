"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideShowController = void 0;
const mobx_1 = require("mobx");
// A "slide" is just a query string.
class SlideShowController {
    constructor(slides = [], currentIndex = 0, manager) {
        this.currentIndex = currentIndex;
        this.slides = slides;
        this.manager = manager;
    }
    get isEmpty() {
        return this.slides.length === 0;
    }
    playIndexCommand(index) {
        const slides = this.slides;
        index = index >= slides.length ? index - slides.length : index;
        index = index < 0 ? slides.length + index : index;
        const slide = slides[index];
        if (this.manager)
            this.manager.setSlide(slide);
    }
    playNext() {
        this.playIndexCommand(++this.currentIndex);
    }
    playPrevious() {
        this.playIndexCommand(--this.currentIndex);
    }
}
__decorate([
    mobx_1.action.bound
], SlideShowController.prototype, "playIndexCommand", null);
__decorate([
    mobx_1.action.bound
], SlideShowController.prototype, "playNext", null);
__decorate([
    mobx_1.action.bound
], SlideShowController.prototype, "playPrevious", null);
exports.SlideShowController = SlideShowController;
//# sourceMappingURL=SlideShowController.js.map