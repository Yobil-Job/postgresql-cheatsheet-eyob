// Sidebar navigation logic
const sidebarLinks = document.querySelectorAll('.sidebar nav ul li');
const sections = document.querySelectorAll('.content-section');

// Explicit mapping from sidebar text to section IDs
const sectionMap = {
    'Introduction': 'introduction',
    'Database Operations': 'database-operations',
    'Table Operations': 'table-operations',
    'Data Types': 'data-types',
    'Constraints': 'constraints',
    'Inserting Data': 'inserting-data',
    'Basic Queries': 'basic-queries',
    'WHERE & Operators': 'where-operators',
    'Sorting & Limiting': 'sorting-limiting',
    'UPDATE & DELETE': 'update-delete',
    'Pattern Matching': 'pattern-matching',
    'NULL Checks': 'null-checks',
    'Aggregate Functions': 'aggregate-functions',
    'GROUP BY & HAVING': 'group-by-having',
    'Joins': 'joins',
    'Set Operations': 'set-operations',
    'Subqueries': 'subqueries',
    'Views': 'views',
    'Transactions': 'transactions',
    'Indexes': 'indexes',
    'Export / Import': 'export-import',
    'psql Commands': 'psql-commands',
    'Functions & Expressions': 'functions-expressions',
    'Window Functions': 'window-functions',
    'SQL Playground': 'sql-playground',
    'Developer Info': 'developer-info',
    'Cheat Sheet Summary': 'cheat-sheet-summary',
    'Tips': 'tips'
};

sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
        document.querySelector('.sidebar nav ul li.active').classList.remove('active');
        link.classList.add('active');
        sections.forEach(section => section.classList.remove('active'));
        const sectionId = sectionMap[link.textContent.trim()];
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    });
});

// Dark/Light mode toggle
const themeToggle = document.getElementById('theme-toggle');
let darkMode = true;

themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    } else {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    }
});

// Show Introduction section by default
document.getElementById('introduction').classList.add('active');

// SQL Playground logic
const playgroundQueries = {
    'select-all': {
        label: 'SELECT all employees',
        query: 'SELECT * FROM employees;',
        desc: 'Show all employees in the company.',
        outputType: 'table',
        output: [
            ['id', 'name', 'department', 'salary', 'is_active'],
            [1, 'Alice', 'IT', 70000, true],
            [2, 'Bob', 'HR', 50000, true],
            [3, 'Carol', 'Finance', 60000, false],
            [4, 'David', 'IT', 80000, true],
            [5, 'Eve', 'Finance', 65000, true]
        ]
    },
    'select-where': {
        label: 'SELECT IT employees',
        query: `SELECT * FROM employees WHERE department = 'IT';`,
        desc: 'Show all employees in the IT department.',
        outputType: 'table',
        output: [
            ['id', 'name', 'department', 'salary', 'is_active'],
            [1, 'Alice', 'IT', 70000, true],
            [4, 'David', 'IT', 80000, true]
        ]
    },
    'aggregate-count': {
        label: 'Count employees per department',
        query: 'SELECT department, COUNT(*) FROM employees GROUP BY department;',
        desc: 'Count the number of employees in each department.',
        outputType: 'table',
        output: [
            ['department', 'count'],
            ['IT', 2],
            ['HR', 1],
            ['Finance', 2]
        ]
    },
    'update-salary': {
        label: 'Update IT salaries',
        query: `UPDATE employees SET salary = salary * 1.1 WHERE department = 'IT';`,
        desc: 'Increase salary by 10% for all IT employees.',
        outputType: 'message',
        output: 'Query OK. 2 rows affected. (IT employees now have higher salaries)'
    },
    'delete-inactive': {
        label: 'Delete inactive employees',
        query: `DELETE FROM employees WHERE is_active = FALSE;`,
        desc: 'Delete all employees who are not active.',
        outputType: 'message',
        output: 'Query OK. 1 row deleted. (Carol removed)'
    },
    'insert-employee': {
        label: 'Insert a new employee',
        query: `INSERT INTO employees (name, department, salary, is_active) VALUES ('Frank', 'IT', 72000, TRUE);`,
        desc: 'Add a new employee named Frank to the IT department.',
        outputType: 'message',
        output: 'Query OK. 1 row inserted. (Frank added)'
    },
    'pattern-matching': {
        label: 'Pattern matching (LIKE)',
        query: `SELECT * FROM employees WHERE name LIKE 'A%';`,
        desc: 'Find employees whose names start with A.',
        outputType: 'table',
        output: [
            ['id', 'name', 'department', 'salary', 'is_active'],
            [1, 'Alice', 'IT', 70000, true]
        ]
    },
    'null-checks': {
        label: 'Check for NULLs',
        query: `SELECT * FROM employees WHERE department IS NULL;`,
        desc: 'Find employees with no department (none in sample data).',
        outputType: 'table',
        output: [
            ['id', 'name', 'department', 'salary', 'is_active']
        ]
    },
    'group-having': {
        label: 'Departments with avg salary > 60000',
        query: `SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 60000;`,
        desc: 'Show departments with an average salary above 60,000.',
        outputType: 'table',
        output: [
            ['department', 'avg'],
            ['IT', 75000],
            ['Finance', 62500]
        ]
    },
    'aggregate-sum': {
        label: 'Sum of all salaries',
        query: `SELECT SUM(salary) FROM employees;`,
        desc: 'Get the total sum of all employee salaries.',
        outputType: 'table',
        output: [
            ['sum'],
            [325000]
        ]
    },
    'math-functions': {
        label: 'Math functions',
        query: `SELECT ROUND(1.5), FLOOR(1.9), CEIL(1.2);`,
        desc: 'Use math functions in SELECT.',
        outputType: 'table',
        output: [
            ['round', 'floor', 'ceil'],
            [2, 1, 2]
        ]
    },
    'string-functions': {
        label: 'String functions',
        query: `SELECT LENGTH('abc'), UPPER('abc'), LOWER('ABC'), CONCAT('a','b');`,
        desc: 'Use string functions in SELECT.',
        outputType: 'table',
        output: [
            ['length', 'upper', 'lower', 'concat'],
            [3, 'ABC', 'abc', 'ab']
        ]
    },
    'date-functions': {
        label: 'Date/time functions',
        query: `SELECT NOW(), CURRENT_DATE, CURRENT_TIME;`,
        desc: 'Get the current date and time.',
        outputType: 'table',
        output: [
            ['now', 'current_date', 'current_time'],
            ['2024-05-01 10:00:00', '2024-05-01', '10:00:00']
        ]
    },
    'join-example': {
        label: 'Join example',
        query: `SELECT e.name, d.name FROM employees e INNER JOIN departments d ON e.department = d.name;`,
        desc: 'Join employees with departments (departments table not shown here).',
        outputType: 'table',
        output: [
            ['name', 'name'],
            ['Alice', 'IT'],
            ['Bob', 'HR'],
            ['Carol', 'Finance'],
            ['David', 'IT'],
            ['Eve', 'Finance']
        ]
    },
    'join-inner': {
        label: 'INNER JOIN employees & departments',
        query: `SELECT e.name, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id;`,
        desc: 'Show each employee with their department name using INNER JOIN.',
        outputType: 'table',
        output: [
            ['name', 'department'],
            ['Alice', 'IT'],
            ['Bob', 'HR'],
            ['Carol', 'Finance'],
            ['David', 'IT'],
            ['Eve', 'Finance']
        ]
    },
    'join-left': {
        label: 'LEFT JOIN employees & departments',
        query: `SELECT e.name, d.name AS department FROM employees e LEFT JOIN departments d ON e.department_id = d.id;`,
        desc: 'Show all employees and their department (if any) using LEFT JOIN.',
        outputType: 'table',
        output: [
            ['name', 'department'],
            ['Alice', 'IT'],
            ['Bob', 'HR'],
            ['Carol', 'Finance'],
            ['David', 'IT'],
            ['Eve', 'Finance']
        ]
    }
};

const querySelect = document.getElementById('query-select');
const queryDesc = document.getElementById('query-description');
const playgroundEditor = document.getElementById('playground-editor');
const runQueryBtn = document.getElementById('run-query');
const playgroundOutput = document.getElementById('playground-output');

// Populate dropdown with all queries
if (querySelect) {
    querySelect.innerHTML = '';
    Object.entries(playgroundQueries).forEach(([key, val]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = val.label;
        querySelect.appendChild(opt);
    });
}

function renderOutput(val) {
    const q = playgroundQueries[val];
    if (q.outputType === 'table') {
        let html = '<div class="playground-table"><table><thead><tr>';
        q.output[0].forEach(h => { html += `<th>${h}</th>`; });
        html += '</tr></thead><tbody>';
        for (let i = 1; i < q.output.length; i++) {
            html += '<tr>';
            q.output[i].forEach(cell => { html += `<td>${cell}</td>`; });
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        playgroundOutput.innerHTML = html;
    } else {
        playgroundOutput.textContent = q.output;
    }
}

function updatePlayground() {
    const val = querySelect.value;
    playgroundEditor.value = playgroundQueries[val].query;
    queryDesc.textContent = playgroundQueries[val].desc;
    playgroundOutput.textContent = '';
}

querySelect.addEventListener('change', updatePlayground);
runQueryBtn.addEventListener('click', () => {
    const val = querySelect.value;
    renderOutput(val);
});

// Initialize playground on load
if (querySelect) updatePlayground();

function copyCode(btn) {
    const code = btn.nextElementSibling.querySelector('code') || btn.parentElement.querySelector('code');
    if (code) {
        const text = code.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
            }, 1200);
        });
    }
} 