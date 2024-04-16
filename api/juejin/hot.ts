import { Args } from '@/runtime';

interface HotArticles {
    author: {
        avatar: string;
        is_followed: boolean;
        name: string;
        user_id: string;
    };
    author_counter: {
        followee: number;
        follower: number;
        hot_rank: number;
        level: number;
        like: number;
        power: number;
        publish: number;
        view: number;
    };
    content: {
        author_id: string;
        brief: string;
        category_id: string;
        content_id: string;
        ctime: number;
        format: string;
        item_type: number;
        mtime: number;
        status: number;
        tag_ids: Array<string>
        title: string;
    };
    content_counter: {
        collect: number;
        comment_count: number;
        hot_rank: number;
        interact_count: number;
        like: number;
        view: number;

    };
    user_interact: {
        is_follow: boolean;
        is_user_collect: boolean;
        is_user_like: boolean;
    };
}

export interface Input {
    /* The topic text，reserved for future support to filter popular posts using topic in search results. */
    topic?: string;
}

export interface Output {
    hotArticles: Array<HotArticles>;
}

/**
 * Most hot articles on juejin.cn
 */
export async function handler({ input, logger }: Args<Input>): Promise<Output> {
    const url = `https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&count=50&from=0&aid=2608&uuid=7351325086337517095&spider=0`;

    const result: {
        data: Array<HotArticles>
    } = await fetch(url)
        .then(res => res.json())
        .catch(logger.error)

    console.log(result.data[0].author.is_followed);

    return {
        hotArticles: result.data,
    };
}
