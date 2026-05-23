const templates = [
    {
        id: 'professional-1',
        name: '商务精英',
        category: 'professional',
        layout: 'left-right',
        style: 'professional',
        color: '#1e3a5f'
    },
    {
        id: 'professional-2',
        name: '现代简约',
        category: 'professional',
        layout: 'top-bottom',
        style: 'minimal',
        color: '#374151'
    },
    {
        id: 'fresh-1',
        name: '清新校园',
        category: 'fresh',
        layout: 'left-right',
        style: 'fresh',
        color: '#059669'
    },
    {
        id: 'fresh-2',
        name: '活力应届',
        category: 'fresh',
        layout: 'top-bottom',
        style: 'elegant',
        color: '#0891b2'
    },
    {
        id: 'parttime-1',
        name: '实习达人',
        category: 'parttime',
        layout: 'left-right',
        style: 'parttime',
        color: '#d97706'
    },
    {
        id: 'parttime-2',
        name: '兼职能手',
        category: 'parttime',
        layout: 'top-bottom',
        style: 'minimal',
        color: '#7c3aed'
    },
    {
        id: 'creative-1',
        name: '创意设计师',
        category: 'creative',
        layout: 'left-right',
        style: 'creative',
        color: '#7c3aed'
    },
    {
        id: 'creative-2',
        name: '艺术风格',
        category: 'creative',
        layout: 'top-bottom',
        style: 'elegant',
        color: '#db2777'
    }
];

const state = {
    currentTemplate: templates[0],
    basicInfo: {
        name: '',
        title: '',
        phone: '',
        email: '',
        website: '',
        location: '',
        avatar: ''
    },
    career: {
        position: '',
        salary: '',
        targetLocation: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    summary: '',
    style: {
        themeColor: '#2563eb',
        fontSize: 'medium',
        layout: 'left-right'
    }
};

let editingEntry = null;
let editingType = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderTemplateGrid();
    setupEventListeners();
    loadFromStorage();
    renderResume();
}

function renderTemplateGrid(filter = 'all') {
    const grid = document.getElementById('template-grid');
    const filteredTemplates = filter === 'all' 
        ? templates 
        : templates.filter(t => t.category === filter);

    grid.innerHTML = filteredTemplates.map(template => `
        <div class="template-card" data-template-id="${template.id}">
            <div class="template-preview">
                ${generateTemplatePreview(template)}
            </div>
            <div class="template-info">
                <div class="template-name">${template.name}</div>
                <div class="template-category">
                    <span class="template-badge">${getCategoryName(template.category)}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.templateId;
            selectTemplate(templateId);
        });
    });
}

function generateTemplatePreview(template) {
    return `
        <div class="resume-template template-${template.style} layout-${template.layout}" 
             style="transform: scale(0.5); transform-origin: top left; width: 200%; height: 200%;">
            <div class="header-section">
                <h1 style="color: ${template.color}">张三</h1>
                <p style="color: #666; font-size: 14px;">高级前端开发工程师</p>
            </div>
            <div class="resume-content">
                <div class="sidebar-section-resume">
                    <div style="margin-bottom: 16px;">
                        <strong>联系方式</strong>
                        <p style="font-size: 12px; color: #888;">📱 138-0000-0000</p>
                        <p style="font-size: 12px; color: #888;">✉️ email@example.com</p>
                    </div>
                    <div class="section-title" style="color: ${template.color}">技能特长</div>
                    <div class="skills-list">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">Vue</span>
                    </div>
                </div>
                <div class="main-section-resume">
                    <div class="section">
                        <div class="section-title" style="color: ${template.color}">工作经历</div>
                        <div class="experience-item">
                            <div class="item-header">
                                <span class="item-title">高级前端工程师</span>
                                <span class="item-date">2020-至今</span>
                            </div>
                            <p class="item-content">负责公司核心产品前端架构设计与开发</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const names = {
        professional: '职场精英',
        fresh: '应届生',
        parttime: '兼职实习',
        creative: '创意设计'
    };
    return names[category] || category;
}

function selectTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        state.currentTemplate = template;
        state.style.layout = template.layout;
        document.querySelector('[data-tab="editor"]').click();
        renderResume();
        saveToStorage();
        showToast('模板已选择');
    }
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTemplateGrid(tab.dataset.category);
        });
    });

    document.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', (e) => {
            const field = e.target.dataset.field;
            if (field in state.basicInfo) {
                state.basicInfo[field] = e.target.value;
            } else if (field in state.career) {
                state.career[field] = e.target.value;
            } else if (field === 'summary') {
                state.summary = e.target.value;
            }
            renderResume();
            saveToStorage();
        });
    });

    document.getElementById('upload-btn').addEventListener('click', () => {
        document.getElementById('avatar-input').click();
    });

    document.getElementById('avatar-preview').addEventListener('click', () => {
        document.getElementById('avatar-input').click();
    });

    document.getElementById('avatar-input').addEventListener('change', handleAvatarUpload);

    document.getElementById('add-education').addEventListener('click', () => openModal('education'));
    document.getElementById('add-experience').addEventListener('click', () => openModal('experience'));
    document.getElementById('add-project').addEventListener('click', () => openModal('project'));
    document.getElementById('add-skill').addEventListener('click', () => openModal('skill'));

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveModalEntry);

    document.getElementById('theme-color').addEventListener('input', (e) => {
        state.style.themeColor = e.target.value;
        renderResume();
        saveToStorage();
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        state.style.fontSize = e.target.value;
        renderResume();
        saveToStorage();
    });

    document.getElementById('layout-style').addEventListener('change', (e) => {
        state.style.layout = e.target.value;
        renderResume();
        saveToStorage();
    });

    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('back-to-edit').addEventListener('click', () => {
        switchTab('editor');
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === `${tabName}-section`);
    });

    if (tabName === 'preview') {
        renderPreviewLarge();
    }
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            showToast('图片大小不能超过2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            state.basicInfo.avatar = event.target.result;
            document.getElementById('avatar-preview').innerHTML = 
                `<img src="${event.target.result}" alt="头像">`;
            renderResume();
            saveToStorage();
            showToast('头像上传成功');
        };
        reader.readAsDataURL(file);
    }
}

function openModal(type) {
    editingEntry = null;
    editingType = type;
    const modal = document.getElementById('entry-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const titles = {
        education: '添加教育经历',
        experience: '添加工作经历',
        project: '添加项目经验',
        skill: '添加技能'
    };

    modalTitle.textContent = titles[type];
    modalBody.innerHTML = getModalFormHTML(type);
    modal.classList.add('active');
}

function getModalFormHTML(type) {
    switch(type) {
        case 'education':
            return `
                <div class="form-group">
                    <label>学校名称</label>
                    <input type="text" id="modal-school" placeholder="请输入学校名称">
                </div>
                <div class="form-group">
                    <label>专业/学位</label>
                    <input type="text" id="modal-major" placeholder="如：计算机科学与技术 / 学士">
                </div>
                <div class="form-group">
                    <label>在校时间</label>
                    <input type="text" id="modal-edu-date" placeholder="如：2018.09 - 2022.06">
                </div>
                <div class="form-group">
                    <label>详细描述</label>
                    <textarea id="modal-edu-desc" rows="3" placeholder="GPA、荣誉、相关课程等..."></textarea>
                </div>
            `;
        case 'experience':
            return `
                <div class="form-group">
                    <label>公司名称</label>
                    <input type="text" id="modal-company" placeholder="请输入公司名称">
                </div>
                <div class="form-group">
                    <label>职位名称</label>
                    <input type="text" id="modal-position" placeholder="请输入职位名称">
                </div>
                <div class="form-group">
                    <label>工作时间</label>
                    <input type="text" id="modal-exp-date" placeholder="如：2020.03 - 至今">
                </div>
                <div class="form-group">
                    <label>工作描述</label>
                    <textarea id="modal-exp-desc" rows="4" placeholder="主要工作内容和成就..."></textarea>
                </div>
            `;
        case 'project':
            return `
                <div class="form-group">
                    <label>项目名称</label>
                    <input type="text" id="modal-project-name" placeholder="请输入项目名称">
                </div>
                <div class="form-group">
                    <label>项目角色</label>
                    <input type="text" id="modal-project-role" placeholder="如：前端开发负责人">
                </div>
                <div class="form-group">
                    <label>项目时间</label>
                    <input type="text" id="modal-project-date" placeholder="如：2022.01 - 2022.06">
                </div>
                <div class="form-group">
                    <label>项目描述</label>
                    <textarea id="modal-project-desc" rows="4" placeholder="项目背景、技术栈、主要成果..."></textarea>
                </div>
            `;
        case 'skill':
            return `
                <div class="form-group">
                    <label>技能名称</label>
                    <input type="text" id="modal-skill-name" placeholder="如：JavaScript">
                </div>
                <div class="form-group">
                    <label>熟练程度</label>
                    <select id="modal-skill-level">
                        <option value="精通">精通</option>
                        <option value="熟练">熟练</option>
                        <option value="熟悉">熟悉</option>
                        <option value="了解">了解</option>
                    </select>
                </div>
            `;
        default:
            return '';
    }
}

function closeModal() {
    document.getElementById('entry-modal').classList.remove('active');
    editingEntry = null;
    editingType = null;
}

function saveModalEntry() {
    let entry = {};

    switch(editingType) {
        case 'education':
            entry = {
                school: document.getElementById('modal-school').value,
                major: document.getElementById('modal-major').value,
                date: document.getElementById('modal-edu-date').value,
                desc: document.getElementById('modal-edu-desc').value
            };
            if (!entry.school || !entry.major) {
                showToast('请填写学校名称和专业');
                return;
            }
            break;
        case 'experience':
            entry = {
                company: document.getElementById('modal-company').value,
                position: document.getElementById('modal-position').value,
                date: document.getElementById('modal-exp-date').value,
                desc: document.getElementById('modal-exp-desc').value
            };
            if (!entry.company || !entry.position) {
                showToast('请填写公司名称和职位');
                return;
            }
            break;
        case 'project':
            entry = {
                name: document.getElementById('modal-project-name').value,
                role: document.getElementById('modal-project-role').value,
                date: document.getElementById('modal-project-date').value,
                desc: document.getElementById('modal-project-desc').value
            };
            if (!entry.name) {
                showToast('请填写项目名称');
                return;
            }
            break;
        case 'skill':
            entry = {
                name: document.getElementById('modal-skill-name').value,
                level: document.getElementById('modal-skill-level').value
            };
            if (!entry.name) {
                showToast('请填写技能名称');
                return;
            }
            break;
    }

    if (editingEntry !== null) {
        const listKey = editingType === 'education' ? 'education' : 
                        editingType === 'experience' ? 'experience' :
                        editingType === 'project' ? 'projects' : 'skills';
        state[listKey][editingEntry] = entry;
    } else {
        const listKey = editingType === 'education' ? 'education' : 
                        editingType === 'experience' ? 'experience' :
                        editingType === 'project' ? 'projects' : 'skills';
        state[listKey].push(entry);
    }

    closeModal();
    renderEntryLists();
    renderResume();
    saveToStorage();
    showToast(editingEntry !== null ? '已更新' : '已添加');
}

function editEntry(type, index) {
    editingEntry = index;
    editingType = type;
    const modal = document.getElementById('entry-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const listKey = type === 'education' ? 'education' : 
                    type === 'experience' ? 'experience' :
                    type === 'project' ? 'projects' : 'skills';
    const entry = state[listKey][index];

    const titles = {
        education: '编辑教育经历',
        experience: '编辑工作经历',
        project: '编辑项目经验',
        skill: '编辑技能'
    };

    modalTitle.textContent = titles[type];
    modalBody.innerHTML = getModalFormHTML(type);

    setTimeout(() => {
        switch(type) {
            case 'education':
                document.getElementById('modal-school').value = entry.school || '';
                document.getElementById('modal-major').value = entry.major || '';
                document.getElementById('modal-edu-date').value = entry.date || '';
                document.getElementById('modal-edu-desc').value = entry.desc || '';
                break;
            case 'experience':
                document.getElementById('modal-company').value = entry.company || '';
                document.getElementById('modal-position').value = entry.position || '';
                document.getElementById('modal-exp-date').value = entry.date || '';
                document.getElementById('modal-exp-desc').value = entry.desc || '';
                break;
            case 'project':
                document.getElementById('modal-project-name').value = entry.name || '';
                document.getElementById('modal-project-role').value = entry.role || '';
                document.getElementById('modal-project-date').value = entry.date || '';
                document.getElementById('modal-project-desc').value = entry.desc || '';
                break;
            case 'skill':
                document.getElementById('modal-skill-name').value = entry.name || '';
                document.getElementById('modal-skill-level').value = entry.level || '熟悉';
                break;
        }
    }, 0);

    modal.classList.add('active');
}

function deleteEntry(type, index) {
    if (confirm('确定要删除这条记录吗？')) {
        const listKey = type === 'education' ? 'education' : 
                        type === 'experience' ? 'experience' :
                        type === 'project' ? 'projects' : 'skills';
        state[listKey].splice(index, 1);
        renderEntryLists();
        renderResume();
        saveToStorage();
        showToast('已删除');
    }
}

function renderEntryLists() {
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    renderSkillsList();
}

function renderEducationList() {
    const list = document.getElementById('education-list');
    list.innerHTML = state.education.map((item, index) => `
        <div class="entry-item">
            <div class="entry-item-header">
                <span class="entry-item-title">${item.school}</span>
                <div class="entry-item-actions">
                    <button class="edit-btn" onclick="editEntry('education', ${index})">编辑</button>
                    <button class="delete-btn" onclick="deleteEntry('education', ${index})">删除</button>
                </div>
            </div>
            <div class="entry-item-content">${item.major} | ${item.date}</div>
        </div>
    `).join('');
}

function renderExperienceList() {
    const list = document.getElementById('experience-list');
    list.innerHTML = state.experience.map((item, index) => `
        <div class="entry-item">
            <div class="entry-item-header">
                <span class="entry-item-title">${item.position}</span>
                <div class="entry-item-actions">
                    <button class="edit-btn" onclick="editEntry('experience', ${index})">编辑</button>
                    <button class="delete-btn" onclick="deleteEntry('experience', ${index})">删除</button>
                </div>
            </div>
            <div class="entry-item-content">${item.company} | ${item.date}</div>
        </div>
    `).join('');
}

function renderProjectsList() {
    const list = document.getElementById('projects-list');
    list.innerHTML = state.projects.map((item, index) => `
        <div class="entry-item">
            <div class="entry-item-header">
                <span class="entry-item-title">${item.name}</span>
                <div class="entry-item-actions">
                    <button class="edit-btn" onclick="editEntry('project', ${index})">编辑</button>
                    <button class="delete-btn" onclick="deleteEntry('project', ${index})">删除</button>
                </div>
            </div>
            <div class="entry-item-content">${item.role} | ${item.date}</div>
        </div>
    `).join('');
}

function renderSkillsList() {
    const list = document.getElementById('skills-list');
    list.innerHTML = state.skills.map((item, index) => `
        <div class="entry-item">
            <div class="entry-item-header">
                <span class="entry-item-title">${item.name}</span>
                <div class="entry-item-actions">
                    <button class="edit-btn" onclick="editEntry('skill', ${index})">编辑</button>
                    <button class="delete-btn" onclick="deleteEntry('skill', ${index})">删除</button>
                </div>
            </div>
            <div class="entry-item-content">${item.level}</div>
        </div>
    `).join('');
}

function renderResume() {
    const resumePaper = document.getElementById('resume-paper');
    resumePaper.innerHTML = generateResumeHTML();
}

function generateResumeHTML() {
    const { currentTemplate, basicInfo, career, education, experience, projects, skills, summary, style } = state;
    const avatar = basicInfo.avatar ? `<img class="avatar" src="${basicInfo.avatar}" alt="头像">` : '';

    const leftRightLayout = style.layout === 'left-right';
    const fontSizeClass = `font-${style.fontSize}`;

    let html = `
        <div class="resume-template template-${currentTemplate.style} layout-${style.layout} ${fontSizeClass}" 
             style="--template-color: ${style.themeColor}; --template-bg: ${hexToRgba(style.themeColor, 0.1)};">
    `;

    if (leftRightLayout) {
        html += `
            <div class="resume-content">
                <div class="sidebar-section-resume">
                    ${avatar}
                    <div style="margin-top: 16px;">
                        <h2 style="color: ${style.themeColor}; font-size: 14px;">基本信息</h2>
                        ${basicInfo.name ? `<p style="margin: 8px 0;"><strong>${basicInfo.name}</strong></p>` : ''}
                        ${basicInfo.title ? `<p style="color: #666; font-size: 13px;">${basicInfo.title}</p>` : ''}
                    </div>
                    
                    ${(basicInfo.phone || basicInfo.email || basicInfo.location) ? `
                    <div style="margin-top: 16px;">
                        <h3 style="font-size: 13px; margin-bottom: 8px;">联系方式</h3>
                        ${basicInfo.phone ? `<p style="font-size: 12px; color: #666;">📱 ${basicInfo.phone}</p>` : ''}
                        ${basicInfo.email ? `<p style="font-size: 12px; color: #666;">✉️ ${basicInfo.email}</p>` : ''}
                        ${basicInfo.location ? `<p style="font-size: 12px; color: #666;">📍 ${basicInfo.location}</p>` : ''}
                        ${basicInfo.website ? `<p style="font-size: 12px; color: #666;">🌐 ${basicInfo.website}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    ${career.position || career.salary || career.targetLocation ? `
                    <div style="margin-top: 16px;">
                        <h3 style="font-size: 13px; margin-bottom: 8px;">求职意向</h3>
                        ${career.position ? `<p style="font-size: 12px; color: #666;">职位：${career.position}</p>` : ''}
                        ${career.salary ? `<p style="font-size: 12px; color: #666;">薪资：${career.salary}</p>` : ''}
                        ${career.targetLocation ? `<p style="font-size: 12px; color: #666;">地点：${career.targetLocation}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    ${skills.length > 0 ? `
                    <div style="margin-top: 16px;">
                        <h3 style="font-size: 13px; margin-bottom: 8px; color: ${style.themeColor};">技能特长</h3>
                        <div class="skills-list">
                            ${skills.map(s => `<span class="skill-tag">${s.name} ${s.level ? `(${s.level})` : ''}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="main-section-resume">
                    ${education.length > 0 ? `
                    <div class="section">
                        <h2 style="color: ${style.themeColor};">教育经历</h2>
                        ${education.map(edu => `
                            <div class="education-item" style="margin-bottom: 14px;">
                                <div class="item-header">
                                    <span class="item-title">${edu.school}</span>
                                    <span class="item-date">${edu.date}</span>
                                </div>
                                <p class="item-subtitle">${edu.major}</p>
                                ${edu.desc ? `<p class="item-content" style="margin-top: 6px;">${edu.desc}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${experience.length > 0 ? `
                    <div class="section">
                        <h2 style="color: ${style.themeColor};">工作经历</h2>
                        ${experience.map(exp => `
                            <div class="experience-item" style="margin-bottom: 14px;">
                                <div class="item-header">
                                    <span class="item-title">${exp.position}</span>
                                    <span class="item-date">${exp.date}</span>
                                </div>
                                <p class="item-subtitle">${exp.company}</p>
                                ${exp.desc ? `<p class="item-content" style="margin-top: 6px;">${exp.desc}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${projects.length > 0 ? `
                    <div class="section">
                        <h2 style="color: ${style.themeColor};">项目经验</h2>
                        ${projects.map(proj => `
                            <div class="project-item" style="margin-bottom: 14px;">
                                <div class="item-header">
                                    <span class="item-title">${proj.name}</span>
                                    <span class="item-date">${proj.date}</span>
                                </div>
                                ${proj.role ? `<p class="item-subtitle">${proj.role}</p>` : ''}
                                ${proj.desc ? `<p class="item-content" style="margin-top: 6px;">${proj.desc}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${summary ? `
                    <div class="section">
                        <h2 style="color: ${style.themeColor};">自我评价</h2>
                        <p class="summary-text">${summary}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="resume-content">
                <div style="text-align: center; margin-bottom: 24px;">
                    ${avatar ? `<div style="margin-bottom: 12px;">${avatar}</div>` : ''}
                    ${basicInfo.name ? `<h1 style="color: ${style.themeColor}; font-size: 26px; margin-bottom: 4px;">${basicInfo.name}</h1>` : ''}
                    ${basicInfo.title ? `<p style="color: #666; font-size: 14px;">${basicInfo.title}</p>` : ''}
                </div>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
                    ${basicInfo.phone ? `<span style="font-size: 12px; color: #666;">📱 ${basicInfo.phone}</span>` : ''}
                    ${basicInfo.email ? `<span style="font-size: 12px; color: #666;">✉️ ${basicInfo.email}</span>` : ''}
                    ${basicInfo.location ? `<span style="font-size: 12px; color: #666;">📍 ${basicInfo.location}</span>` : ''}
                    ${basicInfo.website ? `<span style="font-size: 12px; color: #666;">🌐 ${basicInfo.website}</span>` : ''}
                </div>
                
                ${career.position || career.salary || career.targetLocation ? `
                <div style="margin-bottom: 20px; text-align: center;">
                    <strong>求职意向：</strong>${[career.position, career.salary, career.targetLocation].filter(Boolean).join(' | ')}
                </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="color: ${style.themeColor}; text-align: center; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${style.themeColor};">技能特长</h2>
                    <div class="skills-list" style="justify-content: center;">
                        ${skills.map(s => `<span class="skill-tag">${s.name} ${s.level ? `(${s.level})` : ''}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${education.length > 0 ? `
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="color: ${style.themeColor}; text-align: center; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${style.themeColor};">教育经历</h2>
                    ${education.map(edu => `
                        <div style="margin-bottom: 10px; text-align: center;">
                            <strong>${edu.school}</strong> | ${edu.major} | ${edu.date}
                            ${edu.desc ? `<p style="font-size: 12px; color: #666; margin-top: 4px;">${edu.desc}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="color: ${style.themeColor}; text-align: center; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${style.themeColor};">工作经历</h2>
                    ${experience.map(exp => `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>${exp.position}</strong>
                                <span style="color: #888; font-size: 12px;">${exp.date}</span>
                            </div>
                            <p style="font-size: 12px; color: #666;">${exp.company}</p>
                            ${exp.desc ? `<p style="font-size: 12px; color: #555; margin-top: 4px; line-height: 1.6;">${exp.desc}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${projects.length > 0 ? `
                <div class="section" style="margin-bottom: 20px;">
                    <h2 style="color: ${style.themeColor}; text-align: center; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${style.themeColor};">项目经验</h2>
                    ${projects.map(proj => `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>${proj.name}</strong>
                                <span style="color: #888; font-size: 12px;">${proj.date}</span>
                            </div>
                            ${proj.role ? `<p style="font-size: 12px; color: #666;">${proj.role}</p>` : ''}
                            ${proj.desc ? `<p style="font-size: 12px; color: #555; margin-top: 4px; line-height: 1.6;">${proj.desc}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${summary ? `
                <div class="section">
                    <h2 style="color: ${style.themeColor}; text-align: center; font-size: 14px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${style.themeColor};">自我评价</h2>
                    <p class="summary-text" style="text-align: center;">${summary}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderPreviewLarge() {
    const previewLarge = document.getElementById('resume-preview-large');
    previewLarge.innerHTML = generateResumeHTML();
}

async function exportToPDF() {
    const element = document.getElementById('resume-preview-large');
    const name = state.basicInfo.name || '我的简历';
    
    showToast('正在生成PDF，请稍候...');

    const opt = {
        margin: 0,
        filename: `${name}_简历.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
        showToast('PDF导出成功');
    } catch (error) {
        showToast('PDF导出失败，请重试');
        console.error(error);
    }
}

function saveToStorage() {
    try {
        localStorage.setItem('resumeBuilderState', JSON.stringify(state));
    } catch (e) {
        console.warn('无法保存到本地存储');
    }
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem('resumeBuilderState');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
            
            document.querySelectorAll('[data-field]').forEach(input => {
                const field = input.dataset.field;
                if (field in state.basicInfo && state.basicInfo[field]) {
                    input.value = state.basicInfo[field];
                } else if (field in state.career && state.career[field]) {
                    input.value = state.career[field];
                } else if (field === 'summary') {
                    input.value = state.summary;
                }
            });

            if (state.basicInfo.avatar) {
                document.getElementById('avatar-preview').innerHTML = 
                    `<img src="${state.basicInfo.avatar}" alt="头像">`;
            }

            document.getElementById('theme-color').value = state.style.themeColor;
            document.getElementById('font-size').value = state.style.fontSize;
            document.getElementById('layout-style').value = state.style.layout;

            renderEntryLists();
        }
    } catch (e) {
        console.warn('无法从本地存储加载');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

window.addEventListener('beforeunload', () => {
    saveToStorage();
});
