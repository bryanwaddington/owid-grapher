"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithCredentials = exports.authMiddleware = exports.logOut = exports.authCloudflareSSOMiddleware = void 0;
const crypto = __importStar(require("crypto"));
const randomstring = __importStar(require("randomstring"));
const User_1 = require("../db/model/User");
const db = __importStar(require("../db/db"));
const serverSettings_1 = require("../settings/serverSettings");
const hashers_1 = require("../db/hashers");
const node_fetch_1 = __importDefault(require("node-fetch"));
const jsonwebtoken_1 = require("jsonwebtoken");
const serverSettings_2 = require("../settings/serverSettings");
const owidTypes_1 = require("../clientUtils/owidTypes");
const CLOUDFLARE_COOKIE_NAME = "CF_Authorization";
/*
 * See authentication.php for detailed descriptions.
 */
function authCloudflareSSOMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = req.cookies[CLOUDFLARE_COOKIE_NAME];
        if (!jwt)
            return next();
        const audTag = serverSettings_1.CLOUDFLARE_AUD;
        if (!audTag) {
            console.error("Missing or empty audience tag. Please add CLOUDFLARE_AUD key in settings.");
            return next();
        }
        // Get the Cloudflare public key
        const certsUrl = "https://owid.cloudflareaccess.com/cdn-cgi/access/certs";
        const response = yield node_fetch_1.default(certsUrl);
        const certs = yield response.json();
        const publicCerts = certs.public_certs;
        if (!publicCerts) {
            console.error("Missing public certificates from Cloudflare.");
            return next();
        }
        // Verify the JWT token
        let certVerificationErr;
        let payload;
        const verified = publicCerts.some((certObj) => {
            try {
                payload = jsonwebtoken_1.verify(jwt, certObj.cert, {
                    audience: audTag,
                    algorithms: ["RS256"],
                });
                return true;
            }
            catch (err) {
                certVerificationErr = err;
            }
            return false;
        });
        if (!verified) {
            // Authorization token invalid: verification failed, token expired or wrong audience.
            console.error(certVerificationErr);
            return next();
        }
        if (!payload.email) {
            console.error("Missing email in JWT claims.");
            return next();
        }
        const user = yield User_1.User.findOne({ email: payload.email });
        if (!user)
            return next("User not found. Please contact an administrator.");
        // Authenticate as the user stored in the token
        const { id: sessionId } = yield logInAsUser(user);
        res.cookie("sessionid", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            secure: serverSettings_2.ENV === "production",
        });
        // Prevents redirect to external URLs
        let redirectTo = "/admin";
        if (req.query.next) {
            try {
                redirectTo = new URL(req.query.next, serverSettings_2.ADMIN_BASE_URL).pathname;
            }
            catch (err) {
                console.error(err);
            }
        }
        return res.redirect(redirectTo);
    });
}
exports.authCloudflareSSOMiddleware = authCloudflareSSOMiddleware;
function logOut(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.user)
            yield db.queryMysql(`DELETE FROM sessions WHERE session_key = ?`, [
                res.locals.session.id,
            ]);
        res.clearCookie("sessionid");
        res.clearCookie(CLOUDFLARE_COOKIE_NAME);
        return res.redirect("/admin");
    });
}
exports.logOut = logOut;
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        let session;
        const sessionid = req.cookies["sessionid"];
        if (sessionid) {
            // Expire old sessions
            yield db.execute("DELETE FROM sessions WHERE expire_date < NOW()");
            const rows = yield db.queryMysql(`SELECT * FROM sessions WHERE session_key = ?`, [sessionid]);
            if (rows.length) {
                const sessionData = Buffer.from(rows[0].session_data, "base64").toString("utf8");
                const sessionJson = JSON.parse(sessionData.split(":").slice(1).join(":"));
                user = yield User_1.User.findOne({ email: sessionJson.user_email });
                if (!user)
                    throw new owidTypes_1.JsonError("Invalid session (no such user)", 500);
                session = { id: sessionid, expiryDate: rows[0].expiry_date };
                // Don't await this
                user.lastSeen = new Date();
                user.save();
            }
        }
        // Authed urls shouldn't be cached
        res.set("Cache-Control", "public, max-age=0, must-revalidate");
        if (user && user.isActive) {
            res.locals.session = session;
            res.locals.user = user;
            return next();
        }
        else if (!req.path.startsWith("/admin") ||
            req.path === "/admin/login" ||
            req.path === "/admin/register")
            return next();
        return res.redirect(`/admin/login?next=${encodeURIComponent(req.url)}`);
    });
}
exports.authMiddleware = authMiddleware;
function saltedHmac(salt, value) {
    const hmac = crypto.createHmac("sha1", salt + serverSettings_1.SECRET_KEY);
    hmac.update(value);
    return hmac.digest("hex");
}
function logInAsUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionId = randomstring.generate();
        const sessionJson = JSON.stringify({
            user_email: user.email,
        });
        const sessionHash = saltedHmac("django.contrib.sessions.SessionStore", sessionJson);
        const sessionData = Buffer.from(`${sessionHash}:${sessionJson}`).toString("base64");
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 1000 * serverSettings_1.SESSION_COOKIE_AGE);
        yield db.execute(`INSERT INTO sessions (session_key, session_data, expire_date) VALUES (?, ?, ?)`, [sessionId, sessionData, expiryDate]);
        user.lastLogin = now;
        yield user.save();
        return { id: sessionId, expiryDate: expiryDate };
    });
}
function logInWithCredentials(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findOne({ email: email });
        if (!user)
            throw new Error("No such user");
        const hasher = new hashers_1.BCryptHasher();
        if (yield hasher.verify(password, user.password))
            // Login successful
            return logInAsUser(user);
        throw new Error("Invalid password");
    });
}
exports.logInWithCredentials = logInWithCredentials;
//# sourceMappingURL=authentication.js.map