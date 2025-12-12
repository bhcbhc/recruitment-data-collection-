// Content Script for BOSS直聘 page interaction
// 这个脚本在BOSS直聘网站的上下文中运行

console.log('Content script loaded on Zhipin');

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    try {
      // 从页面中提取数据
      const pageData = extractPageData();
      sendResponse({ success: true, data: pageData });
    } catch (error) {
      console.error('Error in GET_PAGE_DATA:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : String(error), data: [] });
    }
    return true; // 异步响应
  }
});

/**
 * 从当前页面提取职位数据
 */
function extractPageData() {
  try {
    const jobs = [];
    
    // 选择所有职位列表项 - 改进选择器
    const jobElements = document.querySelectorAll(
      '[class*="job-card"], [class*="position"], [class*="job-list"] li, .job-item, .job-list-item'
    );
    
    if (jobElements.length === 0) {
      console.warn('No job elements found on the page');
    }
    
    jobElements.forEach((element, index) => {
      try {
        const job = {
          id: `page_${index}`,
          title: element.querySelector('h2, .position-name, [class*="title"]')?.textContent?.trim() || '',
          company: element.querySelector('.company, [class*="company"]')?.textContent?.trim() || '',
          salary: element.querySelector('.salary, [class*="salary"]')?.textContent?.trim() || '',
          location: element.querySelector('.city, [class*="location"]')?.textContent?.trim() || ''
        };
        
        // 只添加有标题的职位信息
        if (job.title) {
          jobs.push(job);
        }
      } catch (elementError) {
        console.error('Error processing job element:', elementError);
      }
    });
    
    console.log(`Extracted ${jobs.length} jobs from page`);
    return jobs;
  } catch (error) {
    console.error('Error extracting page data:', error);
    return [];
  }
}

/**
 * 注入脚本用于访问页面全局变量
 */
function injectScript(source) {
  try {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = source;
    (document.documentElement || document.head || document.body).appendChild(script);
    script.remove();
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}

/**
 * 页面数据注入 - 用于访问页面的全局状态
 */
const pageDataInjection = `
window.recruitmentCollector = {
  getPageData: function() {
    // 这里可以访问页面的全局变量和数据
    return window.__INITIAL_STATE__ || {};
  },
  getPageUrl: function() {
    return window.location.href;
  },
  getPageTitle: function() {
    return document.title;
  }
};
console.log('Page data injection completed');
`;

try {
  injectScript(pageDataInjection);
} catch (error) {
  console.error('Error setting up page data injection:', error);
}


