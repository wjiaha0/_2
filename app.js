/**
 * 汉字学习网站 - 主应用程序逻辑
 * 功能概述：
 * 1. 管理学习状态和进度
 * 2. 控制汉字展示、笔顺动画和语音
 * 3. 实现复习、统计和设置功能
 * 4. 提供字库管理界面
 */

// 主应用程序状态
const AppState = {
  // 汉字数据
  characters: hanziDatabase || [],
  
  // 当前状态
  currentIndex: 0,
  totalCharacters: 0,
  
  // 学习进度
  progress: {
    learned: [], // 已学汉字的索引数组
    mastery: {}, // 每个汉字的掌握程度 (0-100)
    lastVisit: null, // 最后访问日期
    streak: 0, // 连续学习天数
    todayLearned: 0, // 今天学习的汉字数量
    totalTime: 0, // 总学习时间(分钟)
    stats: { // 统计数据
      totalDays: 0,
      totalCharacters: 0,
      totalReviews: 0
    }
  },
  
  // 设置
  settings: {
    theme: 'light',
    fontSize: 'medium',
    autoPlay: true,
    autoSpeak: true,
    animationSpeed: 5,
    voiceRate: 1,
    voicePitch: 1
  },
  
  // HanziWriter 实例
  writer: null,
  
  // 语音合成
  speechSynthesis: window.speechSynthesis || null,
  voices: [],
  currentVoice: null,
  
  // 复习状态
  reviewMode: false,
  reviewQueue: [],
  currentReviewIndex: 0
};

// 主应用程序类
class HanziLearningApp {
  constructor() {
    this.init();
  }
  
  /**
   * 初始化应用程序
   */
  async init() {
    // 显示加载动画
    this.showLoading();
    
    try {
      // 加载进度和设置
      this.loadProgress();
      this.loadSettings();
      
      // 初始化UI
      this.initUI();
      
      // 初始化语音合成
      this.initSpeech();
      
      // 初始化事件监听器
      this.initEventListeners();
      
      // 更新UI状态
      this.updateUI();
      
      // 隐藏加载动画
      setTimeout(() => {
        this.hideLoading();
      }, 500);
      
    } catch (error) {
      console.error('初始化应用时出错:', error);
      this.showNotification('初始化应用时出错，请刷新页面重试', 'error');
      this.hideLoading();
    }
  }
  
  /**
   * 加载学习进度
   */
  loadProgress() {
    const savedProgress = localStorage.getItem('hanzi_learning_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        AppState.progress = { ...AppState.progress, ...parsed };
        
        // 如果最后访问不是今天，重置今日学习计数
        const today = new Date().toDateString();
        if (AppState.progress.lastVisit !== today) {
          this.updateStreak();
          AppState.progress.todayLearned = 0;
          AppState.progress.lastVisit = today;
        }
      } catch (e) {
        console.warn('加载进度数据失败，使用默认值:', e);
      }
    }
    
    // 初始化总字符数
    AppState.totalCharacters = AppState.characters.length;
    
    // 设置当前索引为第一个未学习的汉字
    if (AppState.progress.learned.length > 0) {
      const lastLearned = Math.max(...AppState.progress.learned);
      AppState.currentIndex = Math.min(lastLearned + 1, AppState.totalCharacters - 1);
    } else {
      AppState.currentIndex = 0;
    }
  }
  
  /**
   * 保存学习进度
   */
  saveProgress() {
    try {
      localStorage.setItem('hanzi_learning_progress', JSON.stringify(AppState.progress));
    } catch (e) {
      console.error('保存进度失败:', e);
      this.showNotification('保存进度失败', 'error');
    }
  }
  
  /**
   * 加载设置
   */
  loadSettings() {
    const savedSettings = localStorage.getItem('hanzi_learning_settings');
    if (savedSettings) {
      try {
        AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
        
        // 应用主题
        this.applyTheme(AppState.settings.theme);
        
        // 应用字体大小
        this.applyFontSize(AppState.settings.fontSize);
        
      } catch (e) {
        console.warn('加载设置失败，使用默认值:', e);
      }
    }
  }
  
  /**
   * 保存设置
   */
  saveSettings() {
    try {
      localStorage.setItem('hanzi_learning_settings', JSON.stringify(AppState.settings));
    } catch (e) {
      console.error('保存设置失败:', e);
      this.showNotification('保存设置失败', 'error');
    }
  }
  
  /**
   * 应用主题
   */
  applyTheme(theme) {
    let actualTheme = theme;
    
    if (theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', actualTheme);
    AppState.settings.theme = theme;
    
    // 更新主题切换按钮图标
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = actualTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    
    // 更新主题选项按钮状态
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
  
  /**
   * 应用字体大小
   */
  applyFontSize(size) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${size}`);
    
    // 更新字体大小按钮状态
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
  }
  
  /**
   * 更新连续学习天数
   */
  updateStreak() {
    const today = new Date();
    const lastVisit = AppState.progress.lastVisit ? new Date(AppState.progress.lastVisit) : null;
    
    if (lastVisit) {
      const diffTime = today - lastVisit;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // 昨天访问过，增加连续天数
        AppState.progress.streak++;
      } else if (diffDays > 1) {
        // 中断超过一天，重置连续天数
        AppState.progress.streak = 0;
      }
      // 如果diffDays === 0，是同一天，不更新
    }
    
    // 更新最后访问日期
    AppState.progress.lastVisit = today.toDateString();
    
    // 如果是第一次访问，初始化连续天数
    if (AppState.progress.streak === 0 && AppState.progress.learned.length === 0) {
      AppState.progress.streak = 1;
    }
  }
  
  /**
   * 初始化UI元素
   */
  initUI() {
    // 更新总字符数显示
    document.getElementById('total-count').textContent = AppState.totalCharacters;
    
    // 更新当前索引显示
    document.getElementById('current-index').textContent = AppState.currentIndex + 1;
    
    // 更新进度百分比
    this.updateProgressDisplay();
    
    // 更新设置控件
    document.getElementById('animation-speed').value = AppState.settings.animationSpeed;
    document.getElementById('voice-rate').value = AppState.settings.voiceRate;
    document.getElementById('default-speed').value = AppState.settings.animationSpeed;
    document.getElementById('default-voice-rate').value = AppState.settings.voiceRate;
    document.getElementById('auto-play').checked = AppState.settings.autoPlay;
    document.getElementById('auto-speak').checked = AppState.settings.autoSpeak;
    
    // 生成汉字网格
    this.generateCharacterGrid();
    
    // 更新统计页面
    this.updateStatsPage();
    
    // 加载当前汉字
    this.loadCharacter(AppState.currentIndex);
  }
  
  /**
   * 初始化事件监听器
   */
  initEventListeners() {
    // 导航按钮
    document.getElementById('prev-character').addEventListener('click', () => this.prevCharacter());
    document.getElementById('next-character').addEventListener('click', () => this.nextCharacter());
    document.getElementById('jump-to-btn').addEventListener('click', () => this.jumpToCharacter());
    document.getElementById('jump-to-index').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.jumpToCharacter();
    });
    
    // 笔顺控制按钮
    document.getElementById('play-animation').addEventListener('click', () => this.playAnimation());
    document.getElementById('pause-animation').addEventListener('click', () => this.pauseAnimation());
    document.getElementById('reset-animation').addEventListener('click', () => this.resetAnimation());
    document.getElementById('animation-speed').addEventListener('input', (e) => {
      this.updateAnimationSpeed(e.target.value);
    });
    
    // 语音控制按钮
    document.getElementById('speak-character').addEventListener('click', () => this.speakCharacter());
    document.getElementById('speak-phrase').addEventListener('click', () => this.speakPhrase());
    document.getElementById('voice-rate').addEventListener('input', (e) => {
      this.updateVoiceRate(e.target.value);
    });
    
    // 进度控制按钮
    document.getElementById('reset-progress').addEventListener('click', () => this.resetProgress());
    document.getElementById('export-data').addEventListener('click', () => this.exportData());
    
    // 页面导航
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchPage(link.dataset.page);
      });
    });
    
    // 主题切换
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const currentTheme = AppState.settings.theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
      this.saveSettings();
    });
    
    // 主题选项
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const theme = e.currentTarget.dataset.theme;
        this.applyTheme(theme);
        this.saveSettings();
      });
    });
    
    // 字体大小控制
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const size = e.currentTarget.dataset.size;
        this.applyFontSize(size);
        AppState.settings.fontSize = size;
        this.saveSettings();
      });
    });
    
    // 设置控件
    document.getElementById('default-speed').addEventListener('input', (e) => {
      AppState.settings.animationSpeed = parseInt(e.target.value);
      document.getElementById('animation-speed').value = AppState.settings.animationSpeed;
      this.updateAnimationSpeed(AppState.settings.animationSpeed);
      this.saveSettings();
    });
    
    document.getElementById('default-voice-rate').addEventListener('input', (e) => {
      AppState.settings.voiceRate = parseFloat(e.target.value);
      document.getElementById('voice-rate').value = AppState.settings.voiceRate;
      this.updateVoiceRate(AppState.settings.voiceRate);
      this.saveSettings();
    });
    
    document.getElementById('auto-play').addEventListener('change', (e) => {
      AppState.settings.autoPlay = e.target.checked;
      this.saveSettings();
    });
    
    document.getElementById('auto-speak').addEventListener('change', (e) => {
      AppState.settings.autoSpeak = e.target.checked;
      this.saveSettings();
    });
    
    // 数据管理
    document.getElementById('export-settings').addEventListener('click', () => this.exportSettings());
    document.getElementById('import-settings').addEventListener('click', () => this.importSettings());
    document.getElementById('reset-all-data').addEventListener('click', () => this.resetAllData());
    
    // 复习功能
    document.getElementById('start-review').addEventListener('click', () => this.startReview());
    document.getElementById('random-review').addEventListener('click', () => this.randomReview());
    
    // 管理面板
    document.getElementById('admin-toggle').addEventListener('click', () => this.toggleAdminPanel());
    document.getElementById('close-admin').addEventListener('click', () => this.toggleAdminPanel());
    
    // 管理面板标签
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchAdminTab(e.currentTarget.dataset.tab);
      });
    });
    
    // 添加汉字表单
    document.getElementById('add-character-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addCharacter();
    });
    
    // 搜索功能
    document.getElementById('admin-search-btn').addEventListener('click', () => this.searchCharacters());
    document.getElementById('admin-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchCharacters();
    });
    
    // 导入/导出JSON
    document.getElementById('import-json').addEventListener('click', () => this.importJSON());
    document.getElementById('export-json').addEventListener('click', () => this.exportJSON());
    
    // 窗口大小变化时重新计算布局
    window.addEventListener('resize', () => {
      if (AppState.writer) {
        this.setupHanziWriter();
      }
    });
    
    // 页面卸载前保存进度
    window.addEventListener('beforeunload', () => {
      this.saveProgress();
    });
  }
  
  /**
   * 加载指定索引的汉字
   */
  loadCharacter(index) {
    if (index < 0 || index >= AppState.totalCharacters) {
      console.warn('索引超出范围:', index);
      return;
    }
    
    // 更新当前索引
    AppState.currentIndex = index;
    
    // 获取汉字数据
    const character = AppState.characters[index];
    
    // 更新UI显示
    document.getElementById('current-character').textContent = character.char;
    document.getElementById('pinyin').textContent = character.pinyin;
    document.getElementById('phrase').textContent = character.phrase;
    document.getElementById('current-index').textContent = index + 1;
    
    // 更新汉字网格高亮
    this.updateCharacterGridHighlight();
    
    // 如果汉字是第一次学习，添加到已学列表
    if (!AppState.progress.learned.includes(index)) {
      AppState.progress.learned.push(index);
      AppState.progress.todayLearned++;
      
      // 更新掌握程度
      if (!AppState.progress.mastery[index]) {
        AppState.progress.mastery[index] = 10; // 初始掌握程度10%
      }
      
      this.saveProgress();
    }
    
    // 更新进度显示
    this.updateProgressDisplay();
    
    // 设置HanziWriter
    this.setupHanziWriter();
    
    // 如果设置中启用了自动播放，播放笔顺动画
    if (AppState.settings.autoPlay && AppState.writer) {
      setTimeout(() => {
        this.playAnimation();
      }, 300);
    }
    
    // 如果设置中启用了自动朗读，朗读汉字
    if (AppState.settings.autoSpeak) {
      setTimeout(() => {
        this.speakCharacter();
      }, 500);
    }
  }
  
  /**
   * 设置HanziWriter笔顺动画
   */
  setupHanziWriter() {
    const character = AppState.characters[AppState.currentIndex];
    const container = document.getElementById('hanzi-writer-container');
    
    // 清除现有容器内容
    container.innerHTML = '';
    
    // 如果已有writer实例，先取消动画
    if (AppState.writer) {
      AppState.writer.cancelAnimation();
      AppState.writer = null;
    }
    
    // 创建新的writer实例
    try {
      AppState.writer = HanziWriter.create(container, character.char, {
        width: 300,
        height: 300,
        padding: 5,
        strokeAnimationSpeed: 1.5,
        strokeHighlightSpeed: 2,
        strokeFadeDuration: 400,
        delayBetweenStrokes: 200,
        showOutline: true,
        showCharacter: false,
        radicalColor: '#FF9800',
        strokeColor: {
          red: 74,
          green: 111,
          blue: 165,
          alpha: 1
        },
        highlightColor: {
          red: 255,
          green: 152,
          blue: 0,
          alpha: 0.5
        },
        outlineColor: {
          red: 100,
          green: 100,
          blue: 100,
          alpha: 0.3
        },
        drawingColor: {
          red: 74,
          green: 111,
          blue: 165,
          alpha: 1
        },
        drawingWidth: 4,
        outlineWidth: 2
      });
      
      // 应用动画速度设置
      this.updateAnimationSpeed(AppState.settings.animationSpeed);
      
    } catch (error) {
      console.error('创建HanziWriter实例失败:', error);
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>无法加载笔顺动画</p>
        </div>
      `;
    }
  }
  
  /**
   * 播放笔顺动画
   */
  playAnimation() {
    if (AppState.writer) {
      AppState.writer.animateCharacter();
    }
  }
  
  /**
   * 暂停笔顺动画
   */
  pauseAnimation() {
    if (AppState.writer) {
      AppState.writer.pauseAnimation();
    }
  }
  
  /**
   * 重置笔顺动画
   */
  resetAnimation() {
    if (AppState.writer) {
      AppState.writer.cancelAnimation();
      AppState.writer.showCharacter();
    }
  }
  
  /**
   * 更新动画速度
   */
  updateAnimationSpeed(speed) {
    // speed范围1-10，转换为HanziWriter的速度系数
    const speedFactor = 0.5 + (speed / 10) * 2; // 0.5x到2.5x
    
    if (AppState.writer) {
      AppState.writer._options.strokeAnimationSpeed = speedFactor;
    }
    
    // 更新显示
    const speedLabels = ['很慢', '慢', '较慢', '稍慢', '中', '稍快', '较快', '快', '很快', '极快'];
    const speedLabel = speedLabels[speed - 1] || '中';
    document.getElementById('speed-value').textContent = speedLabel;
  }
  
  /**
   * 初始化语音合成
   */
  initSpeech() {
    if (!AppState.speechSynthesis) {
      console.warn('浏览器不支持语音合成');
      return;
    }
    
    // 获取可用语音列表
    const populateVoices = () => {
      AppState.voices = AppState.speechSynthesis.getVoices();
      
      // 优先选择中文语音
      const chineseVoices = AppState.voices.filter(voice => 
        voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')
      );
      
      if (chineseVoices.length > 0) {
        AppState.currentVoice = chineseVoices[0];
      } else if (AppState.voices.length > 0) {
        AppState.currentVoice = AppState.voices[0];
      }
    };
    
    // 监听语音列表变化
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
    }
    
    populateVoices();
  }
  
  /**
   * 朗读文本
   */
  speak(text, rate = AppState.settings.voiceRate) {
    if (!AppState.speechSynthesis || !AppState.currentVoice) {
      this.showNotification('浏览器不支持语音朗读功能', 'warning');
      return;
    }
    
    // 停止当前正在朗读的内容
    AppState.speechSynthesis.cancel();
    
    // 创建新的语音实例
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = AppState.currentVoice;
    utterance.rate = rate;
    utterance.pitch = AppState.settings.voicePitch;
    utterance.lang = 'zh-CN';
    
    utterance.onstart = () => {
      console.log('开始朗读:', text);
    };
    
    utterance.onend = () => {
      console.log('朗读结束');
    };
    
    utterance.onerror = (event) => {
      console.error('朗读错误:', event);
      this.showNotification('朗读失败，请检查语音设置', 'error');
    };
    
    // 开始朗读
    AppState.speechSynthesis.speak(utterance);
  }
  
  /**
   * 朗读当前汉字
   */
  speakCharacter() {
    const character = AppState.characters[AppState.currentIndex];
    this.speak(character.char);
  }
  
  /**
   * 朗读当前词组
   */
  speakPhrase() {
    const character = AppState.characters[AppState.currentIndex];
    this.speak(character.phrase);
  }
  
  /**
   * 更新语音速度
   */
  updateVoiceRate(rate) {
    const rateValue = parseFloat(rate);
    let rateLabel = '正常';
    
    if (rateValue < 0.8) rateLabel = '很慢';
    else if (rateValue < 1.0) rateLabel = '慢';
    else if (rateValue > 1.2) rateLabel = '快';
    else if (rateValue > 1.5) rateLabel = '很快';
    
    document.getElementById('voice-rate-value').textContent = rateLabel;
  }
  
  /**
   * 上一个汉字
   */
  prevCharacter() {
    if (AppState.currentIndex > 0) {
      this.loadCharacter(AppState.currentIndex - 1);
    } else {
      this.showNotification('已经是第一个汉字了', 'info');
    }
  }
  
  /**
   * 下一个汉字
   */
  nextCharacter() {
    if (AppState.currentIndex < AppState.totalCharacters - 1) {
      this.loadCharacter(AppState.currentIndex + 1);
    } else {
      this.showNotification('已经是最后一个汉字了', 'info');
    }
  }
  
  /**
   * 跳转到指定汉字
   */
  jumpToCharacter() {
    const input = document.getElementById('jump-to-index');
    const index = parseInt(input.value) - 1;
    
    if (isNaN(index) || index < 0 || index >= AppState.totalCharacters) {
      this.showNotification(`请输入1到${AppState.totalCharacters}之间的数字`, 'error');
      return;
    }
    
    this.loadCharacter(index);
  }
  
  /**
   * 更新进度显示
   */
  updateProgressDisplay() {
    const learnedCount = AppState.progress.learned.length;
    const totalCount = AppState.totalCharacters;
    const progressPercent = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;
    
    // 更新进度百分比
    document.getElementById('progress-percent').textContent = progressPercent;
    
    // 更新进度圆环
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
      const circumference = 2 * Math.PI * 54; // 半径54
      const offset = circumference - (progressPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }
    
    // 更新统计数字
    document.getElementById('learned-count').textContent = learnedCount;
    document.getElementById('streak-count').textContent = `${AppState.progress.streak} 天`;
    document.getElementById('today-count').textContent = `${AppState.progress.todayLearned} 字`;
  }
  
  /**
   * 生成汉字网格
   */
  generateCharacterGrid() {
    const gridContainer = document.querySelector('.character-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    for (let i = 0; i < AppState.totalCharacters; i++) {
      const char = AppState.characters[i].char;
      const item = document.createElement('div');
      item.className = 'character-grid-item';
      if (i === AppState.currentIndex) {
        item.classList.add('active');
      }
      item.textContent = char;
      item.dataset.index = i;
      
      item.addEventListener('click', () => {
        this.loadCharacter(i);
      });
      
      gridContainer.appendChild(item);
    }
  }
  
  /**
   * 更新汉字网格高亮
   */
  updateCharacterGridHighlight() {
    document.querySelectorAll('.character-grid-item').forEach((item, index) => {
      item.classList.toggle('active', index === AppState.currentIndex);
    });
  }
  
  /**
   * 切换页面
   */
  switchPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
    
    // 如果是统计页面，更新统计数据
    if (pageId === 'stats') {
      this.updateStatsPage();
    }
  }
  
  /**
   * 更新统计页面
   */
  updateStatsPage() {
    const progress = AppState.progress;
    const totalLearned = progress.learned.length;
    const totalChars = AppState.totalCharacters;
    
    // 更新统计卡片
    document.getElementById('total-days').textContent = progress.stats.totalDays || 1;
    document.getElementById('total-characters').textContent = totalLearned;
    document.getElementById('total-time').textContent = progress.totalTime;
    document.getElementById('current-streak').textContent = progress.streak;
    document.getElementById('mastery-rate').textContent = this.calculateAverageMastery() + '%';
    document.getElementById('review-count-stat').textContent = progress.stats.totalReviews || 0;
    
    // 更新复习页面统计
    document.getElementById('review-count').textContent = totalLearned;
    document.getElementById('mastery-level').textContent = this.calculateAverageMastery() + '%';
  }
  
  /**
   * 计算平均掌握程度
   */
  calculateAverageMastery() {
    const mastery = AppState.progress.mastery;
    const learned = AppState.progress.learned;
    
    if (learned.length === 0) return 0;
    
    const totalMastery = learned.reduce((sum, index) => {
      return sum + (mastery[index] || 0);
    }, 0);
    
    return Math.round(totalMastery / learned.length);
  }
  
  /**
   * 重置学习进度
   */
  resetProgress() {
    if (confirm('确定要重置学习进度吗？这将清除所有已学汉字和掌握程度数据，但不会删除汉字库。')) {
      AppState.progress = {
        learned: [],
        mastery: {},
        lastVisit: new Date().toDateString(),
        streak: 0,
        todayLearned: 0,
        totalTime: 0,
        stats: {
          totalDays: 1,
          totalCharacters: 0,
          totalReviews: 0
        }
      };
      
      AppState.currentIndex = 0;
      
      this.saveProgress();
      this.updateUI();
      this.loadCharacter(0);
      
      this.showNotification('进度已重置', 'success');
    }
  }
  
  /**
   * 导出数据
   */
  exportData() {
    const data = {
      progress: AppState.progress,
      settings: AppState.settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hanzi-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showNotification('数据已导出', 'success');
  }
  
  /**
   * 导出设置
   */
  exportSettings() {
    const data = {
      settings: AppState.settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hanzi-settings-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showNotification('设置已导出', 'success');
  }
  
  /**
   * 导入设置
   */
  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.settings) {
            AppState.settings = { ...AppState.settings, ...data.settings };
            this.applyTheme(AppState.settings.theme);
            this.applyFontSize(AppState.settings.fontSize);
            this.saveSettings();
            this.updateUI();
            
            this.showNotification('设置已导入并应用', 'success');
          } else {
            this.showNotification('文件格式不正确', 'error');
          }
        } catch (err) {
          console.error('导入设置失败:', err);
          this.showNotification('导入失败: 文件格式不正确', 'error');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }
  
  /**
   * 重置所有数据
   */
  resetAllData() {
    if (confirm('确定要重置所有数据吗？这将清除所有学习进度、设置和自定义汉字库。此操作不可撤销！')) {
      localStorage.clear();
      
      // 重新加载页面
      location.reload();
    }
  }
  
  /**
   * 开始复习
   */
  startReview() {
    const includeMastered = document.getElementById('review-mastered').checked;
    const quantity = parseInt(document.getElementById('review-quantity').value);
    
    // 获取需要复习的汉字索引
    let reviewIndices = [];
    
    if (includeMastered) {
      // 包括所有已学汉字
      reviewIndices = [...AppState.progress.learned];
    } else {
      // 只包括掌握程度较低的汉字（低于60%）
      reviewIndices = AppState.progress.learned.filter(index => {
        return (AppState.progress.mastery[index] || 0) < 60;
      });
    }
    
    if (reviewIndices.length === 0) {
      this.showNotification('没有需要复习的汉字', 'info');
      return;
    }
    
    // 打乱顺序
    reviewIndices = this.shuffleArray(reviewIndices);
    
    // 限制数量
    reviewIndices = reviewIndices.slice(0, quantity);
    
    // 设置复习状态
    AppState.reviewMode = true;
    AppState.reviewQueue = reviewIndices;
    AppState.currentReviewIndex = 0;
    
    // 显示第一个复习汉字
    this.showNextReviewCharacter();
    
    // 切换到复习页面
    this.switchPage('review');
    
    this.showNotification(`开始复习 ${reviewIndices.length} 个汉字`, 'success');
  }
  
  /**
   * 随机复习
   */
  randomReview() {
    const quantity = parseInt(document.getElementById('review-quantity').value);
    
    // 从所有汉字中随机选择
    let allIndices = Array.from({length: AppState.totalCharacters}, (_, i) => i);
    allIndices = this.shuffleArray(allIndices);
    allIndices = allIndices.slice(0, quantity);
    
    // 设置复习状态
    AppState.reviewMode = true;
    AppState.reviewQueue = allIndices;
    AppState.currentReviewIndex = 0;
    
    // 显示第一个复习汉字
    this.showNextReviewCharacter();
    
    // 切换到复习页面
    this.switchPage('review');
    
    this.showNotification(`开始随机复习 ${allIndices.length} 个汉字`, 'success');
  }
  
  /**
   * 显示下一个复习汉字
   */
  showNextReviewCharacter() {
    if (!AppState.reviewMode || AppState.currentReviewIndex >= AppState.reviewQueue.length) {
      this.endReview();
      return;
    }
    
    const charIndex = AppState.reviewQueue[AppState.currentReviewIndex];
    const character = AppState.characters[charIndex];
    
    const container = document.getElementById('review-character');
    container.innerHTML = `
      <div class="review-character-display">
        <div class="review-character">${character.char}</div>
        <div class="review-character-info">
          <div class="review-pinyin">${character.pinyin}</div>
          <div class="review-phrase">${character.phrase}</div>
          ${character.meaning ? `<div class="review-meaning">${character.meaning}</div>` : ''}
        </div>
        <div class="review-controls">
          <button id="review-next" class="btn btn-primary">下一个</button>
          <button id="review-mark-easy" class="btn btn-success">简单</button>
          <button id="review-mark-hard" class="btn btn-warning">困难</button>
          <div class="review-progress">
            ${AppState.currentReviewIndex + 1} / ${AppState.reviewQueue.length}
          </div>
        </div>
      </div>
    `;
    
    // 添加复习控制按钮事件
    document.getElementById('review-next').addEventListener('click', () => {
      this.nextReviewCharacter();
    });
    
    document.getElementById('review-mark-easy').addEventListener('click', () => {
      this.markReviewCharacter('easy');
    });
    
    document.getElementById('review-mark-hard').addEventListener('click', () => {
      this.markReviewCharacter('hard');
    });
    
    // 自动播放笔顺
    this.setupReviewHanziWriter(character.char);
  }
  
  /**
   * 设置复习页面的笔顺动画
   */
  setupReviewHanziWriter(character) {
    const container = document.querySelector('.review-character-display');
    if (!container) return;
    
    const writerContainer = document.createElement('div');
    writerContainer.className = 'review-hanzi-writer';
    writerContainer.style.width = '200px';
    writerContainer.style.height = '200px';
    writerContainer.style.margin = '0 auto';
    
    container.insertBefore(writerContainer, document.querySelector('.review-character-info'));
    
    try {
      const writer = HanziWriter.create(writerContainer, character, {
        width: 200,
        height: 200,
        showCharacter: false,
        strokeAnimationSpeed: 2
      });
      
      writer.animateCharacter();
    } catch (error) {
      console.error('创建复习笔顺动画失败:', error);
    }
  }
  
  /**
   * 下一个复习汉字
   */
  nextReviewCharacter() {
    AppState.currentReviewIndex++;
    this.showNextReviewCharacter();
  }
  
  /**
   * 标记复习汉字难度
   */
  markReviewCharacter(difficulty) {
    const charIndex = AppState.reviewQueue[AppState.currentReviewIndex];
    
    // 更新掌握程度
    if (!AppState.progress.mastery[charIndex]) {
      AppState.progress.mastery[charIndex] = 10;
    }
    
    if (difficulty === 'easy') {
      // 增加掌握程度
      AppState.progress.mastery[charIndex] = Math.min(100, AppState.progress.mastery[charIndex] + 20);
    } else if (difficulty === 'hard') {
      // 减少掌握程度
      AppState.progress.mastery[charIndex] = Math.max(0, AppState.progress.mastery[charIndex] - 10);
    }
    
    // 更新复习次数统计
    AppState.progress.stats.totalReviews = (AppState.progress.stats.totalReviews || 0) + 1;
    
    this.saveProgress();
    this.nextReviewCharacter();
  }
  
  /**
   * 结束复习
   */
  endReview() {
    AppState.reviewMode = false;
    AppState.reviewQueue = [];
    
    const container = document.getElementById('review-character');
    container.innerHTML = `
      <div class="review-character-placeholder">
        <i class="fas fa-check-circle"></i>
        <p>复习完成！</p>
        <button id="review-again" class="btn btn-primary">再次复习</button>
      </div>
    `;
    
    document.getElementById('review-again').addEventListener('click', () => {
      this.startReview();
    });
    
    this.showNotification('复习完成！', 'success');
  }
  
  /**
   * 切换管理面板
   */
  toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
      this.loadAdminTable();
    }
  }
  
  /**
   * 切换管理面板标签
   */
  switchAdminTab(tabId) {
    // 更新标签按钮状态
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // 显示对应的内容
    document.querySelectorAll('.admin-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
  }
  
  /**
   * 加载管理表格
   */
  loadAdminTable(searchTerm = '') {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filteredCharacters = AppState.characters.filter((char, index) => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        char.char.toLowerCase().includes(search) ||
        char.pinyin.toLowerCase().includes(search) ||
        char.phrase.toLowerCase().includes(search) ||
        (char.meaning && char.meaning.toLowerCase().includes(search))
      );
    });
    
    filteredCharacters.forEach((char, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${char.char}</td>
        <td>${char.pinyin}</td>
        <td>${char.phrase}</td>
        <td>
          <button class="btn btn-small edit-char" data-index="${index}">编辑</button>
          <button class="btn btn-small delete-char" data-index="${index}">删除</button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
    
    // 添加编辑和删除按钮事件
    document.querySelectorAll('.edit-char').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editCharacter(index);
      });
    });
    
    document.querySelectorAll('.delete-char').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteCharacter(index);
      });
    });
  }
  
  /**
   * 搜索汉字
   */
  searchCharacters() {
    const searchTerm = document.getElementById('admin-search').value;
    this.loadAdminTable(searchTerm);
  }
  
  /**
   * 添加汉字
   */
  addCharacter() {
    const char = document.getElementById('new-char').value.trim();
    const pinyin = document.getElementById('new-pinyin').value.trim();
    const phrase = document.getElementById('new-phrase').value.trim();
    const meaning = document.getElementById('new-meaning').value.trim();
    
    if (!char || !pinyin || !phrase) {
      this.showNotification('请填写所有必填字段（汉字、拼音、词组）', 'error');
      return;
    }
    
    // 创建新汉字对象
    const newCharacter = {
      char,
      pinyin,
      phrase,
      meaning: meaning || undefined
    };
    
    // 添加到数组
    AppState.characters.push(newCharacter);
    AppState.totalCharacters = AppState.characters.length;
    
    // 更新UI
    this.updateUI();
    
    // 清空表单
    document.getElementById('add-character-form').reset();
    
    // 重新加载表格
    this.loadAdminTable();
    
    // 显示成功消息
    this.showNotification(`汉字"${char}"添加成功`, 'success');
    
    // 切换到查看标签
    this.switchAdminTab('view');
  }
  
  /**
   * 编辑汉字
   */
  editCharacter(index) {
    const char = AppState.characters[index];
    
    // 填充表单
    document.getElementById('new-char').value = char.char;
    document.getElementById('new-pinyin').value = char.pinyin;
    document.getElementById('new-phrase').value = char.phrase;
    document.getElementById('new-meaning').value = char.meaning || '';
    
    // 切换到添加标签
    this.switchAdminTab('add');
    
    // 修改表单提交行为为编辑
    const form = document.getElementById('add-character-form');
    const originalSubmit = form.onsubmit;
    
    form.onsubmit = (e) => {
      e.preventDefault();
      
      const newChar = document.getElementById('new-char').value.trim();
      const newPinyin = document.getElementById('new-pinyin').value.trim();
      const newPhrase = document.getElementById('new-phrase').value.trim();
      const newMeaning = document.getElementById('new-meaning').value.trim();
      
      if (!newChar || !newPinyin || !newPhrase) {
        this.showNotification('请填写所有必填字段', 'error');
        return;
      }
      
      // 更新汉字
      AppState.characters[index] = {
        char: newChar,
        pinyin: newPinyin,
        phrase: newPhrase,
        meaning: newMeaning || undefined
      };
      
      // 更新UI
      this.updateUI();
      
      // 重置表单
      form.reset();
      form.onsubmit = originalSubmit;
      
      // 重新加载表格
      this.loadAdminTable();
      
      // 切换到查看标签
      this.switchAdminTab('view');
      
      this.showNotification(`汉字"${newChar}"更新成功`, 'success');
    };
    
    this.showNotification(`正在编辑汉字"${char.char}"，修改后点击"添加汉字"保存`, 'info');
  }
  
  /**
   * 删除汉字
   */
  deleteCharacter(index) {
    const char = AppState.characters[index].char;
    
    if (confirm(`确定要删除汉字"${char}"吗？此操作不可撤销。`)) {
      // 从数组中删除
      AppState.characters.splice(index, 1);
      AppState.totalCharacters = AppState.characters.length;
      
      // 如果当前索引超出范围，调整索引
      if (AppState.currentIndex >= AppState.totalCharacters) {
        AppState.currentIndex = Math.max(0, AppState.totalCharacters - 1);
      }
      
      // 更新UI
      this.updateUI();
      
      // 重新加载当前汉字
      this.loadCharacter(AppState.currentIndex);
      
      // 重新加载表格
      this.loadAdminTable();
      
      this.showNotification(`汉字"${char}"已删除`, 'success');
    }
  }
  
  /**
   * 导入JSON数据
   */
  importJSON() {
    const jsonData = document.getElementById('import-data').value.trim();
    
    if (!jsonData) {
      this.showNotification('请输入JSON数据', 'error');
      return;
    }
    
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!Array.isArray(importedData)) {
        throw new Error('JSON数据必须是一个数组');
      }
      
      // 验证每个对象的结构
      for (let i = 0; i < importedData.length; i++) {
        const item = importedData[i];
        if (!item.char || !item.pinyin || !item.phrase) {
          throw new Error(`第${i + 1}个对象缺少必要字段（char, pinyin, phrase）`);
        }
      }
      
      // 添加到现有数据
      AppState.characters.push(...importedData);
      AppState.totalCharacters = AppState.characters.length;
      
      // 更新UI
      this.updateUI();
      
      // 清空输入框
      document.getElementById('import-data').value = '';
      
      // 重新加载表格
      this.loadAdminTable();
      
      this.showNotification(`成功导入${importedData.length}个汉字`, 'success');
      
    } catch (error) {
      console.error('导入JSON失败:', error);
      this.showNotification(`导入失败: ${error.message}`, 'error');
    }
  }
  
  /**
   * 导出JSON数据
   */
  exportJSON() {
    const dataStr = JSON.stringify(AppState.characters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hanzi-database-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showNotification('汉字库已导出为JSON文件', 'success');
  }
  
  /**
   * 更新UI
   */
  updateUI() {
    // 更新总字符数显示
    document.getElementById('total-count').textContent = AppState.totalCharacters;
    
    // 更新进度显示
    this.updateProgressDisplay();
    
    // 重新生成汉字网格
    this.generateCharacterGrid();
    
    // 更新统计页面
    this.updateStatsPage();
  }
  
  /**
   * 显示通知
   */
  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');
    
    if (!notification || !messageEl) return;
    
    // 设置消息和类型
    messageEl.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    
    // 显示通知
    notification.classList.add('show');
    
    // 3秒后隐藏
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  /**
   * 显示加载动画
   */
  showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }
  
  /**
   * 隐藏加载动画
   */
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
  
  /**
   * 打乱数组顺序
   */
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 检查HanziWriter是否加载
  if (typeof HanziWriter === 'undefined') {
    console.error('HanziWriter库未加载');
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
        <h1 style="color: #dc3545;">错误: 必要库未加载</h1>
        <p>HanziWriter库加载失败，请检查网络连接并刷新页面。</p>
        <p>如果问题持续存在，请检查浏览器控制台获取更多信息。</p>
      </div>
    `;
    return;
  }
  
  // 初始化应用
  window.hanziApp = new HanziLearningApp();
});