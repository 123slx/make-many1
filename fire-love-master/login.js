$(document).ready(function() {
    // 检查是否已登录
    if (localStorage.getItem('isLoggedIn')) {
        window.location.href = 'fire.html';
    }

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // 修改用户名为 sunlanxing
        if (username === 'sunlanxing' && password === '123456') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'fire.html';
        } else {
            alert('用户名或密码错误！');
        }
    });
}); 