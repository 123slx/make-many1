class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.blockSize = 30;
        this.cols = this.canvas.width / this.blockSize;
        this.rows = this.canvas.height / this.blockSize;
        this.score = 0;
        
        // 方块形状定义
        this.shapes = {
            I: [[1,1,1,1]],
            T: [[1,1,1],[0,1,0]],
            L: [[1,1,1],[1,0,0]],
            J: [[1,1,1],[0,0,1]],
            O: [[1,1],[1,1]],
            Z: [[1,1,0],[0,1,1]],
            S: [[0,1,1],[1,1,0]]
        };
        
        this.colors = {
            I: '#00f0f0',
            O: '#f0f000',
            T: '#a000f0',
            S: '#00f000',
            Z: '#f00000',
            J: '#0000f0',
            L: '#f0a000'
        };

        this.init();
        this.initTouchControls();
    }

    init() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.gameOver = false;
        this.score = 0;
        this.updateScore();
        this.createNewPiece();
        
        // 键盘事件监听
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 开始游戏循环
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.gameLoop();
    }

    createNewPiece() {
        const shapes = Object.keys(this.shapes);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        this.currentPiece = {
            shape: this.shapes[randomShape],
            color: this.colors[randomShape],
            x: Math.floor(this.cols / 2) - Math.floor(this.shapes[randomShape][0].length / 2),
            y: 0
        };
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    handleKeyPress(event) {
        if (this.gameOver) return;

        switch(event.keyCode) {
            case 37: // 左箭头
                if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y)) {
                    this.currentPiece.x--;
                }
                break;
            case 39: // 右箭头
                if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y)) {
                    this.currentPiece.x++;
                }
                break;
            case 40: // 下箭头
                if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1)) {
                    this.currentPiece.y++;
                    this.score += 1;
                    this.updateScore();
                }
                break;
            case 38: // 上箭头（旋转）
                this.rotatePiece();
                break;
        }
        this.draw();
    }

    rotatePiece() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    isValidMove(x, y, shape = this.currentPiece.shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.cols || 
                        newY >= this.rows ||
                        (newY >= 0 && this.grid[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    mergePiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const gridY = this.currentPiece.y + y;
                    if (gridY >= 0) {
                        this.grid[gridY][this.currentPiece.x + x] = this.currentPiece.color;
                    }
                }
            });
        });
        
        this.checkLines();
        this.createNewPiece();
        
        if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
            if (confirm('游戏结束！得分：' + this.score + '\n是否重新开始？')) {
                this.init();
            } else {
                window.location.href = 'fire.html';
            }
        }
    }

    checkLines() {
        let linesCleared = 0;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                row++; // 检查同一行（因为上面的行下移了）
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.updateScore();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#ddd';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.ctx.strokeRect(
                    j * this.blockSize,
                    i * this.blockSize,
                    this.blockSize,
                    this.blockSize
                );
            }
        }
        
        // 绘制已固定的方块
        this.grid.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    this.drawBlock(x, y, color);
                }
            });
        });
        
        // 绘制当前方块
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(
                        this.currentPiece.x + x,
                        this.currentPiece.y + y,
                        this.currentPiece.color
                    );
                }
            });
        });
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize - 1,
            this.blockSize - 1
        );
    }

    gameLoop(timestamp = 0) {
        if (this.gameOver) return;

        const deltaTime = timestamp - this.lastTime;
        
        if (deltaTime > this.dropInterval) {
            if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1)) {
                this.currentPiece.y++;
            } else {
                this.mergePiece();
                if (this.gameOver) return;
            }
            this.lastTime = timestamp;
        }
        
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initTouchControls() {
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y)) {
                this.currentPiece.x--;
                this.draw();
            }
        });

        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y)) {
                this.currentPiece.x++;
                this.draw();
            }
        });

        document.getElementById('rotateBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.rotatePiece();
            this.draw();
        });

        document.getElementById('downBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1)) {
                this.currentPiece.y++;
                this.score += 1;
                this.updateScore();
                this.draw();
            }
        });
    }
}

// 添加退出游戏函数
window.quitGame = function() {
    if (confirm('确定要退出游戏吗？')) {
        window.location.href = 'fire.html';
    }
}; 