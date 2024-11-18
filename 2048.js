class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.init();
        this.initTouchControls();
    }

    init() {
        // 初始化游戏面板
        this.createGrid();
        // 添加两个初始数字
        this.addNewNumber();
        this.addNewNumber();
        // 添加键盘事件
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        // 绘制初始状态
        this.updateDisplay();
    }

    createGrid() {
        const gridContainer = document.getElementById('grid');
        gridContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
    }

    addNewNumber() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    handleKeyPress(event) {
        if (this.gameOver) return;

        let moved = false;
        switch(event.keyCode) {
            case 37: // 左
                moved = this.moveLeft();
                break;
            case 38: // 上
                moved = this.moveUp();
                break;
            case 39: // 右
                moved = this.moveRight();
                break;
            case 40: // 下
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addNewNumber();
            this.updateDisplay();
            if (this.checkGameOver()) {
                this.gameOver = true;
                alert('游戏结束！得分：' + this.score);
            }
        }
    }

    moveLeft() {
        return this.move(row => row, row => row);
    }

    moveRight() {
        return this.move(row => row.reverse(), row => row.reverse());
    }

    moveUp() {
        return this.move(
            this.rotateGrid,
            this.rotateGrid.bind(this, true)
        );
    }

    moveDown() {
        return this.move(
            grid => this.rotateGrid(this.rotateGrid(this.rotateGrid(grid))),
            grid => this.rotateGrid(grid, true)
        );
    }

    move(beforeMove, afterMove) {
        const oldGrid = JSON.stringify(this.grid);
        this.grid = beforeMove(this.grid);
        
        for (let i = 0; i < 4; i++) {
            this.grid[i] = this.mergeLine(this.grid[i]);
        }
        
        this.grid = afterMove(this.grid);
        return oldGrid !== JSON.stringify(this.grid);
    }

    mergeLine(line) {
        // 移除空格
        line = line.filter(cell => cell !== 0);
        // 合并相同的数字
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1]) {
                line[i] *= 2;
                this.score += line[i];
                line.splice(i + 1, 1);
            }
        }
        // 补充空格
        while (line.length < 4) {
            line.push(0);
        }
        return line;
    }

    rotateGrid(grid = this.grid, reverse = false) {
        const newGrid = Array(4).fill().map(() => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (reverse) {
                    newGrid[3 - j][i] = grid[i][j];
                } else {
                    newGrid[j][3 - i] = grid[i][j];
                }
            }
        }
        return newGrid;
    }

    checkGameOver() {
        // 检查是否还有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        
        // 检查是否还能合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[i][j] === this.grid[i][j + 1]) return false;
                if (this.grid[j][i] === this.grid[j + 1][i]) return false;
            }
        }

        if (this.isGameOver()) {
            if (confirm('游戏结束！得分：' + this.score + '\n是否重新开始？')) {
                this.init();
            } else {
                // 如果不重新开始，就返回主页
                window.location.href = 'fire.html';
            }
            return true;
        }
        return false;
    }

    updateDisplay() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const value = this.grid[i][j];
                cell.textContent = value || '';
                cell.style.backgroundColor = this.getBackgroundColor(value);
                cell.style.color = value <= 4 ? '#776e65' : '#f9f6f2';
            }
        }
    }

    getBackgroundColor(value) {
        const colors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[value] || '#3c3a32';
    }

    initTouchControls() {
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.moveLeft()) {
                this.addNewNumber();
                this.updateDisplay();
                this.checkGameOver();
            }
        });

        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.moveRight()) {
                this.addNewNumber();
                this.updateDisplay();
                this.checkGameOver();
            }
        });

        document.getElementById('upBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.moveUp()) {
                this.addNewNumber();
                this.updateDisplay();
                this.checkGameOver();
            }
        });

        document.getElementById('downBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.moveDown()) {
                this.addNewNumber();
                this.updateDisplay();
                this.checkGameOver();
            }
        });
    }
}

// 添加退出游戏函数
window.quitGame = function() {
    if (confirm('确定要退出游戏吗？')) {
        // 直接返回主页，不重新开始游戏
        window.location.href = 'fire.html';
    }
}; 