const got = require('../../utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const dprtmnt = ctx.params.dprtmnt;
    const url = `https://www.canada.ca/en/news/advanced-news-search/news-results.html?dprtmnt=${dprtmnt}`;
    const response = await got({
        method: 'get',
        url,
    });
    const $ = cheerio.load(response.data);
    const list = $('article[class=item]');
    ctx.state.data = {
        title: `News results from ${dprtmnt}`,
        link: url,
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('h3 a').text(),
                        description: item.find('p').text(),
                        link: item.find('h3 a').attr('href'),
                    };
                })
                .get(),
    };
};
