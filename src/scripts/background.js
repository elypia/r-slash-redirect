/*
 * Copyright 2022-2023 Elypia and Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Pattern to match the name of a subreddit.
 * Allow a space to match the omnibox usage.
 */
const subredditPattern = /\br(?:%2F|\/) ?([A-Za-z\d_]{3,21})\b/;

/**
 * Applies to all URL filters.
 *
 * Due to a bug in Firefox, we currently don't limit it to port 80 and 443.
 */
const globalUrlFilter = {
  urlMatches: `=${subredditPattern.source}`,
  schemes: [
    'http',
    'https'
  ]
}

/** Only listen to web navigation to the following URLs. */
const urlFilter = {
  url: [
    {
      hostEquals: 'baidu.com',
      pathEquals: '/s',
      queryContains: 'wd',
      ...globalUrlFilter
    },
    {
      hostEquals: 'bing.com',
      pathEquals: '/search',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostEquals: 'duckduckgo.com',
      pathEquals: '/',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostEquals: 'ecosia.org',
      pathEquals: '/search',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostContains: '.google.',
      pathEquals: '/search',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostEquals: 'onesearch.com',
      pathEquals: '/yhs/search',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostEquals: 'startpage.com',
      pathEquals: '/sp/search',
      queryContains: 'q',
      ...globalUrlFilter
    },
    {
      hostEquals: 'yahoo.com',
      pathEquals: '/search',
      ...globalUrlFilter
    },
    {
      hostContains: '.yandex.',
      pathEquals: '/search',
      queryContains: 'text',
      ...globalUrlFilter
    }
  ]
}

/**
 * @param {string} subreddit Subreddit to open.
 */
function openSubreddit(subreddit) {
  browser.tabs.update({
    url: `https://reddit.com/r/${subreddit}`
  });
}

/**
 * @param {object} details Navigation details.
 */
function onSearchEngineNavigation(details) {
  const url = new URL(details.url);
  const { searchParams } = url;

  for (const searchParamValue of searchParams.values()) {
    const match = searchParamValue.match(subredditPattern);

    if (match === null) {
      continue;
    }

    const subreddit = match[1];
    openSubreddit(subreddit);
  }
}

browser.omnibox.onInputEntered.addListener(openSubreddit);
browser.webNavigation.onBeforeNavigate.addListener(onSearchEngineNavigation, urlFilter);
