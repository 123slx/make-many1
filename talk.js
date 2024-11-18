$(function() {
    // 对话框按钮事件
    $('#yes').click(function(e) {
        // 防止事件冒泡
        e.stopPropagation();
        // 隐藏对话框
        $('.page_one').fadeOut();
        // 显示分享图片
        $('.share_img').fadeIn();
        
        // 3秒后隐藏分享图片并显示游戏选择界面
        setTimeout(function() {
            $('.share_img').fadeOut();
            $('#gameSelect').fadeIn();
        }, 3000);
    });

    $('#no').click(function() {
        // 获取按钮
        var $btn = $(this);
        // 随机移动按钮位置
        var x = Math.random() * ($(window).width() - $btn.width());
        var y = Math.random() * ($(window).height() - $btn.height());
        // 确保按钮不会移出屏幕
        x = Math.min(x, $(window).width() - $btn.width());
        y = Math.min(y, $(window).height() - $btn.height());
        // 设置新位置
        $btn.css({
            'position': 'fixed',
            'left': x + 'px',
            'top': y + 'px'
        });
    });

    // 点击分享图片时隐藏
    $('.share_img').click(function() {
        $(this).fadeOut();
        $('#gameSelect').fadeIn();
    });

    // 防止页面滚动
    document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
});
