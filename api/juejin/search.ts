import { Args } from '@/runtime';

export interface Input {
  /* The topic text to search */
  topic: string;
}

export interface Output {
  searchResults: Array<{
    /** digest of the content */
    brief: string;
    cover_image: string;
    link_url: string;
    title: string;
  }>;
}

/**
  * Search top articles for specific topic on juejin.cn 指定主题搜索掘金（juejin.cn）上的热门文章
  */
export async function handler({ input, logger }: Args<Input>): Promise<Output> {
  const query = input.topic;
  const searchURL = `https://api.juejin.cn/search_api/v1/search?aid=2608&uuid=7351325086337517095&spider=0&query=${query}&id_type=0&cursor=0&limit=20&search_type=0&sort_type=0&version=1`

  const result = await fetch(searchURL)
    .then(res => res.json())
    .catch(logger.error)

  if (result.data) {
    const searchResults = result.data.map(d => {
      const articleId = d.result_model.article_id;
      const article = d.result_model.article_info;

      const link_url = `https://juejin.cn/post/${articleId}`;

      if (!article?.brief_content) {
        logger.warn('Invalid article data:', article);
        return null;
      }

      return {
        brief: article.brief_content,
        cover_image: article.cover_image,
        title: article.title,
        link_url
      }
    }).filter(i => i !== null);

    return {
      searchResults
    }
  }

  return {
    searchResults: []
  }
};