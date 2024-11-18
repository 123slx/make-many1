class Snake {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}]; // 蛇的初始位置
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;

        // 添加键盘事件监听
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 初始化触摸控制
        this.initTouchControls();
        
        // 开始游戏循环
        this.gameLoop();
    }

    handleKeyPress(event) {
        switch(event.keyCode) {
            case 37: // 左
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 38: // 上
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 39: // 右
                if (this.direction !== 'left') this.direction = 'right';
                break;
            case 40: // 下
                if (this.direction !== 'up') this.direction = 'down';
                break;
        }
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    moveSnake() {
        if (this.gameOver) return;

        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'right': head.x++; break;
            case 'left': head.x--; break;
            case 'up': head.y--; break;
            case 'down': head.y++; break;
        }

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.generateFood();
            this.score += 10;
        } else {
            this.snake.pop();
        }

        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver = true;
            alert('游戏结束！得分：' + this.score);
            return;
        }

        this.snake.unshift(head);
    }

    checkCollision(head) {
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            if (confirm('游戏结束！得分：' + this.score + '\n是否重新开始？')) {
                this.init();
            } else {
                window.location.href = 'fire.html';
            }
            return true;
        }

        // 检查是否撞到自己
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            if (confirm('游戏结束！得分：' + this.score + '\n是否重新开始？')) {
                this.init();
            } else {
                window.location.href = 'fire.html';
            }
            return true;
        }
        return false;
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制分数
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('分数: ' + this.score, 10, 30);

        // 绘制蛇
        this.ctx.fillStyle = 'green';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // 绘制食物
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
    }

    gameLoop() {
        if (!this.gameOver) {
            this.moveSnake();
            this.draw();
            setTimeout(() => this.gameLoop(), 100);
        }
    }

    // 添加触摸控制初始化方法
    initTouchControls() {
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.direction !== 'right') this.direction = 'left';
        });

        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.direction !== 'left') this.direction = 'right';
        });

        document.getElementById('upBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.direction !== 'down') this.direction = 'up';
        });

        document.getElementById('downBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.direction !== 'up') this.direction = 'down';
        });
    }
}

// 添加退出游戏函数
window.quitGame = function() {
    if (confirm('确定要退出游戏吗？')) {
        window.location.href = 'fire.html';
    }
}; 