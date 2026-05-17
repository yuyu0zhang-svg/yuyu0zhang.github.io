// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCbhRNT87aHPFUzy6uGtHzyy9WoZ1k4u8",
    authDomain: "my-blog-33b2d.firebaseapp.com",
    projectId: "my-blog-33b2d",
    storageBucket: "my-blog-33b2d.firebasestorage.app",
    messagingSenderId: "168125912080",
    appId: "1:168125912080:web:bb921041a4990140072695"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = 'notification show ' + type;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 提交表单
function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
        showNotification('请填写所有字段！', 'error');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    
    db.collection('messages').add({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: new Date().toLocaleString('zh-CN')
    })
    .then(() => {
        showNotification(`感谢 ${name}，留言已收到！✨`, 'success');
        document.getElementById('contactForm').reset();
        submitBtn.disabled = false;
        submitBtn.textContent = '发送留言 ✈️';
    })
    .catch((error) => {
        console.error('错误:', error);
        showNotification('提交失败！', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '发送留言 ✈️';
    });
}

// 加载留言
function loadMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    db.collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            container.innerHTML = '';
            if (snapshot.empty) {
                container.innerHTML = '<p style="text-align:center; color:#999;">还没有留言~</p>';
                return;
            }
            snapshot.forEach((doc) => {
                const data = doc.data();
                const div = document.createElement('div');
                div.className = 'message-item';
                div.innerHTML = `
                    <div class="message-header">
                        <strong>${data.name}</strong>
                        <span class="message-time">${data.createdAt}</span>
                    </div>
                    <p class="message-content">${data.message}</p>
                `;
                container.appendChild(div);
            });
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleSubmit);
    loadMessages();
});