/**
 * 终端命令处理系统
 * 提供简单的接口添加新命令
 */
class CommandSystem {
  constructor() {
    this.commands = {};
    this.commandOutput = document.getElementById('command-output');
    this.commandInput = document.getElementById('command-input');
    this.currentSuggestion = null;
    this.suggestionElement = null;
    this.initializeSystem();
  }

  /**
   * 初始化命令系统
   */
  initializeSystem() {
    // 注册默认命令
    this.registerDefaultCommands();
    
    // 设置命令提交事件监听
    this.commandInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const command = this.commandInput.value.trim();
        this.executeCommand(command);
      }
    });
    
    // 添加Tab键自动补全功能
    this.commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // 阻止Tab键默认行为
        if (this.currentSuggestion) {
          this.commandInput.value = this.currentSuggestion;
          this.commandInput.style.width = (this.commandInput.value.length + 1) + 'ch';
          this.hideSuggestion();
        }
      }
    });
    
    // 设置输入框宽度调整并实时提供补全建议
    this.commandInput.addEventListener('input', (e) => {
      const value = this.commandInput.value;
      if (value === '') {
        this.commandInput.style.width = '1ch';
        this.hideSuggestion();
      } else {
        this.commandInput.style.width = (value.length + 1) + 'ch';
        this.showSuggestion(value);
      }
    });
    
    // 创建自动补全提示元素
    this.createSuggestionElement();
    
    // 设置初始宽度
    this.commandInput.style.width = '1ch';
  }
  
  /**
   * 创建自动补全提示元素
   */
  createSuggestionElement() {
    this.suggestionElement = document.createElement('span');
    this.suggestionElement.className = 'suggestion';
    this.suggestionElement.style.display = 'none';
    const inputContainer = document.querySelector('.input-container');
    inputContainer.appendChild(this.suggestionElement);
  }
  
  /**
   * 显示补全建议
   * @param {string} input - 用户当前输入
   */
  showSuggestion(input) {
    if (!input) {
      this.hideSuggestion();
      return;
    }
    
    // 查找匹配的命令
    const matchingCommands = Object.keys(this.commands).filter(
      cmd => cmd.startsWith(input) && cmd !== input
    );
    
    if (matchingCommands.length > 0) {
      // 选择第一个匹配的命令作为建议
      this.currentSuggestion = matchingCommands[0];
      this.suggestionElement.textContent = this.currentSuggestion.slice(input.length);
      this.suggestionElement.style.display = 'inline';
      
      // 定位建议文本
      const inputWidth = (input.length) + 'ch';
      this.suggestionElement.style.left = `calc(${inputWidth})`;
    } else {
      this.hideSuggestion();
    }
  }
  
  /**
   * 隐藏补全建议
   */
  hideSuggestion() {
    this.currentSuggestion = null;
    if (this.suggestionElement) {
      this.suggestionElement.style.display = 'none';
    }
  }

  /**
   * 注册默认命令
   */
  registerDefaultCommands() {
    this.register('help', 'Show help information', () => {
      // 创建可点击的命令列表
      const commands = Object.keys(this.commands).map(cmd => {
        const desc = this.commands[cmd].description;
        return `<b><a href="javascript:void(0)" class="command-link" data-command="${cmd}">${cmd}</a></b> - ${desc}`;
      }).join('<br>');
      
      // 为了让点击生效，需要在输出后设置事件监听
      setTimeout(() => this.setupCommandLinks(), 100);
      
      return `Available commands:<br>${commands}`;
    });
    
    this.register('bio', 'From 0 to 1', () => {
      return `<div class="story-content">
        <p>个人介绍。</p>
        // <div class="media-container">
        //   <img class="media-img" src="assets/noip.png" alt="NOIP 竞赛">
        // </div>
        // <div class="media-container">
        //   <img src="assets/letter.png" class="media-img" alt="给未来的信">
        // </div>
      </div>`;
    });
    
    this.register('skills', 'My technical skills', () => {
      return `<ul class="skills-list">
        <li><strong>Backend:</strong> Python / Golang / Java / C++ / C </li>
        <li><strong>Frontend:</strong> Vue / JavaScript / HTML / CSS</li>
        <li><strong>Storage:</strong> MySQL / MongoDB / SQLite / ES / Redis </li>
        <li><strong>System Admin:</strong> Docker / K8S / Jenkins </li>
        <li><strong>Application Security Testing:</strong> Clang-Tidy(SAST) / Valgrind(DAST) / ASAN(DAST) / Gcov(DAST) / PC-Lint / tree-sitter / Codeql / Coverity(learning) / SonarQube(learning)</li>
        <li><strong>Gateway/LB:</strong> Nginx / Tomcat / Caddy </li>
        <li><strong>CI/CD:</strong> Git / SVN </li>
        <li><strong>PaaS:</strong> Cloudflare </li>
        <li><strong>IDE:</strong> VSCode / Jetbrains / Emacs </li>
        <li><strong>OS:</strong> Windows, FreeBSD / Fedora / Ubuntu</li>
      </ul>`;
    });
    
    this.register('projects', 'My projects', () => {
      const output = `<div class="projects-list">
        <div class="project-item">
          <h3><a href="https://github.com/Soulter/astrbot" target="_blank">AstrBot</a></h3>
          <p>✨易上手的多平台 LLM 聊天机器人及开发框架✨。676 stars on GitHub.</p>
          <span class="small-text">Tech Stack: Python, AI, Chatbot</span>
        </div>
        
        <div class="project-item">
          <h3><a href="https://tickstats.soulter.top/" target="_blank">TickStats</a></h3>
          <p>Easy-to-use, highly stable metrics collection and chart visualization integrated observability middleware solution. (Under development)</p>
        </div>
        
        <div class="project-item">
          <h3><a href="https://github.com/Soulter/hugging-chat-api" target="_blank">hugging-chat-api</a></h3>
          <p>A user-friendly Python API for HuggingChat. 893 stars on GitHub.</p>
        </div>
        
        <div class="project-item">
          <h3><a href="https://campux.idoknow.top/" target="_blank">Campux</a></h3>
          <p>Campus wall automation and campus service unified authentication solution. 66 stars on Github</p>
        </div>
      </div>
      <p class="small-text">Besides, I'm currently making contributions to <a href="https://github.com/microsoft/markitdown" target="_blank">Microsoft/Markitdown</a> which has 34k stars.</p>`;
        
      return output;
    });
    
    this.register('contact', 'Fell free to contact me', () => {
      return `<div class="contact-info">
        <ul>
          <li><strong>E-mail:</strong> <span style="font-family: monospace;background-color: rgba(128,128,128,0.2); padding: 3px; border-radius: 3px;"> kyhmorningstar@gmail.com </span></li>
          <li><strong>QQ:</strong> 1511226779 </li>
          <li><strong>GitHub:</strong> <a href="https://github.com/kyh-ly" target="_blank">@kyh-ly</a></li>
          <li><strong>Twitter:</strong> <a href="https://x.com/kyhliny" target="_blank">@kyhliny</a></li>
        </ul>
      </div>`;
    });
    
    this.register('experience', 'Work experience', () => {
      return `<div class="experience">
        <div class="exp-item">
          <div class="exp-date">June 2024 - </div>
          <div class="exp-title">Huawei - Software Engineer Intern - 5G Engineering Productivity Team</div>
        </div>
        <div class="exp-item">
          <div class="exp-date">August 2021 - June 2024</div>
          <div class="exp-title">Huawei - Software Engineer Intern - Data Communication POC Team</div>
        </div>
      </div>`;
    });
    
    this.register('education', 'Education background', () => {
      return `<div class="education">
        <div class="edu-item">
          <div class="edu-date">2018 - 2021</div>
          <div class="edu-title">USTC - Arch lab 502</div>
          <div class="edu-note">IoV(Internet of Vehicles), RTOS, Time-triggered schedule, ADS, SLAM </div>
        </div>
        <div class="edu-item">
          <div class="edu-date">2014 - 2018</div>
          <div class="edu-title">QU</div>
        </div>
      </div>`;
    });
    
    this.register('hobbies', 'My hobbies and interests', () => {
      return `<div class="hobbies">
        <ol>
          <li><strong>🎷 Saxophone:</strong> I developed an interest in playing the saxophone . I haven't bought a musical instrument of my own yet, this is what I need to do next </li>
          <li><strong>🪀 YoYo:</strong> I enjoy watching and playing YoYo . This is a great sport that help to exercise your figer</li>
          <li><strong>📺 Anime:</strong> I love watching anime.</li>
          <li><strong>💻 Gadgets:</strong> Passionate about computer architecture, like CPU,GPU,SSD. </li>
          <li><strong>🎮 Gaming:</strong> Assassin's Creed / Uncharted / Tomb Raider / EA SPORT FC / …</li>
        </ol>
      </div>`;
    });

    this.register('clear', 'Clear the screen', () => {
      this.commandOutput.innerHTML = '';
      return null; // 不需要输出
    });

    this.register('blog', 'My blog', () => {
        return `<p>My blog is <a href="" target="_blank">here</a>.</p>`;
        }
    );

    // 添加社交媒体命令
    this.register('github', 'Visit my GitHub profile', () => {
      window.open('https://github.com/kyh-ly', '_blank');
      return 'Opening GitHub profile...';
    });
    
    /*this.register('wechat', 'My WeChat QR code', () => {
      return `<div class="media-container">
        <img class="media-img" src="https://drive.soulter.top/f/pYfA/d903f4fa49a496fda3f16d2be9e023b5.png" alt="WeChat QR Code">
        <p class="media-caption">Scan QR code to add my WeChat</p>
      </div>`;
    });*/

    this.register('social', 'All my social links', () => {
      return `<p>Find me on social media:</p>
      <ul class="social-links">
        <li><a href="https://github.com/kyh-ly" target="_blank">GitHub</a></li>
        <li><a href="https://space.bilibili.com/432103862?spm_id_from=333.788.0.0" target="_blank">Bilibili</a></li>
      </ul>`;
    });
    
  }

  /**
   * 设置命令链接的点击事件
   */
  setupCommandLinks() {
    document.querySelectorAll('.command-link').forEach(link => {
      link.addEventListener('click', () => {
        const command = link.getAttribute('data-command');
        this.commandInput.value = command;
        this.commandInput.style.width = (command.length + 1) + 'ch';
        // 自动执行命令
        const event = new KeyboardEvent('keypress', { 'key': 'Enter' });
        this.commandInput.dispatchEvent(event);
      });
    });
  }

  /**
   * 注册新命令
   * @param {string} name - 命令名称
   * @param {string} description - 命令描述
   * @param {Function} handler - 命令处理函数，接收参数数组并返回输出内容
   */
  register(name, description, handler) {
    this.commands[name] = {
      description,
      handler
    };
  }

  /**
   * 执行用户输入的命令
   * @param {string} input - 用户输入的完整命令
   */
  executeCommand(input) {
    // 添加用户输入到输出
    const promptLine = document.createElement('p');
    promptLine.className = 'old-prompt';
    promptLine.innerHTML = `<span class="username">/soulter</span><span class="separator">$</span> ${input}`;
    this.commandOutput.appendChild(promptLine);
    
    // 处理命令
    if (input.trim()) {
      const parts = input.trim().split(' ');
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      
      if (this.commands[command]) {
        try {
          const output = this.commands[command].handler(args);
          if (output) {
            this.appendOutput(output);
          }
        } catch (error) {
          this.appendOutput(`执行命令 ${command} 时出错: ${error.message}`);
        }
      } else {
        this.appendOutput(`Command not found: ${command}<br>Input 'help' for available commands`);
      }
    }
    
    // 清空输入并重设宽度
    this.commandInput.value = '';
    this.commandInput.style.width = '1ch';
    
    // 滚动到底部
    setTimeout(this.scrollToBottom, 50);
  }

  /**
   * 向终端添加输出
   * @param {string} html - 要添加的HTML内容
   */
  appendOutput(html) {
    const outputElement = document.createElement('p');
    outputElement.innerHTML = html;
    this.commandOutput.appendChild(outputElement);
  }

  /**
   * 设置项目按钮的点击事件
   */
  setupProjectButtons() {
    document.querySelectorAll('.hoverLink').forEach(btn => {
      btn.addEventListener('click', () => {
        const project = btn.textContent.replace('/', '');
        this.commandInput.value = `cat ${project}`;
        const event = new KeyboardEvent('keypress', { 'key': 'Enter' });
        this.commandInput.dispatchEvent(event);
      });
    });
  }

  /**
   * 滚动到终端底部
   */
  scrollToBottom() {
    const container = document.querySelector('.container');
    container.scrollTop = container.scrollHeight;
  }
}

// 导出命令系统
window.CommandSystem = CommandSystem;
