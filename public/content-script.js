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
 * 使用外部脚本文件注入 - 符合 Manifest V3 的做法
 * 通过 <script> 标签加载外部脚本，避免内联脚本的CSP限制
 */
function injectExternalScript() {
  try {
    // 获取inject.js的URL
    const scriptUrl = chrome.runtime.getURL('inject.js');
    
    // 创建script标签并设置src属性
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.onload = function() {
      console.log('External script injected successfully');
      script.remove();
    };
    script.onerror = function() {
      console.error('Failed to load external script');
      script.remove();
    };
    
    // 插入到页面中
    (document.documentElement || document.head || document.body).appendChild(script);
  } catch (error) {
    console.error('Error injecting external script:', error);
  }
}

// 页面加载完成后注入脚本
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectExternalScript);
} else {
  injectExternalScript();
}


