/**
 * 页面注入脚本
 * 这个脚本会被注入到页面上下文中，用于访问页面的全局变量
 */

(function() {
  try {
    // 定义全局对象供content script访问
    window.recruitmentCollector = {
      getPageData: function() {
        // 访问页面的全局变量和数据
        return window.__INITIAL_STATE__ || {};
      },
      getPageUrl: function() {
        return window.location.href;
      },
      getPageTitle: function() {
        return document.title;
      },
      /**
       * 获取页面中所有职位数据
       */
      getJobsFromPage: function() {
        const jobs = [];
        const jobElements = document.querySelectorAll(
          '[class*="job-card"], [class*="position"], [class*="job-list"] li, .job-item, .job-list-item'
        );
        
        jobElements.forEach((element, index) => {
          try {
            const job = {
              id: `page_${index}`,
              title: element.querySelector('h2, .position-name, [class*="title"]')?.textContent?.trim() || '',
              company: element.querySelector('.company, [class*="company"]')?.textContent?.trim() || '',
              salary: element.querySelector('.salary, [class*="salary"]')?.textContent?.trim() || '',
              location: element.querySelector('.city, [class*="location"]')?.textContent?.trim() || ''
            };
            
            if (job.title) {
              jobs.push(job);
            }
          } catch (error) {
            console.error('Error processing job element:', error);
          }
        });
        
        return jobs;
      },
      /**
       * 获取页面中的职位列表信息
       */
      getJobListInfo: function() {
        return {
          totalCount: document.querySelectorAll('[class*="job-item"]').length,
          pageTitle: document.title,
          pageUrl: window.location.href,
          timestamp: new Date().toISOString()
        };
      }
    };
    
    console.log('recruitmentCollector object injected successfully');
  } catch (error) {
    console.error('Error in page injection:', error);
  }
})();

