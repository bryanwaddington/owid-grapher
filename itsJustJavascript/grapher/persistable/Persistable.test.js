#! /usr/bin/env jest
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Persistable_1 = require("./Persistable");
const mobx_1 = require("mobx");
class GameBoyGameDefaults {
    constructor() {
        this.players = 2;
    }
}
__decorate([
    mobx_1.observable
], GameBoyGameDefaults.prototype, "title", void 0);
__decorate([
    mobx_1.observable
], GameBoyGameDefaults.prototype, "players", void 0);
__decorate([
    mobx_1.observable
], GameBoyGameDefaults.prototype, "relatedGames", void 0);
__decorate([
    mobx_1.observable
], GameBoyGameDefaults.prototype, "characters", void 0);
__decorate([
    mobx_1.observable
], GameBoyGameDefaults.prototype, "mainCharacter", void 0);
class GameBoyGame extends GameBoyGameDefaults {
    constructor(obj) {
        super();
        this.someRuntimeProp = 5;
        if (obj)
            this.updateFromObject(obj);
    }
    updateFromObject(obj) {
        Persistable_1.updatePersistables(this, obj);
        if (obj.mainCharacter)
            this.mainCharacter = new Character(obj.mainCharacter);
        if (obj.relatedGames)
            this.relatedGames = obj.relatedGames.map((config) => new GameBoyGame(config));
    }
    toObject() {
        const obj = Persistable_1.objectWithPersistablesToObject(this);
        return Persistable_1.deleteRuntimeAndUnchangedProps(obj, new GameBoyGame());
    }
}
__decorate([
    mobx_1.observable
], GameBoyGame.prototype, "someRuntimeProp", void 0);
class CharacterDefaults {
    constructor() {
        this.name = "";
        this.country = "";
    }
}
__decorate([
    mobx_1.observable
], CharacterDefaults.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], CharacterDefaults.prototype, "country", void 0);
class Character extends CharacterDefaults {
    constructor(props) {
        super();
        if (props)
            this.updateFromObject(props);
    }
    toObject() {
        const { name, country } = this;
        return {
            name,
            country,
        };
    }
    updateFromObject(obj) {
        this.name = obj.name;
        this.country = obj.country;
    }
}
it("can serialize empty persistables", () => {
    const game = new GameBoyGame();
    expect(game.toObject()).toEqual({});
});
it("can serialize persistables and update them", () => {
    const game = new GameBoyGame({ title: "SurfTime" });
    expect(game.toObject()).toEqual({ title: "SurfTime" });
    game.updateFromObject({ title: "SurfTimePro" });
    expect(game.toObject()).toEqual({ title: "SurfTimePro" });
});
it("does not serialize runtime props", () => {
    const game = new GameBoyGame({ title: "SurfTime" });
    expect(game.toObject().someRuntimeProp).toEqual(undefined);
});
it("can serialize nested persistables", () => {
    const game = new GameBoyGame({
        title: "SurfTime",
        characters: [{ country: "USA", name: "Jill Doe" }],
        mainCharacter: { country: "CAN", name: "Jane Doe" },
    });
    expect(game.mainCharacter instanceof Character).toEqual(true);
});
it("handles missing values", () => {
    expect(Persistable_1.objectWithPersistablesToObject({})).toEqual({});
    expect(Persistable_1.objectWithPersistablesToObject({ foo: undefined })).toEqual({
        foo: undefined,
    });
});
it("can serialize only the desired properties", () => {
    expect(Persistable_1.objectWithPersistablesToObject({ foo: 1, bar: 2 }, ["foo"])).toEqual({
        foo: 1,
    });
});
it("can handle an array of persistables", () => {
    const game = new GameBoyGame({
        title: "SurfTime",
        relatedGames: [new GameBoyGame({ title: "TestGame" })],
    });
    game.updateFromObject({
        title: "SurfTime2",
        relatedGames: [{ title: "TestGame2" }],
    });
    expect(game.relatedGames[0].players).toEqual(2);
});
it("can handle Infinity", () => {
    const game = new GameBoyGame({
        players: Infinity,
    });
    const persisted = Persistable_1.deleteRuntimeAndUnchangedProps(game, new GameBoyGame({ players: -Infinity }));
    expect(persisted).toEqual({ players: Infinity });
});
//# sourceMappingURL=Persistable.test.js.map