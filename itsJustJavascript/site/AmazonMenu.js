"use strict";
// This is a port of a jQuery library:
// https://github.com/kamens/jQuery-menu-aim
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonMenu = void 0;
const React = __importStar(require("react"));
const decko_1 = require("decko");
const Util_1 = require("../clientUtils/Util");
const ATTRIBUTE = "data-submenu-id";
const MOUSE_LOCS_TRACKED = 3;
const DELAY = 400;
const TOLERANCE_PX = 20;
const getSubmenuId = (targetEl) => {
    const listItem = Util_1.findDOMParent(targetEl, (el) => el.matches(`[${ATTRIBUTE}]`));
    return listItem ? listItem.getAttribute(ATTRIBUTE) : null;
};
const slope = (a, b) => (b.y - a.y) / (b.x - a.x);
class AmazonMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.container = React.createRef();
        this.mouseLocs = [];
    }
    onMouseMove(event) {
        this.mouseLocs.push({
            x: event.pageX,
            y: event.pageY,
        });
        if (this.mouseLocs.length > MOUSE_LOCS_TRACKED)
            this.mouseLocs.shift();
    }
    onMouseLeaveMenu() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    onMouseEnterItem(submenuId) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.possiblyActivate(submenuId);
    }
    onClickItem(submenuId) {
        this.activate(submenuId);
    }
    possiblyActivate(submenuId) {
        const delay = this.activationDelay();
        if (delay) {
            this.timeoutId = window.setTimeout(() => {
                this.possiblyActivate(submenuId);
            }, delay);
        }
        else {
            this.activate(submenuId);
        }
    }
    activate(submenuId) {
        if (submenuId === this.activeSubmenuId) {
            return;
        }
        if (this.activeSubmenuId) {
            this.deactivate(this.activeSubmenuId);
        }
        if (this.props.onActivate)
            this.props.onActivate(submenuId);
        this.activeSubmenuId = submenuId;
    }
    deactivate(submenuId) {
        if (this.props.onDeactivate)
            this.props.onDeactivate(submenuId);
        this.activeSubmenuId = undefined;
    }
    activationDelay() {
        const { submenuRect } = this.props;
        if (!submenuRect) {
            // If there is no other submenu row already active, then
            // go ahead and activate immediately.
            return 0;
        }
        const upperLeft = {
            x: submenuRect.left,
            y: submenuRect.top - TOLERANCE_PX,
        };
        const upperRight = {
            x: submenuRect.right,
            y: upperLeft.y,
        };
        const lowerLeft = {
            x: submenuRect.left,
            y: submenuRect.bottom + TOLERANCE_PX,
        };
        const lowerRight = {
            x: submenuRect.right,
            y: lowerLeft.y,
        };
        const loc = this.mouseLocs[this.mouseLocs.length - 1];
        let prevLoc = this.mouseLocs[0];
        if (!loc) {
            return 0;
        }
        if (!prevLoc) {
            prevLoc = loc;
        }
        // if (prevLoc.x < submenuRect.left || prevLoc.x > lowerRight.x || prevLoc.y < submenuRect.top || prevLoc.y > lowerRight.y) {
        //     // If the previous mouse location was outside of the entire
        //     // menu's bounds, immediately activate.
        //     return 0
        // }
        if (this.lastDelayLoc &&
            loc.x === this.lastDelayLoc.x &&
            loc.y === this.lastDelayLoc.y) {
            // If the mouse hasn't moved since the last time we checked
            // for activation status, immediately activate.
            return 0;
        }
        // Detect if the user is moving towards the currently activated
        // submenu.
        //
        // If the mouse is heading relatively clearly towards
        // the submenu's content, we should wait and give the user more
        // time before activating a new row. If the mouse is heading
        // elsewhere, we can immediately activate a new row.
        //
        // We detect this by calculating the slope formed between the
        // current mouse location and the upper/lower right points of
        // the menu. We do the same for the previous mouse location.
        // If the current mouse location's slopes are
        // increasing/decreasing appropriately compared to the
        // previous's, we know the user is moving toward the submenu.
        //
        // Note that since the y-axis increases as the cursor moves
        // down the screen, we are looking for the slope between the
        // cursor and the upper right corner to decrease over time, not
        // increase (somewhat counterintuitively).
        const decreasingCorner = upperLeft;
        const increasingCorner = lowerLeft;
        const decreasingSlope = slope(loc, decreasingCorner);
        const increasingSlope = slope(loc, increasingCorner);
        const prevDecreasingSlope = slope(prevLoc, decreasingCorner);
        const prevIncreasingSlope = slope(prevLoc, increasingCorner);
        if (decreasingSlope < prevDecreasingSlope &&
            increasingSlope > prevIncreasingSlope) {
            // Mouse is moving from previous location towards the
            // currently activated submenu. Delay before activating a
            // new menu row, because user may be moving into submenu.
            this.lastDelayLoc = loc;
            return DELAY;
        }
        this.lastDelayLoc = undefined;
        return 0;
    }
    onMouseOver(event) {
        const submenuId = getSubmenuId(event.target);
        if (submenuId) {
            this.onMouseEnterItem(submenuId);
        }
    }
    onClick(event) {
        const submenuId = getSubmenuId(event.target);
        if (submenuId) {
            this.onClickItem(submenuId);
        }
    }
    render() {
        return (React.createElement("div", { ref: this.container, className: "amazon-menu-container", onMouseMove: this.onMouseMove, onMouseLeave: this.onMouseLeaveMenu, onMouseOver: this.onMouseOver, onClick: this.onClick }, this.props.children));
    }
}
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onMouseMove", null);
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onMouseLeaveMenu", null);
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onMouseEnterItem", null);
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onClickItem", null);
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onMouseOver", null);
__decorate([
    decko_1.bind
], AmazonMenu.prototype, "onClick", null);
exports.AmazonMenu = AmazonMenu;
//# sourceMappingURL=AmazonMenu.js.map