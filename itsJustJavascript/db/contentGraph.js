"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentGraph = exports.getGrapherSlugs = exports.GraphType = void 0;
const owidTypes_1 = require("../clientUtils/owidTypes");
const Util_1 = require("../clientUtils/Util");
const wpdb_1 = require("./wpdb");
const fortune = require("fortune"); // Works in web browsers, too.
const MemoryAdapter = require("fortune/lib/adapter/adapters/memory");
const { errors: { ConflictError }, } = fortune;
var GraphType;
(function (GraphType) {
    GraphType["Document"] = "document";
    GraphType["Chart"] = "chart";
})(GraphType = exports.GraphType || (exports.GraphType = {}));
const store = fortune({
    [GraphType.Document]: {
        title: String,
        slug: String,
        data: [Array("chart"), "research"],
    },
    [GraphType.Chart]: {
        research: [Array("document"), "data"],
    },
}, {
    adapter: [
        MemoryAdapter,
        {
            // see https://github.com/fortunejs/fortune/commit/70593721efae304ff2db40d1b8f9b43295fed79b#diff-ebb028a2d1528eac83ee833036ef6e50bed6fb7b2b7137f59ac1fb567a5e6ec2R25
            recordsPerType: Infinity,
        },
    ],
});
const getGrapherSlugs = (content) => {
    const slugs = new Set();
    if (!content)
        return slugs;
    const matches = content.matchAll(/\/grapher\/([a-zA-Z0-9-]+)/g);
    for (const match of matches) {
        slugs.add(match[1]);
    }
    return slugs;
};
exports.getGrapherSlugs = getGrapherSlugs;
exports.getContentGraph = Util_1.once(() => __awaiter(void 0, void 0, void 0, function* () {
    const orderBy = "orderby:{field:MODIFIED, order:DESC}";
    const entries = yield wpdb_1.getDocumentsInfo(owidTypes_1.WP_PostType.Page, "", `categoryId: ${wpdb_1.ENTRIES_CATEGORY_ID}, ${orderBy}`);
    const posts = yield wpdb_1.getDocumentsInfo(owidTypes_1.WP_PostType.Post, "", orderBy);
    const documents = [...entries, ...posts];
    for (const document of documents) {
        // Add posts and entries to the content graph
        try {
            yield store.create(GraphType.Document, {
                id: document.id,
                title: document.title,
                slug: document.slug,
            });
        }
        catch (err) {
            // There shouldn't be any ConflictErrors here as the posts are
            // unique in the list we're iterating on, and the call to generate
            // the graph is memoized.
            throw err;
        }
        // Add charts within that post to the content graph
        const grapherSlugs = exports.getGrapherSlugs(document.content);
        for (const slug of grapherSlugs) {
            try {
                yield store.create(GraphType.Chart, {
                    id: slug,
                    research: [document.id],
                });
            }
            catch (err) {
                // ConflictErrors occur when attempting to create a chart that
                // already exists
                if (!(err instanceof ConflictError)) {
                    throw err;
                }
                try {
                    yield store.update(GraphType.Chart, {
                        id: slug,
                        push: { research: document.id },
                    });
                }
                catch (err) {
                    // ConflictErrors occur here when a chart <-> post
                    // relationship already exists
                    if (!(err instanceof ConflictError)) {
                        throw err;
                    }
                }
            }
        }
    }
    return store;
}));
//# sourceMappingURL=contentGraph.js.map