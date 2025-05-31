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
        <li><strong>Backend:</strong> Python / Golang / Java / C++</li>
        <li><strong>Frontend:</strong> Vue / JavaScript / HTML / CSS</li>
        <li><strong>Storage:</strong> MySQL / MongoDB / SQLite / ES / Redis / MinIO / MiniOB</li>
        <li><strong>System Admin:</strong> Docker / K8S / ...</li>
        <li><strong>Gateway/LB:</strong> Caddy</li>
        <li><strong>CI/CD:</strong> Git / GitHub Workflow</li>
        <li><strong>PaaS:</strong> Vercel / Cloudflare</li>
        <li><strong>Filming:</strong> Adobe Premiere / Adobe Photoshop</li>
        <li><strong>IDE:</strong> VSCode / Jetbrains / AndroidStudio / Vim</li>
        <li><strong>OS:</strong> Windows, MacOS, ArchLinux, Ubuntu, Debian</li>
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
          <li><strong>E-mail:</strong> <span style="font-family: monospace;background-color: rgba(128,128,128,0.2); padding: 3px; border-radius: 3px;">echo 'c291bHRlckBxcS5jb20K' | base64 -d</span></li>
          <li><strong>Telegram:</strong> <a href="https://t.me/soulter618" target="_blank">soulter618</a></li>
          <li><strong>QQ:</strong> 905617992</li>
          <li><strong>GitHub:</strong> <a href="https://github.com/Soulter" target="_blank">@soulter</a></li>
          <li><strong>Twitter:</strong> <a href="https://twitter.com/soulter_" target="_blank">@soulter_</a></li>
        </ul>
      </div>`;
    });
    
    this.register('experience', 'Work experience', () => {
      return `<div class="experience">
        <div class="exp-item">
          <div class="exp-date">February 2025 - </div>
          <div class="exp-title">MoonShot - Software Engineer Intern (LLM Agent)</div>
        </div>
        <div class="exp-item">
          <div class="exp-date">April 2024 - September 2024</div>
          <div class="exp-title">Chinese Academy of Sciences (CASIA) - AIGC, LLM Agent - MAIS</div>
        </div>
        <div class="exp-item">
          <div class="exp-date">November 2023 - January 2024</div>
          <div class="exp-title">Red Note - Software Engineer Intern - Content Publishing Team</div>
        </div>
        <div class="exp-item">
          <div class="exp-date">August 2023 - November 2023</div>
          <div class="exp-title">Sohu - Software Engineer Intern - Big Data Center</div>
        </div>
      </div>`;
    });
    
    this.register('education', 'Education background', () => {
      return `<div class="education">
        <div class="edu-item">
          <div class="edu-date">2025 - 2028</div>
          <div class="edu-title">BUPT - LLM, AIGC, RAG</div>
        </div>
        <div class="edu-item">
          <div class="edu-date">2021 - 2025</div>
          <div class="edu-title">USTB</div>
          <div class="edu-note">Ranked 2nd in the major</div>
          <div class="edu-note">Member at <a href="https://ustb-806.github.io/" target="_blank">USTB-806</a></div>
        </div>
      </div>`;
    });
    
    this.register('hobbies', 'My hobbies and interests', () => {
      return `<div class="hobbies">
        <ol>
          <li><strong>🎸 Guitar:</strong> I developed an interest in playing the guitar after watching "Bocchi the Rock!" in 2023. I haven't been practicing for long, so my skills are still quite basic.</li>
          <p>Hanairo no Seisyun - Utatanekana - Too many losing heroines!</p>
          <div class="media-container">
            <video class="media-video" src="http://s3.neko.soulter.top/personal/soulter-huaseqingchun-ver1.mp4" controls loop preload="metadata" playsinline></video>
          </div>
          <li><strong>🪐 Astronomy:</strong> I enjoy watching sci-fi movies, novels, and documentaries about the universe. I highly recommend the documentary "How the Universe Works" which sparked my interest in this field.</li>
          <div class="media-container">
            <img class="media-img" src="https://drive.soulter.top/f/znF4/7.jpg" alt="Astronomy night">
            <p class="media-caption">We(<a href="https://blog.bosswnx.xyz/">Nelson</a>, <a href="https://kevin56348.github.io/blog/">Kevin</a>) stayed up all night to capture the Quadrantid meteor shower 🌠 at the Beijing Bulaotun Observatory. Photo by kevin, camera by nelson</p>
          </div>
          <li><strong>📺 Anime:</strong> I love watching anime. You can find the list of anime I've watched <a href="https://blog.soulter.top/doing" target="_blank">here</a>.</li>
          <li><strong>📺 Video Editing and Content Creation:</strong> In 2015, after watching Minecraft videos by ZiMin, I was inspired to create my own and upload them to Youku. I ended up uploading over a hundred Minecraft videos, which are now my black history :(. In 2017, I moved to Bilibili. Due to my busy studies, I have stopped updating for now.</li>
          <li><strong>💻 Gadgets:</strong> I love all kinds of electronic devices</li>
          <li><strong>🎮 Gaming:</strong> Minecraft / Apex Legends / …</li>
        </ol>
      </div>`;
    });

    this.register('clear', 'Clear the screen', () => {
      this.commandOutput.innerHTML = '';
      return null; // 不需要输出
    });

    this.register('blog', 'My blog', () => {
        return `<p>My blog is <a href="https://blog.soulter.top" target="_blank">here</a>.</p>`;
        }
    );

    // 添加社交媒体命令
    this.register('github', 'Visit my GitHub profile', () => {
      window.open('https://github.com/Soulter', '_blank');
      return 'Opening GitHub profile...';
    });
    
    this.register('wechat', 'My WeChat QR code', () => {
      return `<div class="media-container">
        <img class="media-img" src="https://drive.soulter.top/f/pYfA/d903f4fa49a496fda3f16d2be9e023b5.png" alt="WeChat QR Code">
        <p class="media-caption">Scan QR code to add my WeChat</p>
      </div>`;
    });

    this.register('social', 'All my social links', () => {
      return `<p>Find me on social media:</p>
      <ul class="social-links">
        <li><a href="https://github.com/Soulter" target="_blank">GitHub</a></li>
        <li><a href="https://space.bilibihelpli.com/29867566" target="_blank">Bilibili</a></li>
        <li><a href="https://music.163.com/#/user/home?id=432494501" target="_blank">NetEase Music</a></li>
        <li><a href="https://afdian.com/a/soulter" target="_blank">Afdian</a></li>
        <li><a href="https://steamcommunity.com/profiles/76561198392031497" target="_blank">Steam</a></li>
      </ul>
      <p>Type <code>wechat</code> to see my WeChat QR code.</p>`;
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
