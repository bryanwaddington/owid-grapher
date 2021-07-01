// All of this information is available to the client-side code
// DO NOT retrieve sensitive information from the environment in here! :O
// Settings in here will be made available to the client-side code that is
// bundled and shipped out to our users.

import dotenv from "dotenv"
import findBaseDir from "./findBaseDir"

const baseDir = findBaseDir(__dirname)
if (baseDir) dotenv.config({ path: `${baseDir}/.env` })

import { parseIntOrUndefined } from "../clientUtils/Util"

export const ENV: "development" | "production" =
    process.env.ENV === "production" ? "production" : "development"

export const ADMIN_SERVER_PORT: number =
    parseIntOrUndefined(process.env.PORT) ?? 3030
export const ADMIN_SERVER_HOST: string =
    process.env.BIND_IP ?? "localhost"
export const BAKED_BASE_URL: string =
    process.env.BAKED_BASE_URL ??
    `http://${ADMIN_SERVER_HOST}:${ADMIN_SERVER_PORT}`

// CORE-CHANGE-START
console.log('clientSettings.ts logging');
console.log('ADMIN_SERVER_HOST', ADMIN_SERVER_HOST);
console.log('DMIN_SERVER_PORT', ADMIN_SERVER_PORT);
console.log('ENV', ENV);
console.log('process.env.BIND_IP', process.env.BIND_IP);
console.log('process.env.BAKED_GRAPHER_URL', process.env.BAKED_GRAPHER_URL);
// CORE-CHANGE-END

export const BAKED_GRAPHER_URL: string =
    process.env.BAKED_GRAPHER_URL ?? `${BAKED_BASE_URL}/grapher`
// CORE-CHANGE-START
console.log('clientSettings.ts-BAKED_GRAPHER_URL', BAKED_GRAPHER_URL);
// CORE-CHANGE-END
export const ADMIN_BASE_URL: string =
    process.env.ADMIN_BASE_URL ??
    `http://${ADMIN_SERVER_HOST}:${ADMIN_SERVER_PORT}`
export const WORDPRESS_URL: string = process.env.WORDPRESS_URL ?? ""

export const ALGOLIA_ID: string = process.env.ALGOLIA_ID ?? ""
export const ALGOLIA_SEARCH_KEY: string = process.env.ALGOLIA_SEARCH_KEY ?? ""

export const STRIPE_PUBLIC_KEY: string =
    process.env.STRIPE_PUBLIC_KEY ?? "pk_test_nIHvmH37zsoltpw3xMssPIYq"
export const DONATE_API_URL: string =
    process.env.DONATE_API_URL ?? "http://localhost:9000/donate"

export const RECAPTCHA_SITE_KEY: string =
    process.env.RECAPTCHA_SITE_KEY ?? "6LcJl5YUAAAAAATQ6F4vl9dAWRZeKPBm15MAZj4Q"
