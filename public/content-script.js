// Content Script for BOSS直聘 page interaction
// 这个脚本在BOSS直聘网站的上下文中运行

console.log('Content script loaded on Zhipin');

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    // 从页面中提取数据
    const pageData = extractPageData();
    sendResponse({ data: pageData });
  }
});

/**
 * 从当前页面提取职位数据
 */
function extractPageData() {
  try {
    const jobs = [];
    
    // 选择所有职位列表项
    const jobElements = document.querySelectorAll('[class*="job-card"], [class*="position"], [class*="job-list"] li');
    
    jobElements.forEach((element) => {
      const job = {
        title: element.querySelector('h2, .position-name, [class*="title"]')?.textContent?.trim() || '',
        company: element.querySelector('.company, [class*="company"]')?.textContent?.trim() || '',
        salary: element.querySelector('.salary, [class*="salary"]')?.textContent?.trim() || '',
        location: element.querySelector('.city, [class*="location"]')?.textContent?.trim() || ''
      };
      
      if (job.title) {
        jobs.push(job);
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error extracting page data:', error);
    return [];
  }
}

// 注入脚本用于访问页面全局变量
function injectScript(source) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = source;
  document.documentElement.appendChild(script);
  script.remove();
}

// 监听页面数据变化（可选）
const pageDataInjection = `
window.recruitmentCollector = {
  getPageData: function() {
    // 这里可以访问页面的全局变量和数据
    return window.__INITIAL_STATE__ || {};
  }
};
`;

injectScript(pageDataInjection);

