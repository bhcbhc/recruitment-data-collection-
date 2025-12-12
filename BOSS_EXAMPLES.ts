/**
 * BOSS直聘筛选配置示例 - 已更新
 * 
 * 变更说明：
 * 1. 新增工作经验参数 (experience)
 * 2. 移除薪资范围滑块 (minSalary, maxSalary) - 改用salary多选
 * 3. 保留年龄范围 (minAge, maxAge)
 */

// 示例1：搜索北京3-5年经验的Java开发工程师
// 薪资20-50K，本科及以上，全职
export const exampleConfig1 = {
  website: 'boss',
  city: '101010100',              // 北京
  district: '',
  jobTitle: '',
  jobCategory: '1010000',         // 互联网/AI
  jobType: '1000020',             // 后端开发
  jobSubType: '100101',           // Java
  salary: ['406'],                // 20-50K
  degree: ['203', '204', '205'],  // 本科、硕士、博士
  jobRecType: ['1901'],           // 全职
  experience: ['105'],            // 3-5年
  minAge: 25,
  maxAge: 40,
  skills: ['Java', 'Spring', 'MySQL']
};

// 示例2：搜索上海应届/在校前端开发工程师
// 薪资5-15K，大专及以上，全职+兼职
export const exampleConfig2 = {
  website: 'boss',
  city: '101020100',              // 上海
  district: '',
  jobTitle: '',
  jobCategory: '1010000',         // 互联网/AI
  jobType: '1000030',             // 前端/移动开发
  jobSubType: '100901',           // 前端开发工程师
  salary: ['403', '404'],         // 3-10K
  degree: ['202', '203'],         // 大专、本科
  jobRecType: ['1901', '1903'],   // 全职、兼职
  experience: ['102', '108'],     // 应届生、在校生
  minAge: 22,
  maxAge: 28,
  skills: ['React', 'Vue', 'JavaScript']
};

// 示例3：搜索深圳5-10年经验的数据分析师
// 薪资15-50K，本科及以上，全职
export const exampleConfig3 = {
  website: 'boss',
  city: '101210100',              // 深圳
  district: '',
  jobTitle: '',
  jobCategory: '1010000',         // 互联网/AI
  jobType: '1000060',             // 数据
  jobSubType: '100511',           // 数据分析师
  salary: ['405', '406'],         // 10-50K
  degree: ['203', '204'],         // 本科、硕士
  jobRecType: ['1901'],           // 全职
  experience: ['106'],            // 5-10年
  minAge: 28,
  maxAge: 38,
  skills: ['Python', 'SQL', 'Tableau']
};

// 示例4：经验不限的技术岗位
export const exampleConfig4 = {
  website: 'boss',
  city: '100010000',              // 全国
  district: '',
  jobTitle: '技术岗',
  jobCategory: '',                // 不限制
  jobType: '',                    // 不限制
  jobSubType: '',                 // 不限制
  salary: ['404', '405', '406'],  // 5K-50K
  degree: ['203', '204', '205'],  // 本科及以上
  jobRecType: ['1901'],           // 全职
  experience: ['101'],            // 经验不限
  minAge: 22,
  maxAge: 45,
  skills: []
};

// 示例5：高级技术岗 - 10年以上经验
export const exampleConfig5 = {
  website: 'boss',
  city: '101010100',              // 北京
  district: '',
  jobTitle: '',
  jobCategory: '1010000',         // 互联网/AI
  jobType: '1000120',             // 高端技术职位
  jobSubType: '100704',           // 架构师
  salary: ['406', '407'],         // 20K以上
  degree: ['204', '205'],         // 硕士、博士
  jobRecType: ['1901'],           // 全职
  experience: ['107'],            // 10年以上
  minAge: 35,
  maxAge: 55,
  skills: ['架构设计', '团队管理', '系统设计']
};

/**
 * 对应的API请求参数
 */

// 示例1的请求参数
export const apiParams1 = {
  page: '1',
  pageSize: '15',
  city: '101010100',
  encryptExpectId: '',
  mixExpectType: '',
  expectInfo: '',
  expectId: '100101',             // Java
  salary: '406',                  // 20-50K
  degree: '203,204,205',          // 本科、硕士、博士
  jobType: '1901',                // 全职
  experience: '105',              // 3-5年
  _: '1723456789000'
};

// 完整URL示例
export const apiUrl1 = `https://www.zhipin.com/wapi/zpgeek/pc/recommend/job/list.json?page=1&pageSize=15&city=101010100&encryptExpectId=&mixExpectType=&expectInfo=&expectId=100101&salary=406&degree=203,204,205&jobType=1901&experience=105&_=1723456789000`;

// 示例2的请求参数
export const apiParams2 = {
  page: '1',
  pageSize: '15',
  city: '101020100',
  encryptExpectId: '',
  mixExpectType: '',
  expectInfo: '',
  expectId: '100901',             // 前端开发工程师
  salary: '403,404',              // 3-10K
  degree: '202,203',              // 大专、本科
  jobType: '1901,1903',           // 全职、兼职
  experience: '102,108',          // 应届生、在校生
  _: '1723456789000'
};

/**
 * 工作经验代码参考表
 */
export const experienceCodesReference = {
  '0': '不限',
  '108': '在校生',
  '102': '应届生',
  '101': '经验不限',
  '103': '1年以内',
  '104': '1-3年',
  '105': '3-5年',
  '106': '5-10年',
  '107': '10年以上'
};

/**
 * 参数对比：薪资选择方式
 */
export const salaryComparison = {
  old: {
    minSalary: 15,      // 已移除
    maxSalary: 50       // 已移除
  },
  new: {
    salary: ['404', '405', '406']  // 5-10K, 10-20K, 20-50K (多选)
  }
};

/**
 * 参数对比：API请求变更
 */
export const apiChanges = {
  old: `
    // minSalary/maxSalary 无对应API参数
    salary: ''
  `,
  new: `
    // 使用代码多选
    salary: '405,406'       // 10-20K, 20-50K
    experience: '105,106'   // 3-5年, 5-10年
  `
};
