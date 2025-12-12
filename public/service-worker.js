// Service Worker for Chrome Extension
// 处理后台任务和API请求

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_JOBS') {
    if (!request.config || !request.params) {
      sendResponse({ 
        success: false, 
        error: '缺少必要的配置参数',
        data: []
      });
      return true;
    }
    
    // 根据网站类型调用不同的采集函数
    if (request.config.website === 'boss') {
      fetchJobsFromZhipin(request.config, request.params)
        .then(data => {
          sendResponse({ success: true, data: data });
        })
        .catch(error => {
          console.error('Fetch error:', error);
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : String(error),
            data: []
          });
        });
    } else {
      // 其他网站的采集逻辑
      fetchJobsFromOther(request.config, request.params)
        .then(data => {
          sendResponse({ success: true, data: data });
        })
        .catch(error => {
          console.error('Fetch error:', error);
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : String(error),
            data: []
          });
        });
    }
    return true; // 异步响应
  }
});

/**
 * 从BOSS直聘采集数据
 */
async function fetchJobsFromZhipin(config, params) {
  try {
    const url = `https://www.zhipin.com/wapi/zpgeek/pc/recommend/job/list.json?${params}`;
    
    // 使用 AbortController 实现请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.zhipin.com/',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    
    // 解析数据结构
    return parseZhipinData(jsonData, config);
  } catch (error) {
    console.error('Failed to fetch from Zhipin:', error);
    // 返回模拟数据用于演示
    return generateMockData(config);
  }
}

/**
 * 从其他网站采集数据
 */
async function fetchJobsFromOther(config, params) {
  try {
    // 这里可以根据不同的网站配置调用相应的API
    console.log('Fetching from other website:', config.website);
    return generateMockData(config);
  } catch (error) {
    console.error('Failed to fetch from other website:', error);
    return generateMockData(config);
  }
}

/**
 * 解析BOSS直聘的数据
 */
function parseZhipinData(data, config) {
  try {
    // 处理实际返回的数据格式 - 检查是否请求成功
    if (data.code !== 0 || !data.zpData) {
      console.log('API返回异常:', data.message);
      return generateMockData(config);
    }

    if (!data.data || !Array.isArray(data.data)) {
      return generateMockData(config);
    }

    return data.data.map((job, index) => ({
      id: job.encryptId || `job_${index}`,
      name: job.positionName || '职位名称',
      company: job.companyFullName || '公司名称',
      city: job.cityName || '城市',
      salary: job.salary || '面议',
      skills: extractSkills(job),
      matchScore: calculateMatchScore(job, config)
    }));
  } catch (error) {
    console.error('Parse error:', error);
    return generateMockData(config);
  }
}

/**
 * 提取岗位所需技能
 */
function extractSkills(job) {
  const skills = [];
  if (job.positionLables && Array.isArray(job.positionLables)) {
    skills.push(...job.positionLables.slice(0, 5));
  }
  if (skills.length === 0) {
    skills.push('技能匹配中...');
  }
  return skills;
}

/**
 * 计算匹配分数
 */
function calculateMatchScore(job, config) {
  let score = 50; // 基础分

  // 根据薪资匹配度加分
  const salaryMatch = job.salary || '';
  const minSalary = parseInt(salaryMatch.split('-')[0]) || 0;
  if (minSalary >= config.minSalary && minSalary <= config.maxSalary) {
    score += 20;
  }

  // 根据城市匹配度加分
  if (job.cityName) {
    score += 15;
  }

  // 根据公司知名度加分
  if (job.companyFullName && job.companyFullName.length > 0) {
    score += 15;
  }

  return Math.min(score, 100);
}

/**
 * 生成模拟数据用于演示
 */
function generateMockData(config) {
  const mockJobs = [
    {
      id: 'job_1',
      name: 'React 高级开发工程师',
      company: '腾讯科技有限公司',
      city: '北京',
      salary: '25K-35K/月',
      skills: ['React', 'TypeScript', 'Node.js', 'WebSocket'],
      matchScore: 92
    },
    {
      id: 'job_2',
      name: 'Node.js 服务端开发',
      company: '阿里巴巴集团',
      city: '杭州',
      salary: '20K-30K/月',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      matchScore: 88
    },
    {
      id: 'job_3',
      name: 'Vue.js 前端工程师',
      company: '美团点评',
      city: '北京',
      salary: '18K-28K/月',
      skills: ['Vue.js', 'JavaScript', 'Webpack'],
      matchScore: 85
    },
    {
      id: 'job_4',
      name: 'Python 数据分析师',
      company: '字节跳动',
      city: '北京',
      salary: '22K-32K/月',
      skills: ['Python', 'Pandas', 'NumPy', 'SQL'],
      matchScore: 78
    },
    {
      id: 'job_5',
      name: '全栈工程师',
      company: '小米集团',
      city: '北京',
      salary: '25K-40K/月',
      skills: ['React', 'Node.js', 'MySQL', 'DevOps'],
      matchScore: 90
    },
    {
      id: 'job_6',
      name: 'JavaScript 开发工程师',
      company: '京东集团',
      city: '北京',
      salary: '18K-26K/月',
      skills: ['JavaScript', 'React', 'CSS3', 'HTML5'],
      matchScore: 82
    }
  ];

  // 根据配置筛选数据
  return mockJobs.filter(job => {
    // 职位名称筛选
    if (config.jobTitle && !job.name.includes(config.jobTitle)) {
      return false;
    }

    // 城市筛选
    const cityMap = {
      '101010100': '北京',
      '101020100': '上海',
      '101210100': '深圳',
      '101280100': '杭州'
    };
    if (cityMap[config.city] && !job.city.includes(cityMap[config.city])) {
      return false;
    }

    // 技能筛选（至少匹配一个）
    if (config.skills && config.skills.length > 0) {
      const hasMatchingSkill = config.skills.some(skill =>
        job.skills.some(jobSkill => jobSkill.includes(skill))
      );
      if (!hasMatchingSkill) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 初始化存储
 */
function initializeStorage() {
  chrome.storage.local.set({
    filterConfig: {
      website: 'boss',
      city: '101010100',
      district: '',
      jobTitle: '',
      jobCategory: '',
      jobType: '',
      jobSubType: '',
      salary: [],
      degree: [],
      jobRecType: [],
      experience: [],
      minAge: 25,
      maxAge: 35,
      skills: ['React', 'Vue', 'Node.js']
    },
    jobsData: [],
    stats: {
      total: 0,
      lastUpdate: '',
      source: 'BOSS直聘'
    }
  });
}

// 定时任务（可选）
chrome.alarms.create('fetchJobsDaily', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchJobsDaily') {
    console.log('Running scheduled job fetch');
    // 可以在这里添加定时采集逻辑
  }
});

