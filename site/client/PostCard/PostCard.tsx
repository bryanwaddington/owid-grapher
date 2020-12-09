import { FullPost } from "db/wpdb"
import React from "react"
import { formatAuthors, formatDate } from "site/server/formatting"

const PostCard = ({ post }: { post: FullPost }) => {
    return (
        <article className="post-card">
            <a href={`/${post.path}`}>
                {post.imageUrl && (
                    <div
                        className="cover-image"
                        style={{
                            backgroundImage: `url(${post.imageUrl})`,
                        }}
                    />
                )}
                <h3>{post.title}</h3>
                {post.subtitle && <h4>{post.subtitle}</h4>}
                <div className="entry-meta">
                    <span className="authors">{`By ${formatAuthors(
                        post.authors
                    )}`}</span>{" "}
                    &mdash; <time>{formatDate(post.date)}</time>
                </div>
            </a>
        </article>
    )
}

export default PostCard
