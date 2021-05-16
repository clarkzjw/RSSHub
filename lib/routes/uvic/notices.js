const got = require('../../utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = `https://www.uvic.ca/news/topics/notices/index.php`;
    const response = await got({
        method: 'get',
        url,
    });
    const $ = cheerio.load(response.data);
    const list = $('article[class=feed-item]');
    ctx.state.data = {
        title: `UVic Notices`,
        link: url,
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('h4[class=feed-title]').text(),
                        description: item.find('div[class=feed-content]').text(),
                        pubDate: item.find('article .article-data.feed-data').text(),
                        link: item.find('a[class=feed-link]').attr('href'),
                    };
                })
                .get(),
    };
};
