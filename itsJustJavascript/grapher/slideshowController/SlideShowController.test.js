#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlideShowController_1 = require("./SlideShowController");
it("can create a new slideshow", () => {
    let newSlide = "";
    const setSlide = (slide) => (newSlide = slide);
    const slideShow = new SlideShowController_1.SlideShowController(["red", "blue"], 0, { setSlide });
    expect(newSlide).toEqual("");
    expect(slideShow.isEmpty).toEqual(false);
    slideShow.playNext();
    expect(newSlide).toEqual("blue");
    slideShow.playPrevious();
    expect(newSlide).toEqual("red");
    slideShow.playPrevious();
    expect(newSlide).toEqual("blue");
});
//# sourceMappingURL=SlideShowController.test.js.map