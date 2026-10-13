const delicateDom = {
    $: str => document.querySelectorAll(str),
    id: str => document.getElementById(str),
    _: str => document.createElement(str),
    dom: function() {
        return {
            modeBtn: this.id("mode-btn"),
            body: document.body || this.$("body")[0],
        }
    },
}

const delicate = {
    name: "Delicate",
    description: "simple but delicate theme for Hexo",
    author: "Kart Jim",
    doms: {},
    init: function() {
        const root = this;
        // dom 获取
        this.doms = Object.assign(
            { },
            this.doms,
            delicateDom.dom()
        );
        // 事件绑定
        // this.doms.modeBtn.addEventListener("click", (e) => {
        //     // e.preventDefault();
        //     root.toggleMode();
        // });
    },
    changeMode: function(type) {
        // dark to light
        if (type === 'dark') {
            this.doms.body.classList.add('dark');
        } else { // light to dark
            this.doms.body.classList.remove('dark');
        }
    },
    toggleMode: function() {
        this.doms.body.classList.toggle('dark');
    },
    toTop: function() {
        window.scrollTo(0, 0);
    },
}

window.delicate = delicate;

// 初始化
delicate.init();

/**
 * 给正文里的宽表格包一层可横向滚动的容器。
 * 表格列多 / 单元格内容长时，min-content 宽度会超过卡片宽度，
 * 直接撑破布局，这里用 overflow-x 容器兜住（代码块的行号表格不处理）。
 */
function wrapTables() {
    var tables = document.querySelectorAll('.article table');
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        if (table.closest('.highlight')) continue;
        var parent = table.parentElement;
        if (parent && parent.classList.contains('table-scroll')) continue;
        var wrapper = document.createElement('div');
        wrapper.className = 'table-scroll';
        parent.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    }
}

/**
 * 侧边目录（TOC）折叠开关，状态存 localStorage。
 */
function initTocToggle() {
    var STORAGE_KEY = 'delicate-toc-collapsed';
    var toggle = document.getElementById('toc-toggle');
    var container = document.querySelector('.toc-container');
    if (!toggle || !container) return;

    function readCollapsed() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function apply(collapsed) {
        container.classList.toggle('collapsed', collapsed);
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    function switchState() {
        var collapsed = !container.classList.contains('collapsed');
        apply(collapsed);
        try {
            localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        } catch (e) { /* 隐私模式下忽略 */ }
    }

    apply(readCollapsed());
    toggle.addEventListener('click', switchState);
    toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchState();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initTocToggle();
        wrapTables();
    });
} else {
    initTocToggle();
    wrapTables();
}
// 图片 / 字体加载完成后表格宽度可能变化，再兜一次（函数本身幂等）
window.addEventListener('load', wrapTables);
